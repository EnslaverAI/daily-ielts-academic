# IELTS Academic 15 — Daily 15-Minute Focus Studio & AI Examiner

A distraction-free **IELTS Academic** daily practice web application designed around a **15-minute high-focus workout** across all 4 official sections (**Reading, Writing, Listening, Speaking**), with a **non-repeating task history** and **IELTS Band 0–9 evaluation & corrections**.

---

## Key Features

1. **Non-Blocking 15:00 Reminder Timer**:
   - Counts down from `15:00` to `00:00` to keep your daily session focused.
   - **Never cuts you off or auto-submits**: once `15:00` is reached, the timer smoothly switches into **Overtime Mode (`+00:01`, `+00:02`...)** with a gentle reminder banner so you can finish your essay, reading, or speaking response at your own pace.
   - Logs total elapsed time (`within 15m` or `+mm:ss over 15m`) in your session history.

2. **All 4 IELTS Academic Sections Adapted for 15 Minutes**:
   - **Reading**: Dense C1/C2 academic passage (labeled paragraphs `A–D`) with interactive yellow text highlighter + **2 sub-tasks** (*Task A: True / False / Not Given*, *Task B: One-Word Sentence Completion & Multiple Choice*).
   - **Writing**:
     - *Task 1 Sprint (150+ words)*: Dynamic SVG Bar Charts, Line Graphs, and Data Tables.
     - *Task 2 Essay Core / Full Essay (180–250+ words)*: Academic essay prompts with live word & sentence counters.
   - **Listening**: Multi-speaker academic tutorial (Part 3) or university lecture (Part 4) played via multi-voice Web Speech synthesis (`0.9x`, `1.0x`, `1.1x` speed controls), interactive listening scratchpad, and **2 sub-tasks** (*Note Completion* + *Multiple Choice*).
   - **Speaking**: Full 3-Part mock (*Part 1 Interview*, *Part 2 Cue Card* with 1-minute prep timer, *Part 3 Abstract Discussion*) with Examiner TTS readout and **Microphone Voice Recording + Live Speech-to-Text**.

3. **Zero-Repetition History Engine + Infinite Gemini AI Generator**:
   - Tracks every completed task ID and topic in `localStorage` (`ielts15_history_v1` & `ielts15_seen_ids_v1`) so completed exercises never repeat.
   - Connects directly to the **Google Gemini API (`gemini-2.5-flash`)** to generate brand-new, unseen IELTS Academic tasks (passing your full exclusion list to prevent topic repetition) and grade your Writing & Speaking (including raw recorded audio for Pronunciation!) on the official 0–9 IELTS Band scale.
   - Includes **JSON History Export & Import** so you can back up or transfer your history across devices.
