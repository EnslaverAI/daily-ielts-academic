// ==========================================================================
// DAILY IELTS ACADEMIC 15 — MAIN APPLICATION CONTROLLER
// ==========================================================================

import { SEED_TASKS, renderTask1ChartSVG } from './tasks-bank.js';
import {
  generateFreshTaskWithGemini,
  evaluateSubmissionWithGemini,
  evaluateSubmissionLocally
} from './gemini-service.js';

const STORAGE_KEYS = {
  HISTORY: 'ielts15_history_v1',
  SEEN_IDS: 'ielts15_seen_ids_v1',
  CUSTOM_TASKS: 'ielts15_custom_tasks_v1',
  DRAFTS: 'ielts15_drafts_v1',
  API_KEY: 'ielts15_gemini_key_v1',
  THEME: 'ielts15_theme_v1'
};

const TARGET_SECONDS = 15 * 60; // 15:00 target reminder

const state = {
  currentSection: 'reading',
  writingSubMode: 'any',
  currentTask: null,
  history: [],
  seenIds: new Set(),
  customTasks: [],
  drafts: {},
  apiKey: '',
  theme: 'light',

  // Non-blocking 15-minute timer state
  timerRunning: false,
  elapsedSeconds: 0,
  timerInterval: null,

  // Part 2 Speaking 1-minute prep timer
  prepSeconds: 60,
  prepInterval: null,

  // Listening TTS state
  isPlayingAudio: false,
  currentScriptLineIndex: 0,
  playbackRate: 1.0,
  showTranscriptDuringTest: false,

  // Speaking Microphone Recorder state
  isRecording: false,
  mediaRecorder: null,
  recordedChunks: [],
  recordedAudioObj: null, // { base64, mimeType, url }
  speechRecognition: null
};

// ==========================================================================
// INITIALIZATION & PERSISTENCE
// ==========================================================================

function loadPersistedState() {
  try {
    const rawHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (rawHist) state.history = JSON.parse(rawHist);

    const rawSeen = localStorage.getItem(STORAGE_KEYS.SEEN_IDS);
    if (rawSeen) state.seenIds = new Set(JSON.parse(rawSeen));

    const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_TASKS);
    if (rawCustom) state.customTasks = JSON.parse(rawCustom);

    const rawDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (rawDrafts) state.drafts = JSON.parse(rawDrafts);

    const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (savedKey) state.apiKey = savedKey.trim();

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      state.theme = savedTheme;
    }
  } catch (e) {
    console.warn('Could not load saved state from localStorage:', e);
  }
}

function saveHistoryAndSeen() {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    localStorage.setItem(STORAGE_KEYS.SEEN_IDS, JSON.stringify([...state.seenIds]));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TASKS, JSON.stringify(state.customTasks));
  } catch (e) {
    console.warn('Failed to persist history:', e);
  }
  updateHeaderBadges();
}

function saveDraft(taskId, data) {
  if (!taskId) return;
  state.drafts[taskId] = data;
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(state.drafts));
  } catch (e) {
    // ignore quota errors
  }
}

function getAllTasks() {
  return [...state.customTasks, ...SEED_TASKS];
}

// ==========================================================================
// DAILY ROTATION & NON-REPEATING TASK SELECTION
// ==========================================================================

function computeRecommendedSkillForToday() {
  const skills = ['reading', 'writing', 'listening', 'speaking'];
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  // If user already practiced a skill today, suggest the next one in rotation
  const todayISO = new Date().toISOString().slice(0, 10);
  const doneToday = new Set(
    state.history
      .filter((h) => (h.dateISO || '').startsWith(todayISO))
      .map((h) => h.section)
  );
  for (let offset = 0; offset < skills.length; offset++) {
    const candidate = skills[(dayIndex + offset) % skills.length];
    if (!doneToday.has(candidate)) return candidate;
  }
  return skills[dayIndex % skills.length];
}

function pickNextUnseenTask(section, subMode = 'any', excludeCurrentId = null) {
  const all = getAllTasks().filter((t) => {
    if (t.section !== section) return false;
    if (section === 'writing' && subMode !== 'any' && t.subMode !== subMode) return false;
    return true;
  });

  // Prefer tasks never completed/seen before
  const unseen = all.filter(
    (t) => !state.seenIds.has(t.id) && t.id !== excludeCurrentId
  );
  if (unseen.length > 0) {
    return unseen[0];
  }

  // Fallback if all seed tasks in this category were completed: pick one not currently active
  const fallback = all.filter((t) => t.id !== excludeCurrentId);
  return fallback[0] || all[0];
}

// ==========================================================================
// NON-BLOCKING 15:00 REMINDER TIMER (COUNTS DOWN, THEN OVERTIME +MM:SS)
// ==========================================================================

function formatMMSS(totalSeconds) {
  const abs = Math.abs(Math.floor(totalSeconds));
  const mins = Math.floor(abs / 60);
  const secs = abs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerUI() {
  const dock = document.getElementById('timer-dock');
  const readout = document.getElementById('timer-readout');
  const tag = document.getElementById('timer-tag');
  const toggleIcon = document.getElementById('timer-toggle-icon');
  const overtimeBanner = document.getElementById('overtime-banner');
  const overtimeInline = document.getElementById('overtime-inline');

  toggleIcon.innerHTML = state.timerRunning ? '&#10074;&#10074;' : '&#9654;';
  dock.classList.toggle('is-running', state.timerRunning);

  const remaining = TARGET_SECONDS - state.elapsedSeconds;

  if (remaining >= 0) {
    readout.textContent = formatMMSS(remaining);
    overtimeBanner.hidden = true;
    dock.classList.remove('is-overtime');

    if (remaining <= 300 && state.timerRunning) {
      dock.classList.add('is-warning');
      tag.textContent = '5m Left';
    } else {
      dock.classList.remove('is-warning');
      tag.textContent = state.timerRunning ? '15m Pace' : 'Paused';
    }
  } else {
    // OVERTIME MODE: Never blocks or locks! Counts up +MM:SS as a gentle reminder
    const overSecs = Math.abs(remaining);
    const overFormatted = `+${formatMMSS(overSecs)}`;
    readout.textContent = overFormatted;
    tag.textContent = 'Overtime';
    dock.classList.remove('is-warning');
    dock.classList.add('is-overtime');
    overtimeBanner.hidden = false;
    overtimeInline.textContent = overFormatted;
  }
}

function startTimerIfNotRunning() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.elapsedSeconds += 1;
    updateTimerUI();
  }, 1000);
  updateTimerUI();
}

