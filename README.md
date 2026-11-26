# InterviewAce — AI Mock Interview Preparation Platform

> **Final-Year College Major Project**  
> An AI-powered mock interview web application built with **React 19**, **Vite**, **Tailwind CSS v4**, **React Router DOM v7**, **Zustand**, and modern **Web Browser APIs**.

---

## 🌟 Overview

**InterviewAce** is an interactive, client-first web platform designed to help college students and early-career software engineers prepare for placement interviews. Candidates practice in a realistic video-call environment with an animated AI interviewer ("Ace"), answering technical, HR, and behavioral questions through speech or text, and receive immediate deterministic scorecards with actionable benchmark feedback.

The application operates **100% frontend-only** using browser Web APIs (`SpeechSynthesis`, `SpeechRecognition`, and `navigator.mediaDevices.getUserMedia`) and persistent `localStorage`, eliminating the need for expensive external AI API keys or dedicated backend servers.

---

## 🎨 Design System: White & Emerald Light Theme

InterviewAce follows a clean, light, accessible aesthetic:

| Token | Hex Value | Usage |
|---|---|---|
| **App Canvas Background** | `#F8FAFC` | Page body and root container |
| **Card & Surface Background** | `#FFFFFF` | Cards, modal dialogs, and navigation bars |
| **Primary Accent** | `#059669` | Buttons, active navigation pills, primary actions |
| **Secondary Accent** | `#10B981` | Success indicators, radial progress fills, badges |
| **Light Tint** | `#ECFDF5` | Tag chips, callout cards, avatar containers |
| **Border Emerald** | `#A7F3D0` | Highlighted borders, selected options |
| **Border Slate** | `#E2E8F0` / `#F1F5F9` | Neutral dividers and subtle cards |
| **Primary Text** | `#0F172A` / `#1E293B` | High-contrast readable typography |
| **Muted Text** | `#64748B` | Subtitles, labels, hints, and timestamps |

---

## 🚀 Key Features

### 1. 🎤 Realistic AI Interview Simulation
- **Animated AI Interviewer ("Ace")**: Dynamic SVG avatar with speaking waves, blinking animations, and responsive state transitions (`IDLE`, `AI_SPEAKING`, `USER_LISTENING`, `PROCESSING`).
- **Web Speech Synthesis**: Reads questions aloud using native browser speech synthesis with adjustable rate and pitch controls.
- **Voice-to-Text & Fallback Input**: Built-in speech recognition transcribes candidate voice responses in real time. Candidates can also type directly in the response workspace.
- **Candidate Webcam Feed**: Live camera preview with status indicators and hardware device readiness checking.

### 2. 🛡️ Tab-Switch Proctoring Alerts
- Detects `visibilitychange` events when candidates switch browser tabs or minimize the window during an active interview session, maintaining interview integrity.

### 3. 📊 Instant Deterministic Scoring & Detailed Feedback
- Evaluates candidate responses against keyword coverage, depth, and clarity without external API latency.
- Generates a full performance report with:
  - Overall readiness percentage and SVG radial gauge.
  - 5-dimension competency breakdown (Technical Accuracy, Problem Solving, Communication, Answer Completeness, Architecture).
  - Key demonstrated strengths and actionable improvement tips.
  - Per-question model benchmark answers with AI pro-tips.

### 4. 🗂️ Complete Session History & Data Portability
- Review past mock interview sessions with search, multi-criteria filtering (role, difficulty, track, score tier), and sorting.
- Drill down into any individual session to inspect exact submitted answers alongside model benchmark responses.
- One-click JSON backup export and data reset controls.

### 5. 👤 Personalized Candidate Profile & Settings
- Customizable target career tracks (Frontend, Backend, SDE-1, Full Stack MERN, Data Analyst, HR).
- Interactive skill chip manager and placement goal summary.
- Voice preference toggles and interview parameter defaults.

---

## 👥 5-Member Team Architecture & Work Breakdown

Developed collaboratively by 5 final-year engineering students:

