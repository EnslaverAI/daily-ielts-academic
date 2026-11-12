# IELTS Academic 15 — Daily 15-Minute Focus Studio & AI Examiner

A distraction-free **IELTS Academic** daily practice web application designed around a **15-minute high-focus workout** across all 4 official sections (**Reading, Writing, Listening, Speaking**), with a **non-repeating task history** and **IELTS Band 0–9 evaluation & corrections**.

---

## Key Features

1. **Non-Blocking 15:00 Reminder Timer**:
   - Counts down from `15:00` to `00:00` to keep your daily session focused.
   - **Never cuts you off or auto-submits**: once `15:00` is reached, the timer smoothly switches into **Overtime Mode (`+00:01`, `+00:02`...)** with a gentle reminder banner so you can finish your essay, reading, or speaking response at your own pace.
   - Logs total elapsed time (`within 15m` or `+mm:ss over 15m`) in your session history.

2. **All 4 IELTS Academic Sections & 100% of Official Task Modes (68 Built-In Workouts + Infinite AI Generator)**:
   - **Reading (17 Built-In Workouts)**: Dense C1/C2 academic passages (`A–D`) with interactive non-overlapping text highlighter + **all official IELTS Reading question formats**: *True / False / Not Given*, *Yes / No / Not Given (Writer's Claims)*, *Matching Headings (`i–vi`)*, *Matching Paragraph Information (`A–D`)*, *Matching Researchers / Statements (`A–D`)*, *Matching Sentence Endings (`A–F`)*, *Summary Completion with a Word Bank*, *One-Word Completion*, and *Multiple Choice (Single & "Choose TWO" `A–E`)*.
   - **Writing (17 Built-In Workouts)**:
     - *Task 1 Sprint (150+ words)*: Dynamic SVG **Bar Charts**, **Line Graphs**, **Data Tables**, **100% Stacked Proportional Charts**, **Multi-Stage Process / Cycle Diagrams**, **Before & After Map Comparisons**, and **Mixed Pie + Bar Combo Charts**, each paired with a Band 8.5–9.0 model report.
     - *Task 2 Essay Core / Full Essay (180–250+ words)*: Opinion, Discussion, Outweigh, Problem/Solution, and Direct Two-Part Question prompts with live word & sentence counters and Band 9.0 model essays.
   - **Listening (17 Built-In Workouts + Dual Free Audio Studio)**:
     - Covers **Part 1** (*Transactional Dialogues with Spelling, Postcodes, Numbers & Self-Correction Distractors*), **Part 2** (*Campus & Archaeological Site Orientations with Interactive SVG Floor Plan Map Labeling `A–G`*), **Part 3** (*Multi-Speaker Academic Tutorials with Classification `A–C` & Choose TWO*), and **Part 4** (*University Lectures*).
     - **Dual Free Audio Engine**: Generate lifelike **Gemini Multi-Speaker Neural Studio Audio (`Kore`, `Puck`, `Charon`)** with a full `<audio>` timeline scrubber, `-5s / +5s` skip buttons, and local `IndexedDB` caching (100% free with your Gemini API key), OR use the **Enhanced Multi-Accent Browser Voice Player (`en-GB`, `en-AU`, `en-US`)** with turn skipping, clickable transcript lines, and **Strict Exam Mode (`1 Play Only • Hide Transcript`)**.
   - **Speaking (17 Built-In Workouts + Real Exam Blind Mode)**:
     - Full 3-Part mock (*Part 1 Interview*, *Part 2 Cue Card* with 1-minute prep timer, *Part 3 Abstract Discussion*) with **Microphone Voice Recording + Continuous Live Speech-to-Text** and an optional **Real Exam Blind Mode (Turn-by-Turn Audio)** where Part 1 & Part 3 written prompts are hidden until the Examiner reads each one aloud.


3. **Zero-Repetition History Engine + Infinite Gemini AI Examiner**:
   - Tracks every completed task ID and topic in `localStorage` (`ielts15_history_v1` & `ielts15_seen_ids_v1`) so completed exercises never repeat.
   - Connects directly to the **Google Gemini API (`gemini-3.8-flash` with automatic `/v1beta/models` fallback discovery)** to generate brand-new, unseen IELTS Academic tasks (passing your full exclusion list to prevent topic repetition) and grade your Writing & Speaking (including raw recorded audio for Pronunciation!) on the official 0.0–9.0 (0.5 increment) IELTS Band scale.
   - Includes **JSON History Export & Import** so you can back up or transfer your history across devices.

