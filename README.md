# IELTS Academic 15 — Daily 15-Minute Focus Studio & AI Examiner

A distraction-free **IELTS Academic** daily practice web application designed around a **15-minute high-focus workout** across all 4 official sections (**Reading, Writing, Listening, Speaking**), with a **non-repeating task history** and **IELTS Band 0–9 evaluation & corrections**.

---

## Key Features

1. **Non-Blocking 15:00 Reminder Timer**:
   - Counts down from `15:00` to `00:00` to keep your daily session focused.
   - **Never cuts you off or auto-submits**: once `15:00` is reached, the timer smoothly switches into **Overtime Mode (`+00:01`, `+00:02`...)** with a gentle reminder banner so you can finish your essay, reading, or speaking response at your own pace.
   - Logs total elapsed time (`within 15m` or `+mm:ss over 15m`) in your session history.

2. **All 4 IELTS Academic Sections Adapted for 15 Minutes (52 Built-In Workouts + Infinite AI Generator)**:
   - **Reading (13 Built-In Workouts)**: Dense C1/C2 academic passages (labeled paragraphs `A–D`) with interactive non-overlapping text highlighter + **2 sub-tasks (7 questions)** covering *True / False / Not Given*, *Yes / No / Not Given (Writer's Claims)*, *Matching Paragraph Information (`A–D`)*, *One-Word Sentence/Summary Completion*, and *Multiple Choice*.
   - **Writing (13 Built-In Workouts)**:
     - *Task 1 Sprint (150+ words)*: Dynamic SVG **Bar Charts**, **Line Graphs**, **Data Tables**, **100% Stacked Proportional Charts**, and **Multi-Stage Process / Cycle Diagrams**, each paired with a Band 8.5–9.0 model report.
     - *Task 2 Essay Core / Full Essay (180–250+ words)*: Opinion, Discussion, Two-Part Question, and Outweigh prompts with live word & sentence counters and Band 9.0 model essays.
   - **Listening (13 Built-In Workouts)**: Multi-speaker academic tutorial (Part 3) or university lecture (Part 4) played via multi-voice Web Speech synthesis (`0.9x`, `1.0x`, `1.1x` speed controls) with live transcript line tracking, persistent scratchpad, and **2 sub-tasks** (*Note/Form Completion* + *Multiple Choice*).
   - **Speaking (13 Built-In Workouts)**: Full 3-Part mock (*Part 1 Interview*, *Part 2 Cue Card* with 1-minute prep timer, *Part 3 Abstract Discussion*) with Examiner TTS readout and **Microphone Voice Recording + Continuous Live Speech-to-Text**.

3. **Zero-Repetition History Engine + Infinite Gemini AI Examiner**:
   - Tracks every completed task ID and topic in `localStorage` (`ielts15_history_v1` & `ielts15_seen_ids_v1`) so completed exercises never repeat.
   - Connects directly to the **Google Gemini API (`gemini-3.8-flash` with automatic `/v1beta/models` fallback discovery)** to generate brand-new, unseen IELTS Academic tasks (passing your full exclusion list to prevent topic repetition) and grade your Writing & Speaking (including raw recorded audio for Pronunciation!) on the official 0.0–9.0 (0.5 increment) IELTS Band scale.
   - Includes **JSON History Export & Import** so you can back up or transfer your history across devices.

