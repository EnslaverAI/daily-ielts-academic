// ==========================================================================
// DAILY IELTS ACADEMIC 15 — GEMINI AI GENERATOR & EXAMINER GRADING ENGINE
// ==========================================================================

const DEFAULT_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.0-flash'
];

let cachedDiscoveredModel = null;
let autoRotateTaskCounter = 0;

export async function discoverAvailableFlashModel(apiKey) {
  if (cachedDiscoveredModel) return cachedDiscoveredModel;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const models = (data.models || []).filter((m) =>
      (m.supportedGenerationMethods || []).includes('generateContent')
    );
    const flashModel =
      models.find((m) => m.name.includes('gemini-3.8-flash')) ||
      models.find(
        (m) =>
          m.name.includes('flash') &&
          !m.name.includes('2.0') &&
          !m.name.includes('1.5')
      ) ||
      models[0];
    if (flashModel && flashModel.name) {
      cachedDiscoveredModel = flashModel.name.replace(/^models\//, '');
      return cachedDiscoveredModel;
    }
  } catch (e) {
    // ignore discovery error
  }
  return null;
}

/**
 * Extracts and parses JSON even if the model wraps it in markdown fences or prose.
 */
function parseModelJSON(rawText) {
  const cleaned = String(rawText || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (firstErr) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw firstErr;
  }
}

