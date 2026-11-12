// ==========================================================================
// DAILY IELTS ACADEMIC 15 — MAIN APPLICATION CONTROLLER
// ==========================================================================

import { SEED_TASKS, renderTask1ChartSVG, renderListeningMapSVG } from './tasks-bank.js';
import {
  generateFreshTaskWithGemini,
  evaluateSubmissionWithGemini,
  evaluateSubmissionLocally,
  verifyGeminiApiKey,
  synthesizeListeningAudioWithGemini,
  getCachedListeningAudioUrl
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

  // Listening TTS & Studio Audio state
  isPlayingAudio: false,
  ttsKeepAliveInterval: null,
  ttsPauseTimeout: null,
  playbackRate: 1.0,
  accentMode: 'auto', // 'auto' | 'en-GB' | 'en-AU' | 'en-US'
  strictListeningMode: false,
  listeningPlayCount: 0,
  currentLineIdx: 0,

  // Speaking Real Exam Blind Mode state
  speakingBlindMode: false,
  blindStepIdx: 0,

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
    if (rawHist) {
      const parsed = JSON.parse(rawHist);
      if (Array.isArray(parsed)) state.history = parsed;
    }

    const rawSeen = localStorage.getItem(STORAGE_KEYS.SEEN_IDS);
    if (rawSeen) {
      const parsed = JSON.parse(rawSeen);
      if (Array.isArray(parsed)) state.seenIds = new Set(parsed);
    }

    const rawCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_TASKS);
    if (rawCustom) {
      const parsed = JSON.parse(rawCustom);
      if (Array.isArray(parsed)) state.customTasks = parsed;
    }

    const rawDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (rawDrafts) {
      const parsed = JSON.parse(rawDrafts);
      if (parsed && typeof parsed === 'object') state.drafts = parsed;
    }

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

function getMatchingSectionTasks(section, subMode = 'any') {
  return getAllTasks().filter((t) => {
    if (t.section !== section) return false;
    if (section === 'writing' && subMode !== 'any' && t.subMode !== subMode) return false;
    return true;
  });
}