function pauseTimer() {
  state.timerRunning = false;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  updateTimerUI();
}

function toggleTimer() {
  if (state.timerRunning) pauseTimer();
  else startTimerIfNotRunning();
}

function resetTimer() {
  pauseTimer();
  state.elapsedSeconds = 0;
  updateTimerUI();
}

// ==========================================================================
// RENDER WORKSPACE (LEFT STIMULUS + RIGHT CANDIDATE RESPONSE)
// ==========================================================================

function loadTaskIntoWorkspace(task) {
  stopListeningAudio();
  stopSpeakingRecording();
  state.currentTask = task;
  state.recordedAudioObj = null;
  state.showTranscriptDuringTest = false;
  resetTimer();

  // Hide previous evaluation report
  const evalSec = document.getElementById('evaluation-section');
  evalSec.hidden = true;
  evalSec.innerHTML = '';

  // Update header tags
  document.getElementById('stimulus-badge').textContent = task.section.toUpperCase();
  document.getElementById('stimulus-topic').textContent = task.topic || 'Academic Practice';
  document.getElementById('stimulus-tasktype').textContent = task.taskType || '15-Min Workout';
  document.getElementById('response-status-tag').textContent = state.seenIds.has(task.id)
    ? 'Completed Earlier'
    : 'In Progress • Auto-Saved';

  renderLeftStimulus(task);
  renderRightResponse(task);
}

function renderLeftStimulus(task) {
  const container = document.getElementById('stimulus-body');

  if (task.section === 'reading') {
    const paragraphsHtml = (task.paragraphs || [])
      .map(
        (p) => `
        <div class="reading-paragraph">
          <span class="para-label">${p.label}</span>
          <p class="para-content">${p.text}</p>
        </div>`
      )
      .join('');

    container.innerHTML = `
      <h2 class="stimulus-title">${task.title}</h2>
      <div class="stimulus-instructions">${task.instructions}</div>
      <div class="reading-toolbar">
        <span>Academic Passage (${(task.paragraphs || []).length} Paragraphs)</span>
        <div style="display:flex;gap:0.4rem;">
          <button id="btn-highlight-text" class="btn-secondary" type="button" style="padding:0.25rem 0.6rem;font-size:0.75rem;">
            &#128396; Highlight Selection
          </button>
          <button id="btn-clear-highlights" class="btn-secondary" type="button" style="padding:0.25rem 0.6rem;font-size:0.75rem;">
            Clear Highlights
          </button>
        </div>
      </div>
      <div id="reading-passage-content" class="reading-passage">
        ${paragraphsHtml}
      </div>
    `;

    document.getElementById('btn-highlight-text')?.addEventListener('click', highlightSelectedPassageText);
    document.getElementById('btn-clear-highlights')?.addEventListener('click', () => {
      renderLeftStimulus(task);
    });
    return;
  }

  if (task.section === 'writing') {
    const chartSvgHtml = task.chartSpec
      ? `<figure class="chart-figure">
          ${renderTask1ChartSVG(task.chartSpec)}
          <figcaption class="chart-caption">Figure 1 — Academic Data Reference for Writing Task 1</figcaption>
        </figure>`
      : '';

    container.innerHTML = `
      <h2 class="stimulus-title">${task.title}</h2>
      <div class="stimulus-instructions">${task.instructions}</div>
      <div class="writing-prompt-box">${task.prompt.replace(/\n/g, '<br/>')}</div>
      ${chartSvgHtml}
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.9rem 1.1rem;font-size:0.83rem;color:var(--text-secondary);">
        <strong>Official IELTS Academic Criteria Assessed:</strong>
        <ul style="padding-left:1.2rem;margin-top:0.35rem;">
          <li><strong>${task.subMode === 'task1' ? 'Task Achievement' : 'Task Response'} (25%):</strong> ${
      task.subMode === 'task1'
        ? 'Clear overview of main trends + accurate key figure comparisons.'
        : 'Clear position throughout + well-supported analytical body arguments.'
    }</li>
          <li><strong>Coherence &amp; Cohesion (25%):</strong> Logical paragraphing and natural academic linking devices.</li>
          <li><strong>Lexical Resource (25%):</strong> Precise C1/C2 academic vocabulary and collocations.</li>
          <li><strong>Grammatical Range &amp; Accuracy (25%):</strong> Complex sentence structures with error-free clauses.</li>
        </ul>
      </div>
    `;
    return;
  }

  if (task.section === 'listening') {
    const transcriptHtml = (task.script || [])
      .map(
        (line, idx) => `
        <div class="transcript-line" data-line-idx="${idx}">
          <span class="transcript-speaker">${line.speaker}:</span>
          <span>${line.text}</span>
        </div>`
      )
      .join('');

    container.innerHTML = `
      <h2 class="stimulus-title">${task.title}</h2>
      <div class="stimulus-instructions">${task.instructions}</div>

      <div class="listening-player-card">
        <div class="audio-controls-row">
          <button id="btn-play-listening" class="play-btn-large" type="button" title="Play / Stop Academic Audio">
            <span id="listening-play-icon">&#9654;</span>
          </button>
          <div class="audio-progress-wrap">
            <div id="audio-speaker-label" class="audio-speaker-indicator">
              Ready to play (${(task.script || []).length} spoken turns)
            </div>
            <div class="audio-progress-bar">
              <div id="audio-progress-fill" class="audio-progress-fill"></div>
            </div>
          </div>
          <select id="listening-speed-select" class="submode-select" aria-label="Audio Speed">
            <option value="0.9">0.9x Calm</option>
            <option value="1" selected>1.0x Exam Pace</option>
            <option value="1.1">1.1x Brisk</option>
          </select>
        </div>

        <label for="listening-scratchpad" style="display:block;font-size:0.78rem;font-weight:600;color:var(--text-muted);margin-top:0.9rem;">
          Listening Scratchpad (Jot down numbers, dates, and keywords while listening):
        </label>
        <textarea id="listening-scratchpad" class="listening-scratchpad" placeholder="Type rough listening notes here..."></textarea>

        <div style="margin-top:0.75rem;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.76rem;color:var(--text-muted);">Transcript unlocks automatically after submission.</span>
          <button id="btn-toggle-transcript" class="btn-secondary" type="button" style="padding:0.25rem 0.65rem;font-size:0.75rem;">
            Show / Hide Transcript
          </button>
        </div>

        <div id="listening-transcript-box" class="transcript-box" hidden>
          ${transcriptHtml}
        </div>
      </div>
    `;

    document.getElementById('btn-play-listening')?.addEventListener('click', () => {
      startTimerIfNotRunning();
      toggleListeningAudio(task);
    });

    document.getElementById('listening-speed-select')?.addEventListener('change', (e) => {
      state.playbackRate = parseFloat(e.target.value) || 1.0;
    });

    document.getElementById('btn-toggle-transcript')?.addEventListener('click', () => {
      const box = document.getElementById('listening-transcript-box');
      if (box) box.hidden = !box.hidden;
    });
    return;
  }

  if (task.section === 'speaking') {
    const part1Html = (task.part1 || []).map((q) => `<li>${q}</li>`).join('');
    const bulletsHtml = (task.part2?.bullets || []).map((b) => `<li>${b}</li>`).join('');
    const part3Html = (task.part3 || []).map((q) => `<li>${q}</li>`).join('');

    container.innerHTML = `
      <h2 class="stimulus-title">${task.title}</h2>
      <div class="stimulus-instructions">${task.instructions}</div>

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 1 &mdash; Introduction &amp; Interview (3–4 mins)</span>
          <button class="btn-secondary btn-speak-prompt" data-part="part1" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
            &#128266; Hear Examiner
          </button>
        </div>
        <ol style="padding-left:1.25rem;font-size:0.93rem;">${part1Html}</ol>
      </div>

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 2 &mdash; Individual Long Turn Cue Card (3–4 mins)</span>
          <div style="display:flex;gap:0.4rem;">
            <button id="btn-prep-timer" class="btn-secondary" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
              &#9201; 1-Min Prep (<span id="prep-timer-readout">01:00</span>)
            </button>
            <button class="btn-secondary btn-speak-prompt" data-part="part2" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
              &#128266; Hear Cue Card
            </button>
          </div>
        </div>
        <div class="cue-card-box">
          <div class="cue-card-topic">${task.part2?.topic || ''}</div>
          <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.3rem;">You should say:</p>
          <ul class="cue-card-bullets">${bulletsHtml}</ul>
        </div>
      </div>

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 3 &mdash; Two-Way Abstract Discussion (4–5 mins)</span>
          <button class="btn-secondary btn-speak-prompt" data-part="part3" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
            &#128266; Hear Examiner
          </button>
        </div>
        <ol style="padding-left:1.25rem;font-size:0.93rem;">${part3Html}</ol>
      </div>
    `;

    container.querySelectorAll('.btn-speak-prompt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const part = btn.getAttribute('data-part');
        speakExaminerPrompts(task, part);
      });
    });

    document.getElementById('btn-prep-timer')?.addEventListener('click', togglePart2PrepTimer);
  }
}

