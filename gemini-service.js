// ==========================================================================
// DAILY IELTS ACADEMIC 15 — GEMINI AI GENERATOR & EXAMINER GRADING ENGINE
// ==========================================================================

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

async function callGeminiJSON(apiKey, parts, temperature = 0.7) {
  let lastError = null;
  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    try {
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
        lastError = new Error(`Gemini API (${model}) HTTP ${res.status}: ${errText}`);
        continue;
      }
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!rawText) {
        lastError = new Error('Empty response from Gemini API.');
        continue;
      }
      return JSON.parse(rawText);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to connect to Gemini API.');
}

/**
 * Generates a brand-new, non-repeating 15-minute IELTS Academic task via Gemini.
 */
export async function generateFreshTaskWithGemini(apiKey, section, subMode, excludedTopics) {
  const exclusionList =
    excludedTopics && excludedTopics.length > 0
      ? excludedTopics.join('; ')
      : 'None yet';

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
    // q2, q3, q4 also type "tfng" (ensure a mix of TRUE, FALSE, and NOT GIVEN)
    // q5, q6 type "fill" (ONE WORD ONLY taken directly from the passage, include "answer" and "acceptableAnswers": ["word"])
    // q7 type "mcq" with 4 options ["A) ...", "B) ...", "C) ...", "D) ..."] and "answer" matching the exact winning option string
  ]
}`;
  } else if (section === 'writing') {
    const mode = subMode === 'task1' ? 'task1' : 'task2';
    if (mode === 'task1') {
      schemaInstruction = `
Generate an IELTS Academic Writing Task 1 data report workout (15-minute sprint, target 150 words).
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
    "chartType": "bar", // or "line" or "table"
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
    // 7 to 9 spoken turns total, rich in academic detail and distractors
  ],
  "questions": [
    // q1, q2, q3, q4: type "fill", group "Task A — Questions 1–4: Note Completion (ONE WORD AND/OR A NUMBER)", with "prompt", "answer", "acceptableAnswers": ["..."], "explanation"
    // q5, q6, q7: type "mcq", group "Task B — Questions 5–7: Multiple Choice", with 4 options ["A) ...", "B) ...", "C) ...", "D) ..."], "answer" matching exact option string, "explanation"
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

  return await callGeminiJSON(apiKey, [{ text: promptText }], 0.8);
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

  return await callGeminiJSON(apiKey, parts, 0.35);
}

/**
 * Evaluates Reading & Listening objectively, and provides a smart heuristic grader
 * for Writing & Speaking when no Gemini API key is configured.
 */
export function evaluateSubmissionLocally(task, userSubmission) {
  if (task.section === 'reading' || task.section === 'listening') {
    const answersMap = userSubmission || {};
    let correctCount = 0;
    const total = (task.questions || []).length;
    const questionResults = [];

    for (const q of task.questions || []) {
      const rawUser = String(answersMap[q.id] || '').trim();
      const normUser = rawUser.toLowerCase().replace(/[.,!?;:]/g, '').trim();
      const validList = (q.acceptableAnswers || [q.answer]).map((a) =>
        String(a).toLowerCase().replace(/[.,!?;:]/g, '').trim()
      );
      const isCorrect = normUser.length > 0 && validList.includes(normUser);
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
    else if (ratio >= 0.72) band = 7.0;
    else if (ratio >= 0.57) band = 6.5;
    else if (ratio >= 0.42) band = 5.5;
    else if (ratio >= 0.28) band = 5.0;
    else if (ratio > 0) band = 4.5;
    else band = 0.0;

    const tfngQs = questionResults.filter((_, i) => i < 4);
    const compQs = questionResults.filter((_, i) => i >= 4);
    const tfngScore = tfngQs.length
      ? Math.round((tfngQs.filter((x) => x.isCorrect).length / tfngQs.length) * 9 * 2) / 2
      : band;
    const compScore = compQs.length
      ? Math.round((compQs.filter((x) => x.isCorrect).length / compQs.length) * 9 * 2) / 2
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
  const overallBand = Math.round(rawAvg * 2) / 2;

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
    )} (Local Heuristic Grader — ${wordCount} words). Tip: Click "API Key & Settings" in the top bar and paste a free Google Gemini API key to unlock line-by-line grammar corrections and multimodal voice grading!`,
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