async function callGeminiJSON(apiKey, parts, temperature = 0.7) {
  let lastError = null;
  const candidateModels = cachedDiscoveredModel
    ? [
        cachedDiscoveredModel,
        ...DEFAULT_GEMINI_MODELS.filter((m) => m !== cachedDiscoveredModel)
      ]
    : [...DEFAULT_GEMINI_MODELS];

  const tryModel = async (model) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature,
          responseMimeType: 'application/json'
        }
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      const err = new Error(`Gemini API (${model}) HTTP ${res.status}: ${errText}`);
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!rawText) {
      throw new Error(`Empty response from Gemini API (${model}).`);
    }
    cachedDiscoveredModel = model;
    return parseModelJSON(rawText);
  };

  for (const model of candidateModels) {
    try {
      return await tryModel(model);
    } catch (err) {
      lastError = err;
      if (err.status && err.status !== 404) {
        break;
      }
    }
  }

  // Dynamic fallback: query /v1beta/models for the active flash model on this account
  cachedDiscoveredModel = null;
  const discovered = await discoverAvailableFlashModel(apiKey);
  if (discovered && !candidateModels.includes(discovered)) {
    try {
      return await tryModel(discovered);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to Gemini API.');
}

/**
 * Verifies a user's Gemini API key and returns the active model name.
 */
export async function verifyGeminiApiKey(apiKey) {
  const result = await callGeminiJSON(
    apiKey,
    [{ text: 'Return strict JSON: {"status":"ok"}' }],
    0.0
  );
  if (result && result.status) {
    return cachedDiscoveredModel || DEFAULT_GEMINI_MODELS[0];
  }
  return cachedDiscoveredModel || DEFAULT_GEMINI_MODELS[0];
}

/**
 * Rounds any numeric score to official IELTS 0.5 band increments (clamped 0.0 - 9.0).
 */
export function roundIeltsBand(val, fallback = 6.5) {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  const clamped = Math.min(9.0, Math.max(0.0, num));
  return Math.round(clamped * 2) / 2;
}

/**
 * Sanitizes and normalizes an AI-generated task so it never fails rendering or grading.
 */
function sanitizeGeneratedTask(raw, section, subMode) {
  const task = raw && typeof raw === 'object' ? raw : {};
  task.section = section;
  if (!task.id || typeof task.id !== 'string') {
    task.id = `ai-${section}-${Date.now()}`;
  }
  if (!task.title) {
    task.title = `Academic ${section.toUpperCase()} Workout`;
  }
  if (!task.topic) {
    task.topic = 'Interdisciplinary Academic Research';
  }

  if (section === 'reading' || section === 'listening') {
    if (!Array.isArray(task.questions)) task.questions = [];
    task.questions = task.questions.map((q, idx) => {
      const qId = q.id || `q${idx + 1}`;
      const type = q.type || (idx < 4 ? (section === 'reading' ? 'tfng' : 'fill') : 'mcq');
      let options = Array.isArray(q.options) ? q.options.map(String) : undefined;
      if (type === 'tfng') {
        options = ['TRUE', 'FALSE', 'NOT GIVEN'];
      }
      let answer = String(q.answer ?? '').trim();

      if (type === 'tfng') {
        const up = answer.toUpperCase();
        if (up.includes('TRUE') || up === 'T') answer = 'TRUE';
        else if (up.includes('FALSE') || up === 'F') answer = 'FALSE';
        else answer = 'NOT GIVEN';
      } else if (type === 'mcq' && Array.isArray(options) && options.length > 0) {
        // If AI returned "B" or "B)" instead of the full option string, match it to options
        if (!options.includes(answer)) {
          const letterMatch = answer.match(/^([A-D])\b/i);
          if (letterMatch) {
            const prefix = letterMatch[1].toUpperCase();
            const found = options.find((opt) =>
              opt.trim().toUpperCase().startsWith(prefix + ')') ||
              opt.trim().toUpperCase().startsWith(prefix + '.')
            );
            if (found) answer = found;
          }
        }
      }

      const acceptableAnswers = Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0
        ? Array.from(new Set([answer, ...q.acceptableAnswers.map(String)]))
        : [answer];

      return {
        id: qId,
        group: q.group || (idx < 4 ? 'Task A — Questions 1–4' : 'Task B — Questions 5–7'),
        type,
        prompt: String(q.prompt || `Question ${idx + 1}`),
        options,
        answer,
        acceptableAnswers,
        explanation: String(q.explanation || `Verified against the academic ${section} text.`)
      };
    });
  }

  if (section === 'writing') {
    task.subMode = subMode;
    task.targetWords = subMode === 'task1' ? 150 : 180;
  }

  return task;
}

/**
 * Generates a brand-new, non-repeating 15-minute IELTS Academic task via Gemini.
 */
export async function generateFreshTaskWithGemini(apiKey, section, subMode, excludedTopics) {
  const exclusionList =
    excludedTopics && excludedTopics.length > 0
      ? excludedTopics.slice(0, 60).join('; ')
      : 'None yet';

  let resolvedWritingMode = subMode;
  if (section === 'writing' && (!subMode || subMode === 'any')) {
    autoRotateTaskCounter += 1;
    resolvedWritingMode = autoRotateTaskCounter % 2 === 1 ? 'task1' : 'task2';
  }

  let schemaInstruction = '';
  if (section === 'reading') {
    schemaInstruction = `
Generate a 15-minute IELTS Academic Reading workout with 2 sub-tasks (7 questions total).
Return strict JSON with this exact structure:
{
  "id": "ai-read-<unique-slug>",
  "section": "reading",
  "taskType": "Academic Passage + T/F/NG & Completion/MCQ",
  "topic": "<Academic Discipline & Specific Topic>",
  "title": "<Academic Title>",
  "instructions": "Read the academic passage below (recommended time: 15 minutes) and complete BOTH Task A (Questions 1–4) and Task B (Questions 5–7).",
  "paragraphs": [
    { "label": "A", "text": "<95-115 words of dense C1/C2 academic prose>" },
    { "label": "B", "text": "<95-115 words>" },
    { "label": "C", "text": "<95-115 words>" },
    { "label": "D", "text": "<95-115 words>" }
  ],
  "questions": [
    {
      "id": "q1",
      "group": "Task A — Questions 1–4: True / False / Not Given",
      "type": "tfng",
      "prompt": "<Statement 1>",
      "options": ["TRUE", "FALSE", "NOT GIVEN"],
      "answer": "TRUE",
      "explanation": "<Exact paragraph reference and reasoning>"
    },
    {
      "id": "q2",
      "group": "Task A — Questions 1–4: True / False / Not Given",
      "type": "tfng",
      "prompt": "<Statement 2>",
      "options": ["TRUE", "FALSE", "NOT GIVEN"],
      "answer": "FALSE",
      "explanation": "<Exact paragraph reference and reasoning>"
    },
    {
      "id": "q3",
      "group": "Task A — Questions 1–4: True / False / Not Given",
      "type": "tfng",
      "prompt": "<Statement 3>",
      "options": ["TRUE", "FALSE", "NOT GIVEN"],
      "answer": "NOT GIVEN",
      "explanation": "<Exact paragraph reference and reasoning>"
    },
    {
      "id": "q4",
      "group": "Task A — Questions 1–4: True / False / Not Given",
      "type": "tfng",
      "prompt": "<Statement 4>",
      "options": ["TRUE", "FALSE", "NOT GIVEN"],
      "answer": "TRUE",
      "explanation": "<Exact paragraph reference and reasoning>"
    },
    {
      "id": "q5",
      "group": "Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)",
      "type": "fill",
      "prompt": "<Sentence with ________ blank> (Write ONE WORD from the passage)",
      "answer": "<word>",
      "acceptableAnswers": ["<word>"],
      "explanation": "<Paragraph reference>"
    },
    {
      "id": "q6",
      "group": "Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)",
      "type": "fill",
      "prompt": "<Sentence with ________ blank> (Write ONE WORD from the passage)",
      "answer": "<word>",
      "acceptableAnswers": ["<word>"],
      "explanation": "<Paragraph reference>"
    },
    {
      "id": "q7",
      "group": "Task B — Questions 5–7: Sentence Completion & Multiple Choice (ONE WORD ONLY for Q5–Q6)",
      "type": "mcq",
      "prompt": "<Multiple choice question stem>",
      "options": ["A) <Option A>", "B) <Option B>", "C) <Option C>", "D) <Option D>"],
      "answer": "B) <Option B>",
      "explanation": "<Paragraph reference>"
    }
  ]
}`;
  } else if (section === 'writing') {
    if (resolvedWritingMode === 'task1') {
      const chartTypes = ['bar', 'line', 'table', 'stacked'];
      const chosenChart = chartTypes[Math.floor(Math.random() * chartTypes.length)];
      schemaInstruction = `
Generate an IELTS Academic Writing Task 1 data report workout (15-minute sprint, target 150 words) featuring a "${chosenChart}" chart/table.
Return strict JSON with this exact structure:
{
  "id": "ai-write-t1-<unique-slug>",
  "section": "writing",
  "subMode": "task1",
  "taskType": "Academic Writing Task 1 — Data Report (15-Min Sprint)",
  "topic": "<Specific Academic/Economic/Environmental Topic>",
  "title": "Task 1: <Chart Title>",
  "targetWords": 150,
  "instructions": "Spend about 15 minutes on this task. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "prompt": "<Official IELTS Task 1 prompt describing what the chart/table shows>",
  "chartSpec": {
    "chartType": "${chosenChart}",
    "title": "<Chart Header Title>",
    "unit": "%",
    "categories": ["<Cat1>", "<Cat2>", "<Cat3>", "<Cat4>"],
    "series": [
      { "name": "<Group 1>", "values": [45, 52, 61, 70] },
      { "name": "<Group 2>", "values": [30, 38, 42, 49] },
      { "name": "<Group 3>", "values": [25, 20, 18, 14] }
    ]
  },
  "modelAnswer": "<Complete 175-word Band 8.5 model report with clear overview and accurate data comparisons>"
}`;
    } else {
      schemaInstruction = `
Generate an IELTS Academic Writing Task 2 essay workout (15-minute core argument or full essay, target 180-250 words).
Return strict JSON with this exact structure:
{
  "id": "ai-write-t2-<unique-slug>",
  "section": "writing",
  "subMode": "task2",
  "taskType": "Academic Writing Task 2 — Essay Core / Full Essay",
  "topic": "<Specific Sociological/Scientific/Policy Topic>",
  "title": "Task 2: <Concise Title>",
  "targetWords": 180,
  "instructions": "Spend about 15 minutes crafting a high-impact Academic Task 2 response (target 180–250 words). The timer is only a reminder—you may continue past 15 minutes if you wish.",
  "prompt": "<Two-sentence IELTS Academic Task 2 prompt + essay question (e.g., To what extent do you agree or disagree? / Discuss both views and give your own opinion.)>",
  "chartSpec": null,
  "modelAnswer": "<Complete 240-word Band 8.5 model essay with introduction, two analytical body paragraphs, and conclusion>"
}`;
    }
  } else if (section === 'listening') {
    schemaInstruction = `
Generate a 15-minute IELTS Academic Listening workout (Part 3 Tutorial Dialogue or Part 4 University Lecture) with 7 questions across 2 sub-tasks.
Return strict JSON with this exact structure:
{
  "id": "ai-listen-<unique-slug>",
  "section": "listening",
  "taskType": "Academic Listening + Note Completion & Multiple Choice",
  "topic": "<Specific University Research or Lecture Topic>",
  "title": "<Title of Tutorial or Lecture>",
  "instructions": "Click 'Play Academic Audio' to listen to the spoken academic script and answer Questions 1–7. Write ONE WORD AND/OR A NUMBER for Questions 1–4.",
  "script": [
    { "speaker": "Dr. Evans", "pitch": 0.92, "rate": 0.97, "text": "<2-3 natural academic sentences>" },
    { "speaker": "Maya", "pitch": 1.1, "rate": 1.0, "text": "<2-3 sentences containing specific facts/numbers>" }
  ],
  "questions": [
    {
      "id": "q1",
      "group": "Task A — Questions 1–4: Note Completion (ONE WORD AND/OR A NUMBER)",
      "type": "fill",
      "prompt": "<Note sentence with ________ blank>",
      "answer": "<exact word or number>",
      "acceptableAnswers": ["<exact word or number>"],
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q2",
      "group": "Task A — Questions 1–4: Note Completion (ONE WORD AND/OR A NUMBER)",
      "type": "fill",
      "prompt": "<Note sentence with ________ blank>",
      "answer": "<exact word or number>",
      "acceptableAnswers": ["<exact word or number>"],
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q3",
      "group": "Task A — Questions 1–4: Note Completion (ONE WORD AND/OR A NUMBER)",
      "type": "fill",
      "prompt": "<Note sentence with ________ blank>",
      "answer": "<exact word or number>",
      "acceptableAnswers": ["<exact word or number>"],
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q4",
      "group": "Task A — Questions 1–4: Note Completion (ONE WORD AND/OR A NUMBER)",
      "type": "fill",
      "prompt": "<Note sentence with ________ blank>",
      "answer": "<exact word or number>",
      "acceptableAnswers": ["<exact word or number>"],
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q5",
      "group": "Task B — Questions 5–7: Multiple Choice",
      "type": "mcq",
      "prompt": "<Question 5 stem>",
      "options": ["A) <Opt A>", "B) <Opt B>", "C) <Opt C>", "D) <Opt D>"],
      "answer": "A) <Opt A>",
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q6",
      "group": "Task B — Questions 5–7: Multiple Choice",
      "type": "mcq",
      "prompt": "<Question 6 stem>",
      "options": ["A) <Opt A>", "B) <Opt B>", "C) <Opt C>", "D) <Opt D>"],
      "answer": "C) <Opt C>",
      "explanation": "<Quote from speaker>"
    },
    {
      "id": "q7",
      "group": "Task B — Questions 5–7: Multiple Choice",
      "type": "mcq",
      "prompt": "<Question 7 stem>",
      "options": ["A) <Opt A>", "B) <Opt B>", "C) <Opt C>", "D) <Opt D>"],
      "answer": "B) <Opt B>",
      "explanation": "<Quote from speaker>"
    }
  ]
}`;
  } else {
    schemaInstruction = `
Generate a 15-minute IELTS Academic Speaking 3-Part Mock Workout.
Return strict JSON with this exact structure:
{
  "id": "ai-speak-<unique-slug>",
  "section": "speaking",
  "taskType": "Full 3-Part Speaking Mock (Part 1 + Cue Card + Part 3)",
  "topic": "<Distinctive Academic/Cultural/Behavioral Topic>",
  "title": "Speaking Workout: <Title>",
  "instructions": "Complete all 3 parts of the IELTS Speaking workout. Record your voice (or edit the transcript) for AI Band scoring across Fluency, Lexical Resource, Grammar, and Pronunciation.",
  "part1": [
    "<Question 1>",
    "<Question 2>",
    "<Question 3>"
  ],
  "part2": {
    "topic": "Describe <specific cue card prompt>.",
    "bullets": [
      "<Bullet 1>",
      "<Bullet 2>",
      "<Bullet 3>",
      "And explain <Bullet 4>."
    ]
  },
  "part3": [
    "<Abstract analytical question 1>",
    "<Abstract analytical question 2>",
    "<Abstract analytical question 3>"
  ]
}`;
  }

  const promptText = `You are a Senior Cambridge IELTS Academic Test Designer.
CRITICAL ANTI-REPETITION RULE: The candidate has already practiced the following topics and task IDs:
[${exclusionList}]
You MUST choose a completely different academic domain, subject matter, and angle so the exercise never repeats.

${schemaInstruction}`;

  const rawTask = await callGeminiJSON(apiKey, [{ text: promptText }], 0.8);
  return sanitizeGeneratedTask(rawTask, section, resolvedWritingMode);
}

/**
 * Evaluates a Writing or Speaking submission with official IELTS Band descriptors via Gemini.
 * Supports multimodal audio input for Speaking!
 */
export async function evaluateSubmissionWithGemini(apiKey, task, userSubmission, audioDataObj = null) {
  const isSpeaking = task.section === 'speaking';
  const criteriaNames = isSpeaking
    ? [
        'Fluency & Coherence',
        'Lexical Resource',
        'Grammatical Range & Accuracy',
        'Pronunciation'
      ]
    : [
        task.subMode === 'task1' ? 'Task Achievement' : 'Task Response',
        'Coherence & Cohesion',
        'Lexical Resource',
        'Grammatical Range & Accuracy'
      ];

  const systemPrompt = `You are a certified Senior IELTS Academic Examiner.
Evaluate the candidate's ${task.section.toUpperCase()} submission strictly according to the official IELTS 9-Band scale (in 0.5 band increments, e.g., 5.5, 6.0, 6.5, 7.0, 7.5, 8.0).

TASK DETAILS:
- Title: ${task.title}
- Task Type: ${task.taskType}
- Prompt / Questions: ${
    isSpeaking
      ? `Part 1: ${(task.part1 || []).join(' | ')} / Part 2 Cue Card: ${task.part2?.topic} / Part 3: ${(task.part3 || []).join(' | ')}`
      : task.prompt
  }
${task.chartSpec ? `- Chart Data: ${JSON.stringify(task.chartSpec)}` : ''}

CANDIDATE'S WRITTEN / TRANSCRIBED SUBMISSION:
"""
${userSubmission || '(Audio recording attached)'}
"""

${
  audioDataObj
    ? 'NOTE: The candidate also attached a live voice recording of their speaking response. Evaluate their actual spoken Pronunciation, intonation, pacing, and hesitation directly from the audio, alongside the text transcript.'
    : isSpeaking
    ? 'NOTE: No raw audio blob was attached; estimate Pronunciation from phonemic complexity/transcript and focus deeply on Fluency & Coherence, Lexical Resource, and Grammatical Range.'
    : ''
}

Return strict JSON with this exact schema:
{
  "overallBand": 7.0,
  "criteria": [
    { "name": "${criteriaNames[0]}", "score": 7.0, "feedback": "<Specific 1-2 sentence examiner justification>" },
    { "name": "${criteriaNames[1]}", "score": 7.0, "feedback": "<Specific 1-2 sentence examiner justification>" },
    { "name": "${criteriaNames[2]}", "score": 6.5, "feedback": "<Specific 1-2 sentence examiner justification>" },
    { "name": "${criteriaNames[3]}", "score": 7.0, "feedback": "<Specific 1-2 sentence examiner justification>" }
  ],
  "examinerSummary": "<3-4 sentences of constructive examiner feedback highlighting what worked well and the #1 priority to reach the next Band score>",
  "corrections": [
    {
      "original": "<Exact phrase or sentence from the candidate containing a grammar, collocation, or register issue>",
      "corrected": "<Band 8.5+ corrected academic version>",
      "explanation": "<Concise explanation of the grammatical or lexical rule>"
    }
  ],
  "lexicalUpgrades": [
    {
      "basic": "<Word/phrase used by candidate or relevant to topic>",
      "upgrade": "<High-band C1/C2 academic collocation>",
      "context": "<Example sentence showing natural usage>"
    }
  ],
  "modelAnswer": "<A complete Band 8.5+ model response to this exact prompt (170-230 words)>"
}`;

  const parts = [{ text: systemPrompt }];
  if (audioDataObj && audioDataObj.base64 && audioDataObj.mimeType) {
    parts.push({
      inlineData: {
        mimeType: audioDataObj.mimeType,
        data: audioDataObj.base64
      }
    });
  }

  const rawEval = await callGeminiJSON(apiKey, parts, 0.35);

  // Sanitize & normalize Band scores to official 0.5 increments
  const criteria = Array.isArray(rawEval?.criteria)
    ? rawEval.criteria.map((c, idx) => ({
        name: c.name || criteriaNames[idx] || `Criterion ${idx + 1}`,
        score: roundIeltsBand(c.score, 6.5),
        feedback: String(c.feedback || '')
      }))
    : [];

  const avgFromCriteria =
    criteria.length > 0
      ? criteria.reduce((s, c) => s + c.score, 0) / criteria.length
      : 6.5;

  return {
    overallBand: roundIeltsBand(rawEval?.overallBand, roundIeltsBand(avgFromCriteria)),
    criteria,
    examinerSummary: String(rawEval?.examinerSummary || ''),
    corrections: Array.isArray(rawEval?.corrections) ? rawEval.corrections : [],
    lexicalUpgrades: Array.isArray(rawEval?.lexicalUpgrades) ? rawEval.lexicalUpgrades : [],
    modelAnswer: String(rawEval?.modelAnswer || task.modelAnswer || '')
  };
}

const NUMBER_WORDS_MAP = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  'twenty-two': '22',
  'thirty-four': '34',
  'thirty-five': '35',
  forty: '40',
  'ninety-five': '95',
  sixteenth: '16',
  '16th': '16',
  fourteenth: '14',
  '14th': '14'
};