function renderRightResponse(task) {
  const container = document.getElementById('response-body');
  const savedDraft = state.drafts[task.id];

  if (task.section === 'reading' || task.section === 'listening') {
    const draftMap = savedDraft && typeof savedDraft === 'object' ? savedDraft : {};
    let html = '';
    let lastGroup = '';

    (task.questions || []).forEach((q, idx) => {
      if (q.group && q.group !== lastGroup) {
        lastGroup = q.group;
        html += `<div class="task-group-header">${q.group}</div>`;
      }

      const currentVal = draftMap[q.id] || '';
      let controlHtml = '';

      if (q.type === 'tfng' || q.type === 'mcq') {
        const opts = q.options || ['TRUE', 'FALSE', 'NOT GIVEN'];
        controlHtml = `<div class="options-grid" data-qid="${q.id}">
          ${opts
            .map(
              (opt) => `
              <button type="button" class="option-pill ${currentVal === opt ? 'selected' : ''}" data-qid="${q.id}" data-val="${escapeHtmlAttr(opt)}">
                ${opt}
              </button>`
            )
            .join('')}
        </div>`;
      } else {
        controlHtml = `
          <input type="text" class="fill-input" data-qid="${q.id}" value="${escapeHtmlAttr(currentVal)}" placeholder="Type your answer..." autocomplete="off" />
        `;
      }

      html += `
        <div class="question-card" id="qcard-${q.id}">
          <div class="question-prompt">
            <span class="q-num">Q${idx + 1}</span>
            <span>${q.prompt}</span>
          </div>
          ${controlHtml}
          <div class="question-explanation" id="qexp-${q.id}" hidden></div>
        </div>
      `;
    });

    html += `
      <div class="submit-bar">
        <span style="font-size:0.8rem;color:var(--text-muted);">
          Timer is a reminder only &mdash; submit whenever you are ready.
        </span>
        <button id="btn-submit-task" class="btn-primary" type="button">
          &#10003; Submit &amp; Get IELTS Band Score
        </button>
      </div>
    `;

    container.innerHTML = html;

    // Attach option pill listeners
    container.querySelectorAll('.option-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        startTimerIfNotRunning();
        const qid = btn.getAttribute('data-qid');
        const val = btn.getAttribute('data-val');
        const group = container.querySelector(`.options-grid[data-qid="${qid}"]`);
        group?.querySelectorAll('.option-pill').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');

        const map = getObjectiveAnswersFromDOM(task);
        saveDraft(task.id, map);
      });
    });

    // Attach text input listeners
    container.querySelectorAll('.fill-input').forEach((inp) => {
      inp.addEventListener('input', () => {
        startTimerIfNotRunning();
        const map = getObjectiveAnswersFromDOM(task);
        saveDraft(task.id, map);
      });
    });

    document.getElementById('btn-submit-task')?.addEventListener('click', handleTaskSubmission);
    return;
  }

  if (task.section === 'writing') {
    const initialText = typeof savedDraft === 'string' ? savedDraft : '';
    const targetWords = task.targetWords || 150;

    container.innerHTML = `
      <div class="editor-meta-bar">
        <div class="word-counter-group">
          <span>Words: <strong id="live-word-count" class="word-count-number">0</strong> / ${targetWords}+ target</span>
          <div class="word-progress-track">
            <div id="live-word-bar" class="word-progress-bar"></div>
          </div>
        </div>
        <span id="live-sentence-count" style="font-size:0.78rem;color:var(--text-muted);">0 sentences</span>
      </div>

      <textarea id="writing-response-input" class="writing-textarea" placeholder="Begin writing your academic response here. The 15:00 timer will start automatically and will never cut you off if you need extra time...">${escapeHtml(initialText)}</textarea>

      <div class="submit-bar">
        <span style="font-size:0.8rem;color:var(--text-muted);">
          Graded on all 4 official IELTS Writing criteria (Band 0–9) + inline corrections.
        </span>
        <button id="btn-submit-task" class="btn-primary" type="button">
          &#10024; Submit Writing for IELTS Review
        </button>
      </div>
    `;

    const textarea = document.getElementById('writing-response-input');
    const updateStats = () => {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const sentences = text ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length : 0;
      document.getElementById('live-word-count').textContent = String(words);
      document.getElementById('live-sentence-count').textContent = `${sentences} sentence${sentences === 1 ? '' : 's'}`;
      const pct = Math.min(100, Math.round((words / targetWords) * 100));
      document.getElementById('live-word-bar').style.width = `${pct}%`;
    };

    textarea.addEventListener('input', () => {
      startTimerIfNotRunning();
      updateStats();
      saveDraft(task.id, textarea.value);
    });
    updateStats();

    document.getElementById('btn-submit-task')?.addEventListener('click', handleTaskSubmission);
    return;
  }

  if (task.section === 'speaking') {
    const initialTranscript = typeof savedDraft === 'string' ? savedDraft : '';

    container.innerHTML = `
      <div class="recorder-studio">
        <div class="recorder-controls">
          <button id="btn-record-voice" class="btn-record" type="button">
            <span id="record-btn-dot">&#9679;</span>
            <span id="record-btn-label">Start Microphone Recording</span>
          </button>

          <div id="waveform-bars" class="waveform-bars" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>

          <span id="recording-status-text" style="font-size:0.8rem;color:var(--text-muted);">
            Records audio + live speech-to-text transcript
          </span>
        </div>

        <audio id="recorded-audio-player" controls style="width:100%;height:36px;margin-top:0.35rem;" hidden></audio>
      </div>

      <div class="editor-meta-bar">
        <div class="word-counter-group">
          <span>Spoken / Edited Words: <strong id="speaking-word-count" class="word-count-number">0</strong></span>
        </div>
        <span style="font-size:0.76rem;color:var(--text-muted);">You may record via mic, type, or edit your transcript below</span>
      </div>

      <textarea id="speaking-transcript-input" class="writing-textarea" style="min-height:250px;" placeholder="Click 'Start Microphone Recording' and speak your answers to Part 1, Part 2, and Part 3 (your speech will appear here automatically, and your voice recording will be attached for Gemini Pronunciation grading)—or type/edit your response directly...">${escapeHtml(initialTranscript)}</textarea>

      <div class="submit-bar">
        <span style="font-size:0.8rem;color:var(--text-muted);">
          Evaluates Fluency, Lexical Resource, Grammar &amp; Pronunciation.
        </span>
        <button id="btn-submit-task" class="btn-primary" type="button">
          &#10024; Submit Speaking for IELTS Review
        </button>
      </div>
    `;

    const transcriptBox = document.getElementById('speaking-transcript-input');
    const updateSpokenWords = () => {
      const txt = transcriptBox.value.trim();
      const count = txt ? txt.split(/\s+/).length : 0;
      const el = document.getElementById('speaking-word-count');
      if (el) el.textContent = String(count);
    };

    transcriptBox.addEventListener('input', () => {
      startTimerIfNotRunning();
      updateSpokenWords();
      saveDraft(task.id, transcriptBox.value);
    });
    updateSpokenWords();

    document.getElementById('btn-record-voice')?.addEventListener('click', () => {
      startTimerIfNotRunning();
      toggleSpeakingRecording();
    });

    document.getElementById('btn-submit-task')?.addEventListener('click', handleTaskSubmission);
  }
}