| Member | Primary Ownership | Key Deliverables & Files |
|---|---|---|
| **Member 1 (Architect)** | Core Architecture, State & Routing | `App.jsx`, `useAuthStore.js`, `useInterviewStore.js`, `interviewService.js`, `formatters.js`, `ErrorBoundary.jsx`, `MainLayout.jsx` |
| **Member 2 (UI/UX)** | Public Experience & Authentication | `LandingPage.jsx`, `LoginPage.jsx`, `SignupPage.jsx`, `PublicNavbar.jsx`, `Footer.jsx`, `AboutPage.jsx` |
| **Member 3 (Dashboard)** | Dashboard, Setup & Question Engine | `DashboardPage.jsx`, `InterviewSetupPage.jsx`, `questions.js`, `HistoryPage.jsx` |
| **Member 4 (Media)** | Audio/Video Hardware & Interview Room | `DeviceCheckPage.jsx`, `InterviewRoomPage.jsx`, `AiAvatar.jsx`, `useSpeech.js`, `CodePad.jsx`, `VideoFeed.jsx` |
| **Member 5 (Reporting)** | Analytics, Evaluation & Settings | `FeedbackReportPage.jsx`, `InterviewDetailPage.jsx`, `ProfilePage.jsx`, `SettingsPage.jsx`, `ScoreRadial.jsx` |

---

## 🗺️ Application Routing Table (14 Pages)

### Public Routes
- `/` — **Landing Page**: Two-column hero with interactive live meeting preview, 6 feature cards, 4-step workflow, specialized tracks, and FAQ accordion.
- `/login` — **Sign In**: Split-screen authentication with email/password form, validation, and 1-Click Demo Login.
- `/signup` — **Sign Up**: Split-screen registration with role selection and 1-Click Demo Login.
- `/about` — **About & Team**: Project motivation, tech stack breakdown, and 5-member team profiles.

### Protected Student Dashboard Routes (Wrapped in `ProtectedRoute` and `MainLayout`)
- `/dashboard` — **Dashboard**: Welcome banner, 4 dynamic stat cards, quick track launch, Recharts score progression chart, and recent sessions.
- `/setup` (or `/interview/new`) — **Interview Setup**: Multi-step configuration (Role, Track, Difficulty, Questions count, Tech stack chips, Resume upload preview).
- `/device-check` — **Device Readiness**: Camera feed preview, microphone volume level meter, audio test playback, and readiness checklist.
- `/interview/:sessionId` — **Live Interview Room**: Full-screen distraction-free meeting with AI avatar, candidate webcam, question playback, live transcription, code pad, proctoring alerts, and meeting control bar.
- `/report/:sessionId` (or `/interview/:sessionId/result`) — **Feedback Report**: Score gauge, 5-dimension breakdown progress bars, strengths, improvements, question accordion, and print report action.
- `/history` — **Interview History**: Searchable, filterable table (desktop) and card list (mobile) with score badges and session actions.
- `/history/:sessionId` — **Session Details**: Deep-dive into submitted candidate answers, question scores, and benchmark answers.
- `/profile` — **Candidate Profile**: Personal information, target role, education, interactive skill chips, and placement bio.
- `/settings` — **Settings & Preferences**: Voice synthesis toggle, speech speed, default interview settings, proctoring toggle, and storage controls.

### Wildcard
- `*` — **404 Not Found**: Accessible error card with quick links back to Dashboard or Landing.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 8 with `@tailwindcss/vite`
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 with custom White & Emerald light tokens
- **State Management**: Zustand 5 with `persist` middleware
- **Data Visualizations**: Recharts 3 (`AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`)
- **Iconography**: Lucide React
- **Web APIs**: Web Speech API (`SpeechSynthesis`, `webkitSpeechRecognition` / `SpeechRecognition`), `navigator.mediaDevices.getUserMedia`
- **Storage**: Browser `localStorage` (Zero external database required)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Launch

1. **Clone or open the repository**:
   ```bash
   cd InterviewAce-Major-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Verify production build**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access (1-Click Login)

The platform provides a **1-Click Demo Login** button on the Login and Signup screens:
- **Default Account**: Alex Johnson (`alex.johnson@example.com`)
- **Target Role**: Frontend Developer / SDE-1
- **Pre-seeded Records**: 4 completed mock interview sessions across Technical, System Design, and Behavioral tracks.

---

## 📝 License & Academic Acknowledgement

Developed as a Final-Year Major Project for the Bachelor of Technology (B.Tech) in Computer Science & Engineering degree. Designed for demonstration, evaluation, and viva presentations.