function normalizeAnswerToken(str) {
  let s = String(str ?? '')
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"']/g, '')
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/\s+percent$/i, '')
    .replace(/%$/, '')
    .trim();
  if (NUMBER_WORDS_MAP[s]) {
    s = NUMBER_WORDS_MAP[s];
  }
  return s;
}

function extractMultiSelectLetters(str) {
  const parts = String(str ?? '')
    .split(/[,;&/]+|\band\b/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const letters = [];
  for (const p of parts) {
    const m = p.match(/^([A-G])\b/i);
    if (m) {
      letters.push(m[1].toUpperCase());
    } else {
      letters.push(normalizeAnswerToken(p));
    }
  }
  return Array.from(new Set(letters)).sort().join(', ');
}

function isObjectiveAnswerMatch(q, rawUser) {
  if (q.type === 'mcq_multi') {
    const userMulti = extractMultiSelectLetters(rawUser);
    const ansMulti = extractMultiSelectLetters(q.answer);
    return Boolean(userMulti && ansMulti && userMulti === ansMulti);
  }

  const userNorm = normalizeAnswerToken(rawUser);
  if (!userNorm) return false;

  const validList = (q.acceptableAnswers || [q.answer]).map((a) =>
    normalizeAnswerToken(a)
  );
  if (validList.includes(userNorm)) return true;

  // Also allow matching MCQ by option letter (e.g. "B" matches "B) Installing them...")
  if (q.type === 'mcq' && q.answer) {
    const ansLetter = String(q.answer).trim().slice(0, 2).toLowerCase().replace(/[^a-g]/g, '');
    const userLetter = String(rawUser).trim().slice(0, 2).toLowerCase().replace(/[^a-g]/g, '');
    if (ansLetter && userLetter && ansLetter === userLetter && String(rawUser).trim().length <= 3) {
      return true;
    }
  }
  return false;
}

/**
 * Evaluates Reading & Listening objectively, and provides a smart heuristic grader
 * for Writing & Speaking when no Gemini API key is configured.
 */
export function evaluateSubmissionLocally(task, userSubmission) {
  if (task.section === 'reading' || task.section === 'listening') {
    const answersMap = userSubmission && typeof userSubmission === 'object' ? userSubmission : {};
    let correctCount = 0;
    const questions = task.questions || [];
    const total = questions.length;
    const questionResults = [];

    for (const q of questions) {
      const rawUser = String(answersMap[q.id] || '').trim();
      const isCorrect = isObjectiveAnswerMatch(q, rawUser);
      if (isCorrect) correctCount++;
      questionResults.push({
        id: q.id,
        prompt: q.prompt,
        userAnswer: rawUser || '(No answer)',
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      });
    }

    // Convert ratio to realistic IELTS Academic Band (0.0 to 9.0 in 0.5 increments)
    const ratio = total > 0 ? correctCount / total : 0;
    let band = 4.0;
    if (ratio >= 0.95) band = 9.0;
    else if (ratio >= 0.85) band = 8.0;
    else if (ratio >= 0.71) band = 7.0;
    else if (ratio >= 0.57) band = 6.5;
    else if (ratio >= 0.42) band = 5.5;
    else if (ratio >= 0.28) band = 5.0;
    else if (ratio > 0) band = 4.5;
    else band = 0.0;

    const tfngQs = questionResults.filter((_, i) => i < 4);
    const compQs = questionResults.filter((_, i) => i >= 4);
    const tfngScore = tfngQs.length
      ? roundIeltsBand((tfngQs.filter((x) => x.isCorrect).length / tfngQs.length) * 9)
      : band;
    const compScore = compQs.length
      ? roundIeltsBand((compQs.filter((x) => x.isCorrect).length / compQs.length) * 9)
      : band;

    return {
      overallBand: band,
      rawScoreText: `${correctCount} / ${total} Correct`,
      questionResults,
      criteria: [
        {
          name: 'Overall Accuracy',
          score: band,
          feedback: `You answered ${correctCount} out of ${total} questions accurately.`
        },
        {
          name: 'Task A (Questions 1–4)',
          score: tfngScore,
          feedback: `${tfngQs.filter((x) => x.isCorrect).length}/${tfngQs.length} accurate on the first question set.`
        },
        {
          name: 'Task B (Questions 5–7)',
          score: compScore,
          feedback: `${compQs.filter((x) => x.isCorrect).length}/${compQs.length} accurate on completion & multiple choice.`
        },
        {
          name: 'Exam Pacing & Detail',
          score: band,
          feedback: 'Review the highlighted evidence below for every question.'
        }
      ],
      examinerSummary:
        correctCount === total
          ? 'Outstanding precision! You identified both explicit lexical cues and subtle paraphrases without falling for distractors.'
          : `You scored ${correctCount}/${total} (Estimated IELTS Band ${band.toFixed(
              1
            )}). Check the red cards below to compare your answers against the exact passage/transcript evidence.`,
      corrections: questionResults
        .filter((r) => !r.isCorrect)
        .map((r) => ({
          original: `Your answer: "${r.userAnswer}"`,
          corrected: `Correct answer: "${r.correctAnswer}"`,
          explanation: r.explanation
        })),
      lexicalUpgrades: [],
      modelAnswer:
        task.section === 'listening'
          ? (task.script || []).map((s) => `${s.speaker}: ${s.text}`).join('\n\n')
          : 'Review the annotated explanations under each question in the right-hand pane.'
    };
  }

  // Heuristic Local Assessment for Writing & Speaking when API key is not yet entered
  const text = String(userSubmission || '').trim();
  const words = text ? text.split(/\s+/) : [];
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : 0;
  const longWords = words.filter((w) => w.replace(/[^a-zA-Z]/g, '').length >= 7).length;
  const lexicalDensity = wordCount > 0 ? longWords / wordCount : 0;

  const target = task.targetWords || 150;
  let taskScore = 6.0;
  if (wordCount >= target) taskScore = 7.0;
  else if (wordCount >= target * 0.75) taskScore = 6.0;
  else if (wordCount >= 50) taskScore = 5.0;
  else taskScore = 4.0;

  const coherenceScore = sentences.length >= 5 && avgWordsPerSentence >= 12 ? 7.0 : 6.0;
  const lexScore = lexicalDensity >= 0.26 ? 7.5 : lexicalDensity >= 0.2 ? 6.5 : 5.5;
  const gramScore = avgWordsPerSentence >= 14 && avgWordsPerSentence <= 28 ? 7.0 : 6.0;

  const rawAvg = (taskScore + coherenceScore + lexScore + gramScore) / 4;
  const overallBand = roundIeltsBand(rawAvg, 6.0);

  const isSpeaking = task.section === 'speaking';

  return {
    overallBand,
    isHeuristicFallback: true,
    criteria: [
      {
        name: isSpeaking ? 'Fluency & Coherence' : task.subMode === 'task1' ? 'Task Achievement' : 'Task Response',
        score: taskScore,
        feedback: `Submitted ${wordCount} words (recommended minimum: ${target} words).`
      },
      {
        name: isSpeaking ? 'Lexical Resource' : 'Coherence & Cohesion',
        score: coherenceScore,
        feedback: `Structured across ${sentences.length} sentences (avg ${avgWordsPerSentence.toFixed(1)} words/sentence).`
      },
      {
        name: isSpeaking ? 'Grammatical Range' : 'Lexical Resource',
        score: lexScore,
        feedback: `Academic vocabulary density: ${(lexicalDensity * 100).toFixed(0)}% complex words.`
      },
      {
        name: isSpeaking ? 'Pronunciation (Est.)' : 'Grammatical Range & Accuracy',
        score: gramScore,
        feedback: 'Connect your free Google Gemini API key in Settings for deep line-by-line AI corrections.'
      }
    ],
    examinerSummary: `Estimated Band ${overallBand.toFixed(
      1
    )} (Local Heuristic Grader — ${wordCount} words). Tip: Click "Re-Evaluate with Gemini AI" above to unlock line-by-line grammar corrections and multimodal voice grading!`,
    corrections: [
      {
        original: `Word count check: ${wordCount} words submitted`,
        corrected:
          wordCount >= target
            ? `Target met (${wordCount}/${target}+ words)`
            : `Aim for at least ${target} words to avoid an under-length penalty in Task Achievement`,
        explanation:
          'IELTS examiners penalize responses that do not fully develop key overview comparisons (Task 1) or analytical body paragraphs (Task 2).'
      }
    ],
    lexicalUpgrades: [
      {
        basic: 'shows / tells us',
        upgrade: 'illustrates / delineates / reveals a marked disparity',
        context: 'The grouped chart delineates a marked disparity in heating sources across the three capitals.'
      },
      {
        basic: 'went up a lot',
        upgrade: 'experienced a pronounced upward trajectory / surged substantially',
        context: 'Water reclamation rates in South Korea experienced a pronounced upward trajectory after 2016.'
      }
    ],
    modelAnswer:
      task.modelAnswer ||
      'Connect your Gemini API key in Settings to generate a customized Band 8.5 model rewrite of your exact arguments.'
  };
}

// ==========================================================================
// GEMINI NEURAL MULTI-SPEAKER TTS ENGINE + INDEXEDDB WAV AUDIO CACHE (FREE)
// ==========================================================================

const memoryAudioUrlCache = new Map();
const IDB_NAME = 'ielts15_audio_cache_db_v1';
const IDB_STORE = 'audio_blobs';

function openAudioCacheDB() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

export async function getCachedListeningAudioUrl(taskId) {
  if (!taskId) return null;
  if (memoryAudioUrlCache.has(taskId)) {
    return memoryAudioUrlCache.get(taskId);
  }
  try {
    const db = await openAudioCacheDB();
    if (!db) return null;
    const blob = await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(taskId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
    if (blob instanceof Blob) {
      const url = URL.createObjectURL(blob);
      memoryAudioUrlCache.set(taskId, url);
      return url;
    }
  } catch (e) {
    // ignore cache read errors
  }
  return null;
}

async function saveListeningAudioBlobToCache(taskId, blob) {
  if (!taskId || !(blob instanceof Blob)) return;
  try {
    const db = await openAudioCacheDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(blob, taskId);
  } catch (e) {
    // ignore cache write errors
  }
}

function pcmBase64ToWavBlob(base64Data, mimeType = 'audio/L16;rate=24000') {
  const binaryStr = atob(base64Data);
  const pcmLen = binaryStr.length;
  const pcmBytes = new Uint8Array(pcmLen);
  for (let i = 0; i < pcmLen; i++) {
    pcmBytes[i] = binaryStr.charCodeAt(i);
  }

  // If the returned bytes already start with "RIFF" (WAV) or "ID3"/MP3, wrap directly
  if (
    pcmLen > 12 &&
    pcmBytes[0] === 0x52 &&
    pcmBytes[1] === 0x49 &&
    pcmBytes[2] === 0x46 &&
    pcmBytes[3] === 0x46
  ) {
    return new Blob([pcmBytes], { type: 'audio/wav' });
  }

  const rateMatch = String(mimeType).match(/rate=(\d+)/i);
  const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const wavBuffer = new ArrayBuffer(44 + pcmLen);
  const view = new DataView(wavBuffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmLen, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLen, true);

  new Uint8Array(wavBuffer, 44).set(pcmBytes);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

async function discoverTtsModels(apiKey) {
  const candidates = [
    'gemini-2.5-flash-preview-tts',
    'gemini-2.5-pro-preview-tts'
  ];
  try {
    const resp = await fetch(`${GEMINI_BASE_URL}/models?key=${encodeURIComponent(apiKey)}`);
    if (resp.ok) {
      const data = await resp.json();
      const ttsModels = (data.models || [])
        .map((m) => String(m.name || '').replace(/^models\//, ''))
        .filter((name) => /tts/i.test(name));
      for (const m of ttsModels) {
        if (!candidates.includes(m)) candidates.unshift(m);
      }
    }
  } catch (e) {
    // ignore
  }
  return candidates;
}

/**
 * Generates high-realism multi-speaker studio audio using the user's free Gemini API key,
 * converts raw 24kHz PCM to a playable WAV Blob with full scrubber support, and caches in IndexedDB.
 */
export async function synthesizeListeningAudioWithGemini(apiKey, task) {
  if (!apiKey) {
    throw new Error('Please connect your free Google Gemini API key in Settings first.');
  }
  const cached = await getCachedListeningAudioUrl(task.id);
  if (cached) return cached;

  const lines = task.script || [];
  if (!lines.length) {
    throw new Error('No listening script found for this task.');
  }

  // Map speakers to 2 distinct studio voices (SpeakerA = Kore, SpeakerB = Puck) for multiSpeakerVoiceConfig
  const uniqueSpeakers = Array.from(new Set(lines.map((l) => l.speaker)));
  const isMultiSpeaker = uniqueSpeakers.length >= 2;

  let promptText = '';
  let speechConfig = null;

  if (isMultiSpeaker) {
    const speakerRoleMap = new Map();
    uniqueSpeakers.forEach((sp, idx) => {
      speakerRoleMap.set(sp, idx % 2 === 0 ? 'SpeakerA' : 'SpeakerB');
    });

    const formattedDialogue = lines
      .map((l) => `${speakerRoleMap.get(l.speaker)}: ${l.text}`)
      .join('\n\n');

    promptText = `Read the following IELTS Academic Listening conversation naturally at a clear, measured university pace with realistic pauses between turns:\n\n${formattedDialogue}`;
    speechConfig = {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          {
            speaker: 'SpeakerA',
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          {
            speaker: 'SpeakerB',
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        ]
      }
    };
  } else {
    const formattedMonologue = lines.map((l) => l.text).join('\n\n');
    promptText = `Read the following IELTS Academic Listening university lecture clearly and naturally with measured pauses between paragraphs:\n\n${formattedMonologue}`;
    speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: 'Charon' }
      }
    };
  }

  const ttsModels = await discoverTtsModels(apiKey);
  let lastErr = null;

  for (const modelName of ttsModels) {
    try {
      const resp = await fetch(
        `${GEMINI_BASE_URL}/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig
            }
          })
        }
      );

      if (!resp.ok) {
        const errTxt = await resp.text().catch(() => '');
        lastErr = new Error(`Gemini TTS (${modelName}) HTTP ${resp.status}: ${errTxt.slice(0, 180)}`);
        continue;
      }

      const data = await resp.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find((p) => p.inlineData && p.inlineData.data);
      if (!audioPart) {
        lastErr = new Error(`Gemini TTS (${modelName}) returned no audio data.`);
        continue;
      }

      const wavBlob = pcmBase64ToWavBlob(
        audioPart.inlineData.data,
        audioPart.inlineData.mimeType
      );
      await saveListeningAudioBlobToCache(task.id, wavBlob);
      const url = URL.createObjectURL(wavBlob);
      memoryAudioUrlCache.set(task.id, url);
      return url;
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Gemini TTS audio generation failed.');
}