function getObjectiveAnswersFromDOM(task) {
  const container = document.getElementById('response-body');
  const map = {};
  (task.questions || []).forEach((q) => {
    if (q.type === 'tfng' || q.type === 'mcq') {
      const sel = container.querySelector(`.options-grid[data-qid="${q.id}"] .option-pill.selected`);
      if (sel) map[q.id] = sel.getAttribute('data-val');
    } else {
      const inp = container.querySelector(`.fill-input[data-qid="${q.id}"]`);
      if (inp) map[q.id] = inp.value.trim();
    }
  });
  return map;
}

// ==========================================================================
// READING HIGHLIGHTER
// ==========================================================================

function highlightSelectedPassageText() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const passageBox = document.getElementById('reading-passage-content');
  if (!passageBox || !passageBox.contains(range.commonAncestorContainer)) return;

  try {
    const mark = document.createElement('mark');
    mark.className = 'user-highlight';
    mark.title = 'Click to remove highlight';
    mark.addEventListener('click', () => {
      const parent = mark.parentNode;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
    });
    range.surroundContents(mark);
    sel.removeAllRanges();
  } catch (e) {
    // Fallback if selection crosses paragraph boundaries
  }
}

// ==========================================================================
// LISTENING MULTI-VOICE WEB SPEECH SYNTHESIS
// ==========================================================================

function stopListeningAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isPlayingAudio = false;
  const icon = document.getElementById('listening-play-icon');
  if (icon) icon.innerHTML = '&#9654;';
}

function toggleListeningAudio(task) {
  if (!('speechSynthesis' in window)) {
    const box = document.getElementById('listening-transcript-box');
    if (box) box.hidden = false;
    alert('Browser Speech Synthesis is unavailable on this device. The written transcript has been opened below so you can complete the questions.');
    return;
  }

  if (state.isPlayingAudio) {
    stopListeningAudio();
    return;
  }

  const lines = task.script || [];
  if (!lines.length) return;

  state.isPlayingAudio = true;
  const icon = document.getElementById('listening-play-icon');
  if (icon) icon.innerHTML = '&#9632;';

  let idx = 0;
  const speakNextLine = () => {
    if (!state.isPlayingAudio || idx >= lines.length) {
      stopListeningAudio();
      const fill = document.getElementById('audio-progress-fill');
      if (fill && idx >= lines.length) fill.style.width = '100%';
      const lbl = document.getElementById('audio-speaker-label');
      if (lbl && idx >= lines.length) lbl.textContent = 'Audio complete — click Play to listen again';
      return;
    }

    const line = lines[idx];
    const lbl = document.getElementById('audio-speaker-label');
    const fill = document.getElementById('audio-progress-fill');
    if (lbl) lbl.textContent = `Speaking now: ${line.speaker} (Turn ${idx + 1} of ${lines.length})`;
    if (fill) fill.style.width = `${Math.round(((idx + 0.5) / lines.length) * 100)}%`;

    const utter = new SpeechSynthesisUtterance(line.text);
    utter.lang = 'en-GB';
    utter.pitch = line.pitch || 1.0;
    utter.rate = (line.rate || 1.0) * state.playbackRate;

    utter.onend = () => {
      idx += 1;
      speakNextLine();
    };
    utter.onerror = () => {
      stopListeningAudio();
    };

    window.speechSynthesis.speak(utter);
  };

  window.speechSynthesis.cancel();
  speakNextLine();
}

function speakExaminerPrompts(task, part) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  let textToRead = '';
  if (part === 'part1') {
    textToRead = 'Part 1. ' + (task.part1 || []).join(' Next question: ');
  } else if (part === 'part2') {
    textToRead = `Part 2 Cue Card. ${task.part2?.topic || ''}. You should say: ${(task.part2?.bullets || []).join(', ')}`;
  } else {
    textToRead = 'Part 3 Discussion. ' + (task.part3 || []).join(' Next question: ');
  }
  const utter = new SpeechSynthesisUtterance(textToRead);
  utter.lang = 'en-GB';
  utter.rate = 0.96;
  window.speechSynthesis.speak(utter);
}

function togglePart2PrepTimer() {
  const readout = document.getElementById('prep-timer-readout');
  if (state.prepInterval) {
    clearInterval(state.prepInterval);
    state.prepInterval = null;
    state.prepSeconds = 60;
    if (readout) readout.textContent = '01:00';
    return;
  }
  state.prepSeconds = 60;
  state.prepInterval = setInterval(() => {
    state.prepSeconds -= 1;
    if (readout) readout.textContent = formatMMSS(Math.max(0, state.prepSeconds));
    if (state.prepSeconds <= 0) {
      clearInterval(state.prepInterval);
      state.prepInterval = null;
    }
  }, 1000);
}

// ==========================================================================
// SPEAKING MICROPHONE RECORDER + LIVE SPEECH RECOGNITION
// ==========================================================================

function stopSpeakingRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
    try {
      state.mediaRecorder.stop();
    } catch (e) {
      // ignore
    }
  }
  if (state.speechRecognition) {
    try {
      state.speechRecognition.stop();
    } catch (e) {
      // ignore
    }
  }
  state.isRecording = false;
  const btn = document.getElementById('btn-record-voice');
  const label = document.getElementById('record-btn-label');
  const bars = document.getElementById('waveform-bars');
  if (btn) btn.classList.remove('recording');
  if (label) label.textContent = 'Start Microphone Recording';
  if (bars) bars.classList.remove('active');
}

async function toggleSpeakingRecording() {
  if (state.isRecording) {
    stopSpeakingRecording();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.recordedChunks = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    const recorder = new MediaRecorder(stream);
    state.mediaRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) state.recordedChunks.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(state.recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const player = document.getElementById('recorded-audio-player');
      if (player) {
        player.src = url;
        player.hidden = false;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = String(reader.result || '').split(',')[1] || '';
        state.recordedAudioObj = { base64: base64data, mimeType, url };
        const st = document.getElementById('recording-status-text');
        if (st) st.textContent = 'Voice recording ready for AI pronunciation evaluation!';
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();
    state.isRecording = true;

    // Also start live Web Speech Recognition if supported
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        const transcriptBox = document.getElementById('speaking-transcript-input');
        if (!transcriptBox) return;
        let added = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            added += event.results[i][0].transcript + ' ';
          }
        }
        if (added.trim()) {
          transcriptBox.value = (transcriptBox.value.trim() + ' ' + added.trim()).trim();
          transcriptBox.dispatchEvent(new Event('input'));
        }
      };
      try {
        rec.start();
        state.speechRecognition = rec;
      } catch (e) {
        // ignore if already started
      }
    }

    const btn = document.getElementById('btn-record-voice');
    const label = document.getElementById('record-btn-label');
    const bars = document.getElementById('waveform-bars');
    const statusText = document.getElementById('recording-status-text');
    if (btn) btn.classList.add('recording');
    if (label) label.textContent = 'Stop Recording';
    if (bars) bars.classList.add('active');
    if (statusText) statusText.textContent = 'Recording your voice... speak clearly into your microphone';
  } catch (err) {
    alert(
      'Microphone access was blocked or unavailable. You can still type or paste your Speaking response directly into the transcript box for full IELTS Band evaluation!'
    );
  }
}