function pickNextUnseenTask(section, subMode = 'any', excludeCurrentId = null) {
  const all = getMatchingSectionTasks(section, subMode);

  // Prefer tasks never completed/seen before
  const unseen = all.filter(
    (t) => !state.seenIds.has(t.id) && t.id !== excludeCurrentId
  );
  if (unseen.length > 0) {
    return unseen[0];
  }

  // Fallback if all seed tasks in this category were completed: cycle to next task
  if (all.length === 0) return null;
  if (excludeCurrentId) {
    const currIdx = all.findIndex((t) => t.id === excludeCurrentId);
    if (currIdx !== -1 && all.length > 1) {
      return all[(currIdx + 1) % all.length];
    }
  }
  return all[0];
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

  if (!dock || !readout || !tag || !toggleIcon) return;

  toggleIcon.innerHTML = state.timerRunning ? '&#10074;&#10074;' : '&#9654;';
  dock.classList.toggle('is-running', state.timerRunning);

  const remaining = TARGET_SECONDS - state.elapsedSeconds;

  if (remaining >= 0) {
    readout.textContent = formatMMSS(remaining);
    if (overtimeBanner) overtimeBanner.hidden = true;
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
    if (overtimeBanner) overtimeBanner.hidden = false;
    if (overtimeInline) overtimeInline.textContent = overFormatted;
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

function clearPart2PrepTimer() {
  if (state.prepInterval) {
    clearInterval(state.prepInterval);
    state.prepInterval = null;
  }
  state.prepSeconds = 60;
  const readout = document.getElementById('prep-timer-readout');
  if (readout) readout.textContent = '01:00';
}

// ==========================================================================
// RENDER WORKSPACE (LEFT STIMULUS + RIGHT CANDIDATE RESPONSE)
// ==========================================================================

function cleanupRecordedAudioUrl() {
  if (state.recordedAudioObj && state.recordedAudioObj.url) {
    try {
      URL.revokeObjectURL(state.recordedAudioObj.url);
    } catch (e) {
      // ignore
    }
  }
  state.recordedAudioObj = null;
}

function renderReferenceBoxHtml(task) {
  if (!task.referenceBox || !Array.isArray(task.referenceBox.items)) return '';
  const itemsHtml = task.referenceBox.items
    .map(
      (item) =>
        `<div style="font-size:0.84rem;color:var(--text-primary);padding:0.22rem 0;border-bottom:1px dashed var(--border-subtle);">${escapeHtml(item)}</div>`
    )
    .join('');
  return `
    <div style="background:var(--bg-elevated);border:1.5px solid var(--accent-primary);border-radius:var(--radius-sm);padding:0.75rem 1rem;margin-bottom:1rem;">
      <div style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;text-transform:uppercase;color:var(--accent-primary);margin-bottom:0.35rem;">
        &#128203; ${escapeHtml(task.referenceBox.title || 'Reference Box')}
      </div>
      <div>${itemsHtml}</div>
    </div>
  `;
}

function loadTaskIntoWorkspace(task) {
  stopListeningAudio();
  stopSpeakingRecording();
  clearPart2PrepTimer();
  cleanupRecordedAudioUrl();

  state.currentTask = task;
  state.listeningPlayCount = 0;
  state.currentLineIdx = 0;
  state.blindStepIdx = 0;
  resetTimer();

  // Hide previous evaluation report
  const evalSec = document.getElementById('evaluation-section');
  if (evalSec) {
    evalSec.hidden = true;
    evalSec.innerHTML = '';
  }

  // Update header tags
  document.getElementById('stimulus-badge').textContent = task.section.toUpperCase();
  document.getElementById('stimulus-topic').textContent = task.topic || 'Academic Practice';
  document.getElementById('stimulus-tasktype').textContent = task.taskType || '15-Min Workout';
  document.getElementById('response-status-tag').textContent = state.seenIds.has(task.id)
    ? 'Completed Earlier'
    : 'In Progress • Auto-Saved';

  updateHeaderBadges();
  renderLeftStimulus(task);
  renderRightResponse(task);
}

function renderLeftStimulus(task) {
  const container = document.getElementById('stimulus-body');
  if (!container) return;

  if (task.section === 'reading') {
    const paragraphsHtml = (task.paragraphs || [])
      .map(
        (p) => `
        <div class="reading-paragraph">
          <span class="para-label">${escapeHtml(p.label)}</span>
          <p class="para-content">${escapeHtml(p.text)}</p>
        </div>`
      )
      .join('');

    container.innerHTML = `
      <h2 class="stimulus-title">${escapeHtml(task.title)}</h2>
      <div class="stimulus-instructions">${escapeHtml(task.instructions)}</div>
      ${renderReferenceBoxHtml(task)}
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
          <figcaption class="chart-caption">Figure 1 — Official IELTS Academic Task 1 Visual Reference</figcaption>
        </figure>`
      : '';

    const safePrompt = escapeHtml(task.prompt || '').replace(/\n/g, '<br/>');

    container.innerHTML = `
      <h2 class="stimulus-title">${escapeHtml(task.title)}</h2>
      <div class="stimulus-instructions">${escapeHtml(task.instructions)}</div>
      <div class="writing-prompt-box">${safePrompt}</div>
      ${chartSvgHtml}
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.9rem 1.1rem;font-size:0.83rem;color:var(--text-secondary);">
        <strong>Official IELTS Academic Criteria Assessed:</strong>
        <ul style="padding-left:1.2rem;margin-top:0.35rem;">
          <li><strong>${task.subMode === 'task1' ? 'Task Achievement' : 'Task Response'} (25%):</strong> ${
      task.subMode === 'task1'
        ? 'Clear overview of main trends/spatial changes + accurate key comparisons.'
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
    const savedDraft = state.drafts[task.id];
    const scratchpadText =
      savedDraft && typeof savedDraft === 'object' ? savedDraft.__scratchpad || '' : '';

    const transcriptHtml = (task.script || [])
      .map(
        (line, idx) => `
        <div class="transcript-line" data-line-idx="${idx}" title="Click to jump playback to Turn ${idx + 1}" style="cursor:pointer;">
          <span class="transcript-speaker">${escapeHtml(line.speaker)}:</span>
          <span>${escapeHtml(line.text)}</span>
        </div>`
      )
      .join('');

    const mapHtml = task.mapSpec ? renderListeningMapSVG(task.mapSpec) : '';

    container.innerHTML = `
      <h2 class="stimulus-title">${escapeHtml(task.title)}</h2>
      <div class="stimulus-instructions">${escapeHtml(task.instructions)}</div>
      ${renderReferenceBoxHtml(task)}
      ${mapHtml}

      <div class="listening-player-card">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.65rem;padding-bottom:0.55rem;border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <span style="font-family:var(--font-mono);font-size:0.74rem;font-weight:700;color:var(--accent-primary);text-transform:uppercase;">
              &#127911; Dual Audio Studio
            </span>
            <label style="display:inline-flex;align-items:center;gap:0.35rem;font-size:0.76rem;font-weight:600;color:var(--text-secondary);cursor:pointer;">
              <input type="checkbox" id="chk-strict-listening" ${state.strictListeningMode ? 'checked' : ''} />
              &#127919; Strict Exam Mode (1 Play Only &bull; Hide Transcript)
            </label>
          </div>
          <button id="btn-generate-studio-audio" class="btn-ai" type="button" style="padding:0.26rem 0.7rem;font-size:0.75rem;">
            &#10024; Generate Studio Neural Audio (Free AI)
          </button>
        </div>

        <div id="studio-audio-wrap" style="margin-bottom:0.75rem;padding:0.6rem 0.75rem;background:var(--accent-soft);border:1px solid var(--accent-primary);border-radius:var(--radius-sm);" hidden>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.35rem;">
            <strong id="studio-audio-status" style="font-size:0.78rem;color:var(--accent-primary);">&#10024; Gemini Multi-Speaker Neural Studio Audio Ready</strong>
            <div style="display:flex;gap:0.35rem;">
              <button id="btn-studio-rew" class="btn-secondary" type="button" style="padding:0.15rem 0.5rem;font-size:0.72rem;">&#8630; -5s</button>
              <button id="btn-studio-fwd" class="btn-secondary" type="button" style="padding:0.15rem 0.5rem;font-size:0.72rem;">+5s &#8631;</button>
            </div>
          </div>
          <audio id="gemini-studio-audio" controls style="width:100%;height:36px;"></audio>
        </div>

        <div class="audio-controls-row">
          <button id="btn-play-listening" class="play-btn-large" type="button" title="Play / Stop Multi-Accent Browser Audio">
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
          <div style="display:flex;gap:0.3rem;align-items:center;flex-wrap:wrap;">
            <button id="btn-prev-turn" class="btn-secondary" type="button" title="Previous Spoken Turn" style="padding:0.3rem 0.55rem;font-size:0.75rem;">&#9664;</button>
            <button id="btn-next-turn" class="btn-secondary" type="button" title="Next Spoken Turn" style="padding:0.3rem 0.55rem;font-size:0.75rem;">&#9654;</button>
            <select id="listening-accent-select" class="submode-select" aria-label="Voice Accent" style="font-size:0.75rem;padding:0.3rem 0.45rem;">
              <option value="auto" ${state.accentMode === 'auto' ? 'selected' : ''}>Accents: UK/AU/US Mix</option>
              <option value="en-GB" ${state.accentMode === 'en-GB' ? 'selected' : ''}>British (en-GB)</option>
              <option value="en-AU" ${state.accentMode === 'en-AU' ? 'selected' : ''}>Australian (en-AU)</option>
              <option value="en-US" ${state.accentMode === 'en-US' ? 'selected' : ''}>North American (en-US)</option>
            </select>
            <select id="listening-speed-select" class="submode-select" aria-label="Audio Speed" style="font-size:0.75rem;padding:0.3rem 0.45rem;">
              <option value="0.9" ${state.playbackRate === 0.9 ? 'selected' : ''}>0.9x Calm</option>
              <option value="1" ${state.playbackRate === 1.0 ? 'selected' : ''}>1.0x Exam Pace</option>
              <option value="1.1" ${state.playbackRate === 1.1 ? 'selected' : ''}>1.1x Brisk</option>
            </select>
          </div>
        </div>

        <label for="listening-scratchpad" style="display:block;font-size:0.78rem;font-weight:600;color:var(--text-muted);margin-top:0.9rem;">
          Listening Scratchpad (Auto-saved — jot down numbers, dates, and keywords while listening):
        </label>
        <textarea id="listening-scratchpad" class="listening-scratchpad" placeholder="Type rough listening notes here...">${escapeHtml(scratchpadText)}</textarea>

        <div style="margin-top:0.75rem;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.76rem;color:var(--text-muted);">
            ${state.strictListeningMode ? 'Strict Exam Mode active: Transcript locked until you submit.' : 'Tip: Click any transcript line below to jump audio to that turn.'}
          </span>
          <button id="btn-toggle-transcript" class="btn-secondary" type="button" style="padding:0.25rem 0.65rem;font-size:0.75rem;" ${state.strictListeningMode ? 'disabled' : ''}>
            Show / Hide Transcript
          </button>
        </div>

        <div id="listening-transcript-box" class="transcript-box" hidden>
          ${transcriptHtml}
        </div>
      </div>
    `;

    // Check if Gemini Studio Neural WAV is already cached in IndexedDB for this task
    getCachedListeningAudioUrl(task.id).then((cachedUrl) => {
      if (cachedUrl && state.currentTask?.id === task.id) {
        mountStudioAudioUrl(cachedUrl);
      }
    });

    document.getElementById('chk-strict-listening')?.addEventListener('change', (e) => {
      state.strictListeningMode = Boolean(e.target.checked);
      renderLeftStimulus(task);
    });

    document.getElementById('btn-generate-studio-audio')?.addEventListener('click', () => {
      handleGenerateStudioAudio(task);
    });

    document.getElementById('btn-studio-rew')?.addEventListener('click', () => {
      const aud = document.getElementById('gemini-studio-audio');
      if (aud) aud.currentTime = Math.max(0, aud.currentTime - 5);
    });

    document.getElementById('btn-studio-fwd')?.addEventListener('click', () => {
      const aud = document.getElementById('gemini-studio-audio');
      if (aud) aud.currentTime = Math.min(aud.duration || 9999, aud.currentTime + 5);
    });

    document.getElementById('btn-play-listening')?.addEventListener('click', () => {
      startTimerIfNotRunning();
      toggleListeningAudio(task, state.currentLineIdx || 0);
    });

    document.getElementById('btn-prev-turn')?.addEventListener('click', () => {
      if (state.strictListeningMode) return;
      const nextIdx = Math.max(0, (state.currentLineIdx || 0) - 1);
      stopListeningAudio();
      toggleListeningAudio(task, nextIdx);
    });

    document.getElementById('btn-next-turn')?.addEventListener('click', () => {
      if (state.strictListeningMode) return;
      const maxIdx = Math.max(0, (task.script || []).length - 1);
      const nextIdx = Math.min(maxIdx, (state.currentLineIdx || 0) + 1);
      stopListeningAudio();
      toggleListeningAudio(task, nextIdx);
    });

    document.getElementById('listening-accent-select')?.addEventListener('change', (e) => {
      state.accentMode = e.target.value || 'auto';
      if (state.isPlayingAudio) {
        const resumeIdx = state.currentLineIdx || 0;
        stopListeningAudio();
        toggleListeningAudio(task, resumeIdx);
      }
    });

    document.getElementById('listening-speed-select')?.addEventListener('change', (e) => {
      state.playbackRate = parseFloat(e.target.value) || 1.0;
      const aud = document.getElementById('gemini-studio-audio');
      if (aud) aud.playbackRate = state.playbackRate;
    });

    document.getElementById('listening-scratchpad')?.addEventListener('input', () => {
      startTimerIfNotRunning();
      const map = getObjectiveAnswersFromDOM(task);
      saveDraft(task.id, map);
    });

    document.getElementById('btn-toggle-transcript')?.addEventListener('click', () => {
      if (state.strictListeningMode) return;
      const box = document.getElementById('listening-transcript-box');
      if (box) box.hidden = !box.hidden;
    });

    container.querySelectorAll('.transcript-line').forEach((lineEl) => {
      lineEl.addEventListener('click', () => {
        if (state.strictListeningMode) return;
        const idx = Number(lineEl.getAttribute('data-line-idx')) || 0;
        stopListeningAudio();
        toggleListeningAudio(task, idx);
      });
    });

    return;
  }

  if (task.section === 'speaking') {
    const blindSteps = buildSpeakingBlindSteps(task);
    const activeStep = blindSteps[Math.min(state.blindStepIdx, blindSteps.length - 1)] || blindSteps[0];

    const part1Html = state.speakingBlindMode
      ? `<p style="font-size:0.86rem;color:var(--text-muted);font-style:italic;padding:0.4rem 0;">&#128274; Part 1 written questions are hidden in Real Exam Blind Mode. Use the Turn-by-Turn Examiner Audio Bar above to hear each question aloud!</p>`
      : `<ol style="padding-left:1.25rem;font-size:0.93rem;">${(task.part1 || []).map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ol>`;

    const bulletsHtml = (task.part2?.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('');

    const part3Html = state.speakingBlindMode
      ? `<p style="font-size:0.86rem;color:var(--text-muted);font-style:italic;padding:0.4rem 0;">&#128274; Part 3 written questions are hidden in Real Exam Blind Mode. Use the Turn-by-Turn Examiner Audio Bar above to hear each question aloud!</p>`
      : `<ol style="padding-left:1.25rem;font-size:0.93rem;">${(task.part3 || []).map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ol>`;

    const blindControllerHtml = state.speakingBlindMode
      ? `
      <div style="background:var(--accent-soft);border:1.5px solid var(--accent-primary);border-radius:var(--radius-sm);padding:0.85rem 1rem;margin-bottom:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;">
          <span style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;color:var(--accent-primary);text-transform:uppercase;">
            &#127908; Live Examiner Turn ${state.blindStepIdx + 1} of ${blindSteps.length}: ${escapeHtml(activeStep.label)}
          </span>
          <span style="font-size:0.75rem;color:var(--text-secondary);">
            ${activeStep.isCueCard ? 'Part 2 Cue Card is visible below (1-Min Prep)' : 'Audio-Only Prompt (Hidden like Real IELTS)'}
          </span>
        </div>
        <div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;">
          <button id="btn-blind-prev" class="btn-secondary" type="button" style="padding:0.32rem 0.65rem;font-size:0.78rem;" ${state.blindStepIdx <= 0 ? 'disabled' : ''}>
            &#9664; Prev Turn
          </button>
          <button id="btn-blind-speak" class="btn-primary" type="button" style="padding:0.35rem 0.9rem;font-size:0.8rem;">
            &#128266; Examiner: Ask This Question Aloud
          </button>
          <button id="btn-blind-next" class="btn-secondary" type="button" style="padding:0.32rem 0.65rem;font-size:0.78rem;" ${state.blindStepIdx >= blindSteps.length - 1 ? 'disabled' : ''}>
            Next Question &rarr;
          </button>
        </div>
      </div>`
      : '';

    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;">
        <h2 class="stimulus-title" style="margin-bottom:0;">${escapeHtml(task.title)}</h2>
        <label style="display:inline-flex;align-items:center;gap:0.4rem;background:var(--bg-elevated);border:1px solid var(--border-strong);padding:0.3rem 0.7rem;border-radius:99px;font-size:0.76rem;font-weight:700;color:var(--accent-primary);cursor:pointer;">
          <input type="checkbox" id="chk-speaking-blind" ${state.speakingBlindMode ? 'checked' : ''} />
          &#127917; Real Exam Blind Mode (Turn-by-Turn Audio)
        </label>
      </div>
      <div class="stimulus-instructions">${escapeHtml(task.instructions)}</div>

      ${blindControllerHtml}

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 1 &mdash; Introduction &amp; Interview (3–4 mins)</span>
          <button class="btn-secondary btn-speak-prompt" data-part="part1" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
            &#128266; Hear Part 1
          </button>
        </div>
        ${part1Html}
      </div>

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 2 &mdash; Individual Long Turn Cue Card (Always Visible)</span>
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
          <div class="cue-card-topic">${escapeHtml(task.part2?.topic || '')}</div>
          <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.3rem;">You should say:</p>
          <ul class="cue-card-bullets">${bulletsHtml}</ul>
        </div>
      </div>

      <div class="speaking-part-block">
        <div class="speaking-part-header">
          <span class="speaking-part-title">Part 3 &mdash; Two-Way Abstract Discussion (4–5 mins)</span>
          <button class="btn-secondary btn-speak-prompt" data-part="part3" type="button" style="padding:0.22rem 0.6rem;font-size:0.75rem;">
            &#128266; Hear Part 3
          </button>
        </div>
        ${part3Html}
      </div>
    `;

    document.getElementById('chk-speaking-blind')?.addEventListener('change', (e) => {
      state.speakingBlindMode = Boolean(e.target.checked);
      state.blindStepIdx = 0;
      renderLeftStimulus(task);
      if (state.speakingBlindMode) {
        const steps = buildSpeakingBlindSteps(task);
        if (steps[0]) speakSingleExaminerText(steps[0].speechText);
      }
    });

    document.getElementById('btn-blind-speak')?.addEventListener('click', () => {
      startTimerIfNotRunning();
      if (activeStep) speakSingleExaminerText(activeStep.speechText);
    });

    document.getElementById('btn-blind-prev')?.addEventListener('click', () => {
      if (state.blindStepIdx > 0) {
        state.blindStepIdx -= 1;
        renderLeftStimulus(task);
        const steps = buildSpeakingBlindSteps(task);
        if (steps[state.blindStepIdx]) speakSingleExaminerText(steps[state.blindStepIdx].speechText);
      }
    });

    document.getElementById('btn-blind-next')?.addEventListener('click', () => {
      if (state.blindStepIdx < blindSteps.length - 1) {
        state.blindStepIdx += 1;
        renderLeftStimulus(task);
        const steps = buildSpeakingBlindSteps(task);
        if (steps[state.blindStepIdx]) speakSingleExaminerText(steps[state.blindStepIdx].speechText);
      }
    });

    container.querySelectorAll('.btn-speak-prompt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const part = btn.getAttribute('data-part');
        speakExaminerPrompts(task, part);
      });
    });

    document.getElementById('btn-prep-timer')?.addEventListener('click', togglePart2PrepTimer);
  }
}

function buildSpeakingBlindSteps(task) {
  const steps = [];
  (task.part1 || []).forEach((q, idx) => {
    steps.push({
      label: `Part 1 — Question ${idx + 1} of ${(task.part1 || []).length}`,
      speechText: `Part 1, Question ${idx + 1}. ${q}`,
      isCueCard: false
    });
  });
  if (task.part2) {
    steps.push({
      label: 'Part 2 — Individual Long Turn Cue Card',
      speechText: `Now we move to Part 2. Please read the Cue Card on your screen. You have one minute to prepare notes, and then you should speak for one to two minutes. ${task.part2.topic || ''}`,
      isCueCard: true
    });
  }
  (task.part3 || []).forEach((q, idx) => {
    steps.push({
      label: `Part 3 — Discussion Question ${idx + 1} of ${(task.part3 || []).length}`,
      speechText: `Part 3, Question ${idx + 1}. ${q}`,
      isCueCard: false
    });
  });
  return steps;
}

function renderRightResponse(task) {
  const container = document.getElementById('response-body');
  if (!container) return;
  const savedDraft = state.drafts[task.id];

  if (task.section === 'reading' || task.section === 'listening') {
    const draftMap = savedDraft && typeof savedDraft === 'object' ? savedDraft : {};
    let html = '';
    let lastGroup = '';

    (task.questions || []).forEach((q, idx) => {
      if (q.group && q.group !== lastGroup) {
        lastGroup = q.group;
        html += `<div class="task-group-header">${escapeHtml(q.group)}</div>`;
      }

      const currentVal = String(draftMap[q.id] || '');
      let controlHtml = '';

      if (q.type === 'mcq_multi') {
        const maxSel = q.maxSelect || 2;
        const selectedTokens = currentVal
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean);
        const opts = q.options || [];
        controlHtml = `
          <div style="font-size:0.75rem;font-weight:700;color:var(--accent-primary);margin-bottom:0.35rem;">
            Select ${maxSel} options (Selected: <span id="multi-count-${escapeHtmlAttr(q.id)}">${selectedTokens.length}</span>/${maxSel})
          </div>
          <div class="options-grid multi-options-grid" data-qid="${escapeHtmlAttr(q.id)}" data-max="${maxSel}" style="flex-direction:column;align-items:stretch;">
            ${opts
              .map((opt) => {
                const letterMatch = String(opt).trim().match(/^([A-G])\b/i);
                const letterCode = letterMatch ? letterMatch[1].toUpperCase() : opt;
                const isSel = selectedTokens.includes(letterCode.toUpperCase()) || selectedTokens.includes(opt.toUpperCase());
                return `
                  <button type="button" class="option-pill multi-pill ${isSel ? 'selected' : ''}" data-qid="${escapeHtmlAttr(q.id)}" data-val="${escapeHtmlAttr(letterCode)}" style="text-align:left;">
                    ${escapeHtml(opt)}
                  </button>`;
              })
              .join('')}
          </div>`;
      } else if (q.type === 'tfng' || q.type === 'mcq') {
        const opts = q.options || ['TRUE', 'FALSE', 'NOT GIVEN'];
        controlHtml = `<div class="options-grid" data-qid="${escapeHtmlAttr(q.id)}">
          ${opts
            .map(
              (opt) => `
              <button type="button" class="option-pill ${currentVal === opt ? 'selected' : ''}" data-qid="${escapeHtmlAttr(q.id)}" data-val="${escapeHtmlAttr(opt)}">
                ${escapeHtml(opt)}
              </button>`
            )
            .join('')}
        </div>`;
      } else {
        controlHtml = `
          <input type="text" class="fill-input" data-qid="${escapeHtmlAttr(q.id)}" value="${escapeHtmlAttr(currentVal)}" placeholder="Type your answer..." autocomplete="off" />
        `;
      }

      html += `
        <div class="question-card" id="qcard-${escapeHtmlAttr(q.id)}">
          <div class="question-prompt">
            <span class="q-num">Q${idx + 1}</span>
            <span>${escapeHtml(q.prompt)}</span>
          </div>
          ${controlHtml}
          <div class="question-explanation" id="qexp-${escapeHtmlAttr(q.id)}" hidden></div>
        </div>
      `;
    });

    html += `
      <div class="submit-bar">
        <span style="font-size:0.8rem;color:var(--text-muted);">
          Timer is a reminder only &mdash; submit whenever you are ready (Ctrl+Enter).
        </span>
        <button id="btn-submit-task" class="btn-primary" type="button">
          &#10003; Submit &amp; Get IELTS Band Score
        </button>
      </div>
    `;

    container.innerHTML = html;

    // Attach single-select option pill listeners
    container.querySelectorAll('.option-pill:not(.multi-pill)').forEach((btn) => {
      btn.addEventListener('click', () => {
        startTimerIfNotRunning();
        const qid = btn.getAttribute('data-qid');
        const group = container.querySelector(`.options-grid[data-qid="${qid}"]`);
        group?.querySelectorAll('.option-pill').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');

        const map = getObjectiveAnswersFromDOM(task);
        saveDraft(task.id, map);
      });
    });

    // Attach multi-select ("Choose TWO") option pill listeners
    container.querySelectorAll('.multi-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        startTimerIfNotRunning();
        const qid = btn.getAttribute('data-qid');
        const group = container.querySelector(`.multi-options-grid[data-qid="${qid}"]`);
        const maxSel = Number(group?.getAttribute('data-max')) || 2;
        if (btn.classList.contains('selected')) {
          btn.classList.remove('selected');
        } else {
          const currentSelected = group?.querySelectorAll('.multi-pill.selected') || [];
          if (currentSelected.length >= maxSel) {
            currentSelected[0].classList.remove('selected');
          }
          btn.classList.add('selected');
        }
        const newCount = (group?.querySelectorAll('.multi-pill.selected') || []).length;
        const countEl = document.getElementById(`multi-count-${qid}`);
        if (countEl) countEl.textContent = String(newCount);

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
  if (!container) return map;

  (task.questions || []).forEach((q) => {
    if (q.type === 'mcq_multi') {
      const selectedBtns = container.querySelectorAll(`.multi-options-grid[data-qid="${q.id}"] .multi-pill.selected`);
      const vals = Array.from(selectedBtns)
        .map((b) => b.getAttribute('data-val'))
        .filter(Boolean)
        .sort();
      if (vals.length > 0) map[q.id] = vals.join(', ');
    } else if (q.type === 'tfng' || q.type === 'mcq') {
      const sel = container.querySelector(`.options-grid[data-qid="${q.id}"] .option-pill.selected`);
      if (sel) map[q.id] = sel.getAttribute('data-val');
    } else {
      const inp = container.querySelector(`.fill-input[data-qid="${q.id}"]`);
      if (inp) map[q.id] = inp.value.trim();
    }
  });

  if (task.section === 'listening') {
    const scratch = document.getElementById('listening-scratchpad');
    if (scratch) map.__scratchpad = scratch.value;
  }

  return map;
}

// ==========================================================================
// READING HIGHLIGHTER (SAFE FRAGMENT EXTRACTION — NO OVERLAP ERRORS)
// ==========================================================================

function highlightSelectedPassageText() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const passageBox = document.getElementById('reading-passage-content');
  if (!passageBox || !passageBox.contains(range.commonAncestorContainer)) return;

  try {
    const fragment = range.extractContents();
    // Unwrap any existing <mark class="user-highlight"> inside the extracted fragment to prevent nesting
    fragment.querySelectorAll?.('mark.user-highlight').forEach((nested) => {
      const p = nested.parentNode;
      while (nested.firstChild) p.insertBefore(nested.firstChild, nested);
      p.removeChild(nested);
    });

    const mark = document.createElement('mark');
    mark.className = 'user-highlight';
    mark.title = 'Click to remove highlight';
    mark.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
    });
    mark.appendChild(fragment);
    range.insertNode(mark);
    sel.removeAllRanges();
  } catch (e) {
    // Ignore if selection crosses block boundaries
  }
}

// ==========================================================================
// LISTENING DUAL AUDIO ENGINE: GEMINI NEURAL STUDIO TTS + ENHANCED VOICES
// ==========================================================================

function mountStudioAudioUrl(wavUrl) {
  const wrap = document.getElementById('studio-audio-wrap');
  const aud = document.getElementById('gemini-studio-audio');
  const btn = document.getElementById('btn-generate-studio-audio');
  if (!wrap || !aud) return;
  wrap.hidden = false;
  aud.src = wavUrl;
  aud.playbackRate = state.playbackRate || 1.0;
  if (btn) {
    btn.innerHTML = '&#10003; Studio Neural Audio Active (Cached)';
  }
  aud.onplay = () => {
    startTimerIfNotRunning();
    stopListeningAudio();
  };
  aud.onended = () => {
    state.listeningPlayCount += 1;
    if (state.strictListeningMode && state.listeningPlayCount >= 1) {
      aud.controls = false;
      const st = document.getElementById('studio-audio-status');
      if (st) st.textContent = 'Strict Exam Mode: 1st play completed. Submit answers to unlock replay & transcript.';
    }
  };
}

async function handleGenerateStudioAudio(task) {
  if (!state.apiKey) {
    document.getElementById('modal-settings').hidden = false;
    return;
  }
  const btn = document.getElementById('btn-generate-studio-audio');
  if (!btn) return;
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '&#9203; Synthesizing Multi-Speaker Neural Audio...';

  try {
    const wavUrl = await synthesizeListeningAudioWithGemini(state.apiKey, task);
    mountStudioAudioUrl(wavUrl);
    const aud = document.getElementById('gemini-studio-audio');
    if (aud) aud.play().catch(() => {});
  } catch (err) {
    alert(
      `Studio Neural TTS notice: ${err.message}\n\nUsing the enhanced Multi-Accent Browser Voice Player instead!`
    );
    btn.innerHTML = origHtml;
  } finally {
    btn.disabled = false;
  }
}

/**
 * Ranks available browser voices so Natural / Neural / Online / Google / Microsoft voices
 * across British (en-GB), Australian (en-AU), and North American (en-US) accents come first.
 */
function getRankedSpeakerVoices(accentFilter = 'auto') {
  if (!('speechSynthesis' in window)) return [];
  const allVoices = window.speechSynthesis.getVoices() || [];
  let enVoices = allVoices.filter((v) => /^en(-|_)/i.test(v.lang));
  if (accentFilter !== 'auto') {
    const filtered = enVoices.filter((v) =>
      v.lang.toLowerCase().startsWith(accentFilter.toLowerCase())
    );
    if (filtered.length > 0) enVoices = filtered;
  }

  const scoreVoice = (v) => {
    let score = 0;
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 50;
    if (name.includes('google') || name.includes('premium') || name.includes('enhanced')) score += 30;
    if (name.includes('sonia') || name.includes('ryan') || name.includes('libby') || name.includes('natasha') || name.includes('william')) score += 25;
    if (lang.startsWith('en-gb') || lang.startsWith('en-au')) score += 15;
    if (!v.localService) score += 10;
    return score;
  };

  return (enVoices.length > 0 ? enVoices : allVoices).slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

function stopListeningAudio() {
  if (state.ttsKeepAliveInterval) {
    clearInterval(state.ttsKeepAliveInterval);
    state.ttsKeepAliveInterval = null;
  }
  if (state.ttsPauseTimeout) {
    clearTimeout(state.ttsPauseTimeout);
    state.ttsPauseTimeout = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isPlayingAudio = false;
  const icon = document.getElementById('listening-play-icon');
  if (icon) icon.innerHTML = '&#9654;';

  document.querySelectorAll('.transcript-line.is-speaking').forEach((el) => {
    el.classList.remove('is-speaking');
  });
}

function toggleListeningAudio(task, startIdx = 0) {
  if (!('speechSynthesis' in window)) {
    const box = document.getElementById('listening-transcript-box');
    if (box) box.hidden = false;
    alert(
      'Browser Speech Synthesis is unavailable on this device. The written transcript has been opened below so you can complete the questions.'
    );
    return;
  }

  if (state.isPlayingAudio) {
    stopListeningAudio();
    return;
  }

  if (state.strictListeningMode && state.listeningPlayCount >= 1) {
    alert(
      'Strict Exam Mode is active: the recording has already been played once. Submit your answers to unlock unlimited replays and the transcript!'
    );
    return;
  }

  const lines = task.script || [];
  if (!lines.length) return;

  state.isPlayingAudio = true;
  const icon = document.getElementById('listening-play-icon');
  if (icon) icon.innerHTML = '&#9632;';

  const voices = getRankedSpeakerVoices(state.accentMode);
  const speakerVoiceMap = new Map();
  let speakerCounter = 0;

  state.ttsKeepAliveInterval = setInterval(() => {
    if (state.isPlayingAudio && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
    }
  }, 5000);

  let idx = Math.max(0, Math.min(startIdx, lines.length - 1));
  const speakNextLine = () => {
    if (!state.isPlayingAudio || idx >= lines.length) {
      const completedAll = idx >= lines.length;
      stopListeningAudio();
      if (completedAll) {
        state.listeningPlayCount += 1;
        state.currentLineIdx = 0;
        const fill = document.getElementById('audio-progress-fill');
        if (fill) fill.style.width = '100%';
        const lbl = document.getElementById('audio-speaker-label');
        if (lbl) {
          lbl.textContent = state.strictListeningMode
            ? 'Strict Exam Mode: 1st play complete (Submit to unlock replay)'
            : 'Audio complete — click Play to listen again';
        }
      }
      return;
    }

    state.currentLineIdx = idx;
    const line = lines[idx];
    const lbl = document.getElementById('audio-speaker-label');
    const fill = document.getElementById('audio-progress-fill');
    if (lbl) lbl.textContent = `Speaking now: ${line.speaker} (Turn ${idx + 1} of ${lines.length})`;
    if (fill) fill.style.width = `${Math.round(((idx + 0.5) / lines.length) * 100)}%`;

    document.querySelectorAll('.transcript-line').forEach((el) => {
      el.classList.toggle('is-speaking', Number(el.getAttribute('data-line-idx')) === idx);
    });

    const utter = new SpeechSynthesisUtterance(line.text);
    utter.lang = state.accentMode === 'auto' ? 'en-GB' : state.accentMode;
    if (voices.length > 0) {
      if (!speakerVoiceMap.has(line.speaker)) {
        speakerVoiceMap.set(line.speaker, voices[speakerCounter % voices.length]);
        speakerCounter += 1;
      }
      const chosenVoice = speakerVoiceMap.get(line.speaker);
      if (chosenVoice) {
        utter.voice = chosenVoice;
        utter.lang = chosenVoice.lang || utter.lang;
      }
    }
    utter.pitch = line.pitch || 1.0;
    utter.rate = (line.rate || 0.97) * state.playbackRate;

    utter.onend = () => {
      idx += 1;
      // Natural 380ms conversational pause between speaker turns
      state.ttsPauseTimeout = setTimeout(() => {
        if (state.isPlayingAudio) speakNextLine();
      }, 380);
    };
    utter.onerror = () => {
      stopListeningAudio();
    };

    window.speechSynthesis.speak(utter);
  };

  window.speechSynthesis.cancel();
  speakNextLine();
}

function speakSingleExaminerText(textToRead) {
  if (!('speechSynthesis' in window)) return;
  stopListeningAudio();
  const voices = getRankedSpeakerVoices('en-GB');
  const utter = new SpeechSynthesisUtterance(textToRead);
  utter.lang = 'en-GB';
  if (voices[0]) utter.voice = voices[0];
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

function speakExaminerPrompts(task, part) {
  let textToRead = '';
  if (part === 'part1') {
    textToRead = 'Part 1. ' + (task.part1 || []).join(' Next question: ');
  } else if (part === 'part2') {
    textToRead = `Part 2 Cue Card. ${task.part2?.topic || ''}. You should say: ${(task.part2?.bullets || []).join(', ')}`;
  } else {
    textToRead = 'Part 3 Discussion. ' + (task.part3 || []).join(' Next question: ');
  }
  speakSingleExaminerText(textToRead);
}

function togglePart2PrepTimer() {
  const readout = document.getElementById('prep-timer-readout');
  if (state.prepInterval) {
    clearPart2PrepTimer();
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
// SPEAKING MICROPHONE RECORDER + CONTINUOUS SPEECH RECOGNITION
// ==========================================================================

function stopSpeakingRecording() {
  state.isRecording = false;
  if (state.speechRecognition) {
    try {
      state.speechRecognition.onend = null;
      state.speechRecognition.stop();
    } catch (e) {
      // ignore
    }
    state.speechRecognition = null;
  }
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
    try {
      state.mediaRecorder.stop();
    } catch (e) {
      // ignore
    }
  }
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
    cleanupRecordedAudioUrl();
    state.recordedChunks = [];
    const mimeType =
      typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
    const recorder = new MediaRecorder(stream);
    state.mediaRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) state.recordedChunks.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (state.recordedChunks.length === 0) return;
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

    // Start live Web Speech Recognition with auto-restart on silence pauses
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
      rec.onend = () => {
        if (state.isRecording) {
          try {
            rec.start();
          } catch (e) {
            // ignore
          }
        }
      };
      try {
        rec.start();
        state.speechRecognition = rec;
      } catch (e) {
        // ignore
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

function applyObjectiveQuestionHighlights(task, evalResult) {
  if (!task || !evalResult) return;
  if (task.section !== 'reading' && task.section !== 'listening') return;

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

  // Unlock listening transcript and replay automatically after submission
  state.listeningPlayCount = 0;
  const transBox = document.getElementById('listening-transcript-box');
  if (transBox) transBox.hidden = false;
  const transBtn = document.getElementById('btn-toggle-transcript');
  if (transBtn) transBtn.disabled = false;
  const studioAud = document.getElementById('gemini-studio-audio');
  if (studioAud) studioAud.controls = true;
}

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
    evalResult.examinerSummary =
      `(Note: Gemini API call failed: ${err.message}. Showing local heuristic score.)\n\n` +
      evalResult.examinerSummary;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '✓ Re-Submit / Update Evaluation';
    }
  }

  applyObjectiveQuestionHighlights(task, evalResult);

  // Preserve previous elapsed time if re-evaluating a historical submission from 00:00
  const existingEntry = state.history.find((h) => h.taskId === task.id);
  const finalElapsedSeconds =
    state.elapsedSeconds > 0
      ? state.elapsedSeconds
      : existingEntry?.elapsedSeconds || 0;

  state.seenIds.add(task.id);
  const elapsedFormatted = formatMMSS(finalElapsedSeconds);
  const wasOvertime = finalElapsedSeconds > TARGET_SECONDS;

  const historyEntry = {
    entryId: existingEntry?.entryId || `hist-${Date.now()}`,
    taskId: task.id,
    dateISO: new Date().toISOString(),
    section: task.section,
    title: task.title,
    topic: task.topic,
    elapsedSeconds: finalElapsedSeconds,
    elapsedFormatted: wasOvertime
      ? `${elapsedFormatted} (+${formatMMSS(finalElapsedSeconds - TARGET_SECONDS)} over 15m)`
      : `${elapsedFormatted} (within 15m)`,
    overallBand: evalResult.overallBand,
    userSubmission,
    evaluation: evalResult
  };

  state.history = [
    historyEntry,
    ...state.history.filter((h) => h.taskId !== task.id)
  ];
  saveHistoryAndSeen();

  renderEvaluationReport(task, evalResult, historyEntry);
}

function renderEvaluationReport(task, evalResult, historyEntry) {
  const sec = document.getElementById('evaluation-section');
  if (!sec) return;
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
        <p style="margin-top:0.35rem;font-size:0.94rem;color:var(--text-primary);white-space:pre-line;">${escapeHtml(evalResult.examinerSummary || '')}</p>
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

  // Update Next Unseen button badge for current section
  const nextLabel = document.getElementById('next-unseen-label');
  if (nextLabel) {
    const sectionTasks = getMatchingSectionTasks(state.currentSection, state.writingSubMode);
    const unseenCount = sectionTasks.filter((t) => !state.seenIds.has(t.id)).length;
    nextLabel.innerHTML = `&#8634; Next Unseen Task (${unseenCount} left)`;
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
  if (!statsContainer || !listContainer) return;

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
      <div class="stat-label">Unseen in Bank</div>
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
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.2rem;flex-wrap:wrap;">
            <span class="section-badge">${escapeHtml(h.section.toUpperCase())}</span>
            <strong style="font-size:0.95rem;">${escapeHtml(h.title)}</strong>
            ${
              h.evaluation?.isHeuristicFallback
                ? '<span style="font-size:0.7rem;padding:0.08rem 0.45rem;border-radius:99px;background:var(--amber-soft);color:var(--amber-warn);font-weight:700;">Heuristic Score — Click to AI Re-Grade</span>'
                : ''
            }
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);">
            Topic: ${escapeHtml(h.topic || '')} &bull; Time: ${escapeHtml(h.elapsedFormatted || '')} &bull; ${new Date(h.dateISO).toLocaleDateString()}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:var(--accent-primary);">
              Band ${Number(h.overallBand || 0).toFixed(1)}
            </div>
            <span style="font-size:0.74rem;color:var(--text-muted);">Inspect &rarr;</span>
          </div>
          <button type="button" class="icon-btn btn-delete-hist" data-hist-idx="${idx}" title="Remove from history" aria-label="Remove session">
            &#10005;
          </button>
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
        state.elapsedSeconds = entry.elapsedSeconds || 0;
        updateTimerUI();
        applyObjectiveQuestionHighlights(matchingTask, entry.evaluation);
        renderEvaluationReport(matchingTask, entry.evaluation, entry);
      }
      document.getElementById('modal-history').hidden = true;
    });
  });

  listContainer.querySelectorAll('.btn-delete-hist').forEach((delBtn) => {
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = Number(delBtn.getAttribute('data-hist-idx'));
      const entry = state.history[idx];
      if (!entry) return;
      state.history.splice(idx, 1);
      state.seenIds.delete(entry.taskId);
      saveHistoryAndSeen();
      renderHistoryModal();
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

  updateHeaderBadges();

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
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function showApiTestBanner(message, isSuccess) {
  const statusEl = document.getElementById('api-test-status');
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.style.background = isSuccess ? 'var(--emerald-soft)' : 'var(--crimson-soft)';
  statusEl.style.border = `1px solid ${isSuccess ? 'var(--emerald-border)' : 'var(--crimson-border)'}`;
  statusEl.style.color = isSuccess ? 'var(--emerald-ok)' : 'var(--crimson-err)';
  statusEl.textContent = message;
}

function initApp() {
  loadPersistedState();
  applyTheme(state.theme);
  updateHeaderBadges();

  // Pre-warm browser TTS voices list
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }

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
    updateHeaderBadges();
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
  const historyModal = document.getElementById('modal-history');
  document.getElementById('btn-open-history')?.addEventListener('click', () => {
    renderHistoryModal();
    historyModal.hidden = false;
  });
  document.getElementById('btn-close-history')?.addEventListener('click', () => {
    historyModal.hidden = true;
  });
  historyModal?.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.hidden = true;
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
    const statusEl = document.getElementById('api-test-status');
    if (statusEl) statusEl.hidden = true;
    settingsModal.hidden = false;
  });
  document.getElementById('btn-close-settings')?.addEventListener('click', () => {
    settingsModal.hidden = true;
  });
  settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.hidden = true;
  });

  document.getElementById('btn-test-api-key')?.addEventListener('click', async () => {
    const candidateKey = (keyInput?.value || '').trim();
    if (!candidateKey) {
      showApiTestBanner('Please paste a Gemini API key first.', false);
      return;
    }
    const testBtn = document.getElementById('btn-test-api-key');
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    try {
      const activeModel = await verifyGeminiApiKey(candidateKey);
      state.apiKey = candidateKey;
      localStorage.setItem(STORAGE_KEYS.API_KEY, state.apiKey);
      updateHeaderBadges();
      showApiTestBanner(`✓ Connected successfully to ${activeModel}! Key saved.`, true);
    } catch (err) {
      showApiTestBanner(`Connection failed: ${err.message}`, false);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test Connection';
    }
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
    showApiTestBanner('API key removed from browser storage.', false);
  });

  // Global keyboard shortcuts (Escape closes modals, Ctrl/Cmd+Enter submits active task)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (historyModal && !historyModal.hidden) historyModal.hidden = true;
      if (settingsModal && !settingsModal.hidden) settingsModal.hidden = true;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const submitBtn = document.getElementById('btn-submit-task');
      if (submitBtn && !submitBtn.disabled) {
        e.preventDefault();
        handleTaskSubmission();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
