# StartSmall

**Main Aim:** Help procrastinating students cross the first 60 seconds of a study session. Instead of dropping users straight into a timer, StartSmall shrinks an overwhelming task into one concrete, sub-2-minute physical action followed by a focused 5-minute sprint.

Built for the **Flagsmith Toggle Wars Hackathon (Track 01: Test Something Real)**.

---

## What It Does (5-Stage Flow)

1. **Landing (`/`)** — Explains the initiation gap, psychology behind starting small, and interactive 3D feature cards.
2. **Stage 1 · Task Entry (`/task`)** — Enter the avoided task and pick a category.
3. **Stage 2 · Start Experience (`/start`)** — Flagsmith A/B split between a plain timer (`control`) and AI-personalized micro-steps + memory icebreaker (`guided`), plus a soundscape picker.
4. **Stage 3 · Focus Sprint (`/focus`)** — 5-minute countdown timer with optional fullscreen lock and live Web Audio API soundscapes (`brown_noise`, `lofi`, `binaural`, or `off`).
5. **Stage 4–5 · Check-in & Completion (`/feedback`, `/complete`)** — Logs reflection to on-device memory and updates session count and streak.

---

## How Flagsmith Is Used

All 5 core capabilities are controlled by live Flagsmith flags (defined in `src/flagsmith/flags.js`):

| Flag Key | Type | Purpose |
| :--- | :--- | :--- |
| `study_start_flow` | Multivariate (50/50) | **A/B Experiment** (`study_start_activation_experiment`): tests `control` vs. `guided` micro-steps on session activation. |
| `ai_microsteps` | Boolean | Enables Groq LLM (`openai/gpt-oss-20b`) micro-step generation with automatic fallback to static templates. |
| `memory_enabled` | Boolean | Uses the last 20 `localStorage` sessions to generate a personalized psychological icebreaker. |
| `fullscreen_focus` | Boolean | Automatically enters fullscreen when the 5-minute timer starts. |
| `study_music` | Multivariate | Sets the default Web Audio API focus soundscape (`off`, `brown_noise`, `lofi`, `binaural`). |

### Experimentation & Privacy Integrity
- **Anonymous Identity:** Each browser gets a persistent UUID (`startsmall_user_id` in `localStorage`) — no login required.
- **Clean Exposure:** Experiment exposure is recorded only when `StartExperiencePage` renders (`useExperiment('study_start_flow')`).
- **Metrics & Deduplication:** Tracks `focus_session_started` (primary) and `focus_session_completed` (secondary), deduplicated per session in `localStorage`.
- **Zero PII Sent:** Task text and reflection notes stay strictly in browser `localStorage`/`sessionStorage` and are never sent to Flagsmith.
- **Graceful Fallback:** If Flagsmith is unconfigured or times out, the app falls back to the control UI without enrolling the user.

---

## How It Was Built

- **Frontend:** React 18, Vite 6, Tailwind CSS, Framer Motion, React Router v6
- **Feature Flags & A/B Testing:** `@flagsmith/flagsmith`
- **AI Micro-Steps:** Groq Chat Completions API (`src/services/aiService.js`, structured prompt templates in `src/prompts/templates.js`)
- **Audio Engine:** Pure Web Audio API synthesis (`src/services/musicService.js`) — zero external audio dependencies
- **Persistence:** `localStorage` & `sessionStorage` only (no backend/database)

### Repository Structure
```text
src/
├── pages/        # Landing + 5-stage focus flow screens
├── components/   # Timer, 3D cards/cube, SVG illustrations, form inputs
├── flagsmith/    # Client init, flag keys, experiment config
├── services/     # Groq AI, Web Audio music, local memory, analytics
├── prompts/      # Prompt templates & builder
├── hooks/        # Timer, music, fullscreen, anonymous identity
└── context/      # Session & experiment state
```

---

## Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and add your keys:
   ```env
   VITE_FLAGSMITH_ENVIRONMENT_KEY=your_flagsmith_client_side_environment_key
   VITE_GROK_API_KEY=your_groq_api_key_optional
   ```
   > Never put a Flagsmith server-side key in `VITE_*` variables. If `VITE_GROK_API_KEY` is omitted, micro-steps fall back to curated category templates.

3. **Start dev server / build:**
   ```bash
   npm run dev
   npm run build
   ```