// ==========================================================================
// SUBMISSION, GRADING & EXAMINER REPORT
// ==========================================================================

async function handleTaskSubmission() {
  const task = state.currentTask;
  if (!task) return;

  pauseTimer();
  stopListeningAudio();
  stopSpeakingRecording();

  const submitBtn = document.getElementById('btn-submit-task');
  let userSubmission = null;

  if (task.section === 'reading' || task.section === 'listening') {
    userSubmission = getObjectiveAnswersFromDOM(task);
  } else if (task.section === 'writing') {
    const val = document.getElementById('writing-response-input')?.value.trim() || '';
    if (val.length < 15) {
      alert('Please write at least a couple of sentences before submitting for IELTS Band review.');
      return;
    }
    userSubmission = val;
  } else if (task.section === 'speaking') {
    const val = document.getElementById('speaking-transcript-input')?.value.trim() || '';
    if (val.length < 10 && !state.recordedAudioObj) {
      alert('Please record your voice or type your spoken answer before submitting.');
      return;
    }
    userSubmission = val;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Examiner Evaluating...';
  }

  let evalResult = null;
  try {
    if (
      (task.section === 'writing' || task.section === 'speaking') &&
      state.apiKey
    ) {
      evalResult = await evaluateSubmissionWithGemini(
        state.apiKey,
        task,
        userSubmission,
        state.recordedAudioObj
      );
    } else {
      evalResult = evaluateSubmissionLocally(task, userSubmission);
    }
  } catch (err) {
    console.warn('Gemini evaluation error, falling back to local heuristic grader:', err);
    evalResult = evaluateSubmissionLocally(task, userSubmission);
    evalResult.examinerSummary = `(Note: Gemini API call failed: ${err.message}. Showing local heuristic score.)\n\n` + evalResult.examinerSummary;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '✓ Re-Submit / Update Evaluation';
    }
  }

  // Highlight objective Reading/Listening cards in the DOM
  if (task.section === 'reading' || task.section === 'listening') {
    (evalResult.questionResults || []).forEach((qr) => {
      const card = document.getElementById(`qcard-${qr.id}`);
      const exp = document.getElementById(`qexp-${qr.id}`);
      if (card) {
        card.classList.remove('is-correct', 'is-incorrect');
        card.classList.add(qr.isCorrect ? 'is-correct' : 'is-incorrect');
      }
      if (exp) {
        exp.hidden = false;
        exp.innerHTML = qr.isCorrect
          ? `<strong>&#10003; Correct (${escapeHtml(qr.correctAnswer)}):</strong> ${escapeHtml(qr.explanation)}`
          : `<strong>&#10007; Answer Key: ${escapeHtml(qr.correctAnswer)}</strong> (You wrote: <em>${escapeHtml(qr.userAnswer)}</em>) &mdash; ${escapeHtml(qr.explanation)}`;
      }
    });

    // Unlock listening transcript automatically
    const transBox = document.getElementById('listening-transcript-box');
    if (transBox) transBox.hidden = false;
  }

  // Record in Non-Repeating History
  state.seenIds.add(task.id);
  const elapsedFormatted = formatMMSS(state.elapsedSeconds);
  const wasOvertime = state.elapsedSeconds > TARGET_SECONDS;

  const historyEntry = {
    entryId: `hist-${Date.now()}`,
    taskId: task.id,
    dateISO: new Date().toISOString(),
    section: task.section,
    title: task.title,
    topic: task.topic,
    elapsedSeconds: state.elapsedSeconds,
    elapsedFormatted: wasOvertime
      ? `${elapsedFormatted} (+${formatMMSS(state.elapsedSeconds - TARGET_SECONDS)} over 15m)`
      : `${elapsedFormatted} (within 15m)`,
    overallBand: evalResult.overallBand,
    userSubmission,
    evaluation: evalResult
  };

  // Replace if already submitted same taskId in this session, else unshift
  state.history = [
    historyEntry,
    ...state.history.filter((h) => h.taskId !== task.id)
  ];
  saveHistoryAndSeen();

  renderEvaluationReport(task, evalResult, historyEntry);
}

function renderEvaluationReport(task, evalResult, historyEntry) {
  const sec = document.getElementById('evaluation-section');
  sec.hidden = false;

  const bandNum = Number(evalResult.overallBand || 0).toFixed(1);
  const criteriaHtml = (evalResult.criteria || [])
    .map(
      (c) => `
      <div class="criterion-card">
        <div class="criterion-name">${escapeHtml(c.name)}</div>
        <div class="criterion-score">Band ${Number(c.score || 0).toFixed(1)}</div>
        <div class="criterion-note">${escapeHtml(c.feedback || '')}</div>
      </div>`
    )
    .join('');

  const correctionsHtml =
    (evalResult.corrections || []).length > 0
      ? evalResult.corrections
          .map(
            (item) => `
          <div class="correction-item">
            <span class="diff-orig">${escapeHtml(item.original)}</span>
            <span class="diff-fixed">&rarr; ${escapeHtml(item.corrected)}</span>
            <div class="diff-reason">${escapeHtml(item.explanation)}</div>
          </div>`
          )
          .join('')
      : `<p style="font-size:0.88rem;color:var(--text-secondary);">No errors flagged — excellent accuracy across all items!</p>`;

  const upgradesHtml =
    (evalResult.lexicalUpgrades || []).length > 0
      ? `<div style="margin-top:1.25rem;">
          <h4 class="eval-block-title">&#127891; Band 8.5+ C1/C2 Vocabulary Upgrades</h4>
          ${evalResult.lexicalUpgrades
            .map(
              (u) => `
              <div class="correction-item">
                <div style="font-weight:700;color:var(--accent-primary);">${escapeHtml(u.basic)} &rarr; ${escapeHtml(u.upgrade)}</div>
                <div class="diff-reason" style="margin-top:0.2rem;"><em>"${escapeHtml(u.context)}"</em></div>
              </div>`
            )
            .join('')}
        </div>`
      : '';

  const apiPromptBanner = evalResult.isHeuristicFallback
    ? `<div style="background:var(--amber-soft);border:1px solid var(--amber-border);color:var(--amber-warn);padding:0.75rem 1.25rem;font-size:0.84rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
        <span><strong>Want deep sentence-by-sentence AI corrections?</strong> Click Re-Evaluate with Gemini AI (or check your API key in Settings).</span>
        <div style="display:flex;gap:0.5rem;">
          <button id="btn-eval-regrade-ai" class="btn-primary" type="button" style="padding:0.32rem 0.8rem;font-size:0.78rem;">&#10024; Re-Evaluate with Gemini AI</button>
          <button id="btn-eval-open-api" class="btn-secondary" type="button" style="padding:0.3rem 0.7rem;font-size:0.78rem;">API Key Settings</button>
        </div>
      </div>`
    : '';

  sec.innerHTML = `
    <div class="eval-banner">
      <div class="band-hero">
        <div class="band-stamp">
          <span class="band-stamp-label">IELTS BAND</span>
          <span class="band-stamp-score">${bandNum}</span>
        </div>
        <div>
          <h3 style="font-family:var(--font-serif);font-size:1.35rem;font-weight:700;">
            Official IELTS Academic Assessment &bull; ${escapeHtml(task.title)}
          </h3>
          <p style="font-size:0.85rem;opacity:0.9;margin-top:0.2rem;">
            Completion Time: <strong>${escapeHtml(historyEntry.elapsedFormatted)}</strong>
            ${evalResult.rawScoreText ? ` &bull; Raw Score: <strong>${escapeHtml(evalResult.rawScoreText)}</strong>` : ''}
            &bull; Saved to Non-Repeating History
          </p>
        </div>
      </div>

      <button id="btn-eval-next-task" class="btn-secondary" type="button" style="background:#FFFFFF;color:var(--accent-primary);border:none;">
        Load Next Unseen Workout &rarr;
      </button>
    </div>

    ${apiPromptBanner}

    <div class="criteria-grid">
      ${criteriaHtml}
    </div>

    <div style="padding:1.25rem 1.75rem 0;">
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem 1.2rem;">
        <strong style="font-size:0.82rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--accent-primary);">Examiner Diagnostic Summary</strong>
        <p style="margin-top:0.35rem;font-size:0.94rem;color:var(--text-primary);">${escapeHtml(evalResult.examinerSummary || '')}</p>
      </div>
    </div>

    <div class="eval-body">
      <div>
        <h4 class="eval-block-title">&#128269; Sentence Corrections &amp; Answer Key Breakdown</h4>
        ${correctionsHtml}
        ${upgradesHtml}
      </div>

      <div>
        <h4 class="eval-block-title">&#128216; Band 8.5+ Model Reference / Full Script</h4>
        <div class="model-answer-box">${escapeHtml(evalResult.modelAnswer || '')}</div>
      </div>
    </div>
  `;

  document.getElementById('btn-eval-regrade-ai')?.addEventListener('click', () => {
    if (!state.apiKey) {
      document.getElementById('modal-settings').hidden = false;
      return;
    }
    handleTaskSubmission();
  });

  document.getElementById('btn-eval-open-api')?.addEventListener('click', () => {
    document.getElementById('modal-settings').hidden = false;
  });

  document.getElementById('btn-eval-next-task')?.addEventListener('click', () => {
    const next = pickNextUnseenTask(state.currentSection, state.writingSubMode, task.id);
    if (next) loadTaskIntoWorkspace(next);
  });

  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================================================
// AI NON-REPEATING TASK GENERATION HANDLER
// ==========================================================================

async function handleGenerateAITask() {
  if (!state.apiKey) {
    document.getElementById('modal-settings').hidden = false;
    return;
  }

  const btn = document.getElementById('btn-generate-ai');
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span>&#9203; Generating Unseen Task...</span>';

  try {
    const excluded = [
      ...getAllTasks().map((t) => `${t.id} (${t.topic})`),
      ...state.history.map((h) => `${h.taskId} (${h.topic})`)
    ];
    const newTask = await generateFreshTaskWithGemini(
      state.apiKey,
      state.currentSection,
      state.writingSubMode,
      excluded
    );

    if (!newTask || !newTask.title) {
      throw new Error('Generated task was incomplete.');
    }
    if (!newTask.id) {
      newTask.id = `ai-${state.currentSection}-${Date.now()}`;
    }

    state.customTasks.unshift(newTask);
    saveHistoryAndSeen();
    loadTaskIntoWorkspace(newTask);
  } catch (err) {
    alert(`Could not generate AI task: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHtml;
  }
}

// ==========================================================================
// HISTORY MODAL & JSON EXPORT/IMPORT
// ==========================================================================

function updateHeaderBadges() {
  const countBadge = document.getElementById('history-count-badge');
  if (countBadge) countBadge.textContent = String(state.history.length);

  const dot = document.getElementById('api-status-dot');
  const lbl = document.getElementById('api-status-label');
  if (dot && lbl) {
    const connected = Boolean(state.apiKey);
    dot.classList.toggle('connected', connected);
    lbl.textContent = connected ? 'Gemini Connected' : 'Setup Gemini API';
  }

  // Highlight today's recommended skill badge
  const recSkill = computeRecommendedSkillForToday();
  ['reading', 'writing', 'listening', 'speaking'].forEach((s) => {
    const pill = document.getElementById(`rec-${s}`);
    if (pill) pill.hidden = s !== recSkill;
  });
}

function renderHistoryModal() {
  const statsContainer = document.getElementById('history-stats-row');
  const listContainer = document.getElementById('history-list');

  const totalCompleted = state.history.length;
  const avgBand =
    totalCompleted > 0
      ? (
          state.history.reduce((acc, h) => acc + (Number(h.overallBand) || 0), 0) /
          totalCompleted
        ).toFixed(1)
      : '—';

  const unseenRemaining = getAllTasks().filter((t) => !state.seenIds.has(t.id)).length;

  statsContainer.innerHTML = `
    <div class="stat-box">
      <div class="stat-label">Completed Sessions</div>
      <div class="stat-value">${totalCompleted}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Average IELTS Band</div>
      <div class="stat-value">${avgBand}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Excluded from Repeat</div>
      <div class="stat-value">${state.seenIds.size}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Ready in Seed Bank</div>
      <div class="stat-value">${unseenRemaining}</div>
    </div>
  `;

  if (state.history.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.9rem;">
        No completed 15-minute workouts yet. Complete your first exercise to track your IELTS Band progress and build your non-repeating history!
      </div>
    `;
    return;
  }

  listContainer.innerHTML = state.history
    .map(
      (h, idx) => `
      <div class="history-row" data-hist-idx="${idx}">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.2rem;">
            <span class="section-badge">${escapeHtml(h.section.toUpperCase())}</span>
            <strong style="font-size:0.95rem;">${escapeHtml(h.title)}</strong>
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);">
            Topic: ${escapeHtml(h.topic || '')} &bull; Time: ${escapeHtml(h.elapsedFormatted || '')} &bull; ${new Date(h.dateISO).toLocaleDateString()}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:var(--accent-primary);">
            Band ${Number(h.overallBand || 0).toFixed(1)}
          </div>
          <span style="font-size:0.74rem;color:var(--text-muted);">Click to inspect &rarr;</span>
        </div>
      </div>`
    )
    .join('');

  listContainer.querySelectorAll('.history-row').forEach((row) => {
    row.addEventListener('click', () => {
      const idx = Number(row.getAttribute('data-hist-idx'));
      const entry = state.history[idx];
      if (!entry) return;
      const matchingTask = getAllTasks().find((t) => t.id === entry.taskId);
      if (matchingTask) {
        switchSectionTab(matchingTask.section, false);
        saveDraft(matchingTask.id, entry.userSubmission);
        loadTaskIntoWorkspace(matchingTask);
        renderEvaluationReport(matchingTask, entry.evaluation, entry);
      }
      document.getElementById('modal-history').hidden = true;
    });
  });
}

// ==========================================================================
// NAVIGATION, THEME & EVENT BINDINGS
// ==========================================================================

function switchSectionTab(section, loadUnseen = true) {
  state.currentSection = section;
  document.querySelectorAll('.skill-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.getAttribute('data-section') === section);
  });

  const subSelect = document.getElementById('writing-submode-select');
  if (subSelect) {
    subSelect.hidden = section !== 'writing';
  }

  if (loadUnseen) {
    const task = pickNextUnseenTask(section, state.writingSubMode);
    if (task) loadTaskIntoWorkspace(task);
  }
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    // ignore
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function initApp() {
  loadPersistedState();
  applyTheme(state.theme);
  updateHeaderBadges();

  // Start on today's recommended skill in the daily rotation
  const recommended = computeRecommendedSkillForToday();
  switchSectionTab(recommended, true);

  // Skill tab clicks
  document.querySelectorAll('.skill-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const sec = tab.getAttribute('data-section');
      if (sec) switchSectionTab(sec, true);
    });
  });

  // Writing submode filter
  document.getElementById('writing-submode-select')?.addEventListener('change', (e) => {
    state.writingSubMode = e.target.value;
    const next = pickNextUnseenTask('writing', state.writingSubMode);
    if (next) loadTaskIntoWorkspace(next);
  });

  // Next Unseen Task button
  document.getElementById('btn-next-unseen')?.addEventListener('click', () => {
    const next = pickNextUnseenTask(
      state.currentSection,
      state.writingSubMode,
      state.currentTask?.id
    );
    if (next) loadTaskIntoWorkspace(next);
  });

  // Generate AI Task button
  document.getElementById('btn-generate-ai')?.addEventListener('click', handleGenerateAITask);

  // Clear Current Answer
  document.getElementById('btn-clear-draft')?.addEventListener('click', () => {
    if (!state.currentTask) return;
    delete state.drafts[state.currentTask.id];
    saveDraft(state.currentTask.id, '');
    loadTaskIntoWorkspace(state.currentTask);
  });

  // Timer controls
  document.getElementById('btn-timer-toggle')?.addEventListener('click', toggleTimer);
  document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);

  // Theme toggle
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // History Modal
  document.getElementById('btn-open-history')?.addEventListener('click', () => {
    renderHistoryModal();
    document.getElementById('modal-history').hidden = false;
  });
  document.getElementById('btn-close-history')?.addEventListener('click', () => {
    document.getElementById('modal-history').hidden = true;
  });

  // Export History JSON
  document.getElementById('btn-export-history')?.addEventListener('click', () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      history: state.history,
      seenIds: [...state.seenIds],
      customTasks: state.customTasks
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-academic-15-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import History JSON
  document.getElementById('input-import-history')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (Array.isArray(parsed.history)) state.history = parsed.history;
        if (Array.isArray(parsed.seenIds)) state.seenIds = new Set(parsed.seenIds);
        if (Array.isArray(parsed.customTasks)) state.customTasks = parsed.customTasks;
        saveHistoryAndSeen();
        renderHistoryModal();
      } catch (err) {
        alert('Invalid history JSON file.');
      }
    };
    reader.readAsText(file);
  });

  // Settings / API Key Modal
  const settingsModal = document.getElementById('modal-settings');
  const keyInput = document.getElementById('input-gemini-key');
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    if (keyInput) keyInput.value = state.apiKey;
    settingsModal.hidden = false;
  });
  document.getElementById('btn-close-settings')?.addEventListener('click', () => {
    settingsModal.hidden = true;
  });
  document.getElementById('btn-save-api-key')?.addEventListener('click', () => {
    state.apiKey = (keyInput?.value || '').trim();
    localStorage.setItem(STORAGE_KEYS.API_KEY, state.apiKey);
    updateHeaderBadges();
    settingsModal.hidden = true;
  });
  document.getElementById('btn-clear-api-key')?.addEventListener('click', () => {
    state.apiKey = '';
    if (keyInput) keyInput.value = '';
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    updateHeaderBadges();
  });
}

document.addEventListener('DOMContentLoaded', initApp);
