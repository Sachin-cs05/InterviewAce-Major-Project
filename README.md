# InterviewAce — AI Mock Interview Preparation Platform

> **Final-Year College Major Project**  
> An AI-powered mock interview web application built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Overview

**InterviewAce** is an interactive web platform designed to help college students and early-career software engineers prepare for placement interviews. Candidates practice in a realistic video-call environment with an animated AI interviewer ("Ace"), answering technical, HR, and behavioral questions through speech or text, and receive immediate performance scorecards with benchmark feedback.

The project is structured with an independent client and server architecture:
- **Frontend**: Client-first React application with responsive White & Emerald UI, local question banks, deterministic scoring, and browser Web Speech APIs.
- **Backend (Phase 1 — Foundation & Project Setup)**: Modular Express API with centralized routing, Zod environment validation, Mongoose database connection management, Helmet security headers, rate limiting, and comprehensive health monitoring probes.

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

### 5. ⚙️ Robust Backend Foundation (Phase 1)
- **Centralized Environment Validation**: Validated via Zod with clear startup error diagnostics.
- **Mongoose Database Management**: Resilient connection handling with automated reconnection event monitoring and graceful shutdown handlers.
- **API Health & Liveness Probes**: Dedicated `/api/health` and `/api/health/live` endpoints for automated readiness and uptime tracking.
- **Defense-in-Depth Middleware**: Helmet security headers, 15-minute windowed IP rate limiting, sanitized JSON error responses, and CORS origin enforcement.

---

## 👥 5-Member Team Architecture & Work Breakdown

Developed collaboratively by 5 final-year engineering students:

| Member | Primary Ownership | Key Deliverables & Files |
|---|---|---|
| **Member 1 (Architect)** | Core Architecture, State, Routing & Backend Setup | `App.jsx`, `useAuthStore.js`, `useInterviewStore.js`, `server/src/*`, `apiClient.js`, `formatters.js`, `ErrorBoundary.jsx` |
| **Member 2 (UI/UX)** | Public Experience & Authentication | `LandingPage.jsx`, `LoginPage.jsx`, `SignupPage.jsx`, `PublicNavbar.jsx`, `Footer.jsx`, `AboutPage.jsx` |
| **Member 3 (Dashboard)** | Dashboard, Setup & Question Engine | `DashboardPage.jsx`, `InterviewSetupPage.jsx`, `questions.js`, `HistoryPage.jsx` |
| **Member 4 (Media)** | Audio/Video Hardware & Interview Room | `DeviceCheckPage.jsx`, `InterviewRoomPage.jsx`, `AiAvatar.jsx`, `useSpeech.js`, `CodePad.jsx`, `VideoFeed.jsx` |
| **Member 5 (Reporting)** | Analytics, Evaluation & Settings | `FeedbackReportPage.jsx`, `InterviewDetailPage.jsx`, `ProfilePage.jsx`, `SettingsPage.jsx`, `ScoreRadial.jsx` |

---

## 📂 Project Directory Structure

```text
InterviewAce-Major-Project/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI elements (Button, Input, Card, Modal, etc.)
│   │   ├── interview/           # Avatar, visualizers, webcam feed, codepad
│   │   └── layout/              # Navbars, Sidebar, Footers, ErrorBoundary
│   ├── data/
│   │   └── questions.js         # Offline role-specific question banks
│   ├── hooks/                   # Custom Web Speech and Audio hooks
│   ├── pages/                   # 14 distinct application pages
│   ├── services/                # Axios apiClient, mock auth, and interview services
│   ├── store/                   # Zustand stores with persist middleware
│   ├── utils/                   # Score badge and duration formatters
│   ├── App.jsx                  # Root client routing
│   ├── index.css                # Tailwind CSS v4 design tokens
│   └── main.jsx                 # Client entry point
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # Mongoose connection & status helper
│   │   │   └── env.js           # Zod-validated environment config
│   │   ├── controllers/
│   │   │   └── healthController.js # Health & Liveness controllers
│   │   ├── middleware/
│   │   │   ├── errorMiddleware.js     # Sanitized global error handler
│   │   │   ├── notFoundMiddleware.js  # 404 route handler
│   │   │   └── rateLimitMiddleware.js # express-rate-limit configuration
│   │   ├── routes/
│   │   │   ├── healthRoutes.js  # /api/health endpoints
│   │   │   └── index.js         # Central API route index
│   │   ├── utils/
│   │   │   ├── ApiError.js      # Operational error class
│   │   │   ├── ApiResponse.js   # Standard success response formatter
│   │   │   └── asyncHandler.js  # Async route wrapper
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Backend startup & shutdown entry point
│   ├── tests/
│   │   └── health.test.js       # Node.js built-in automated test suite
│   ├── .env.example             # Backend environment template
│   ├── .gitignore               # Server secret & dependency ignore rules
│   ├── package.json             # Independent backend dependencies & scripts
│   └── package-lock.json
│
├── .env.example                 # Frontend environment template
├── .gitignore                   # Root repository gitignore
├── package.json                 # Frontend dependencies
├── vite.config.js
└── README.md
```

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

### Frontend
- **Core Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 8 with `@tailwindcss/vite`
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 with custom White & Emerald light tokens
- **State Management**: Zustand 5 with `persist` middleware
- **Data Visualizations**: Recharts 3 (`AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`)
- **Iconography**: Lucide React
- **Web APIs**: Web Speech API (`SpeechSynthesis`, `SpeechRecognition`), `navigator.mediaDevices.getUserMedia`
- **Storage**: Browser `localStorage`

### Backend (Phase 1)
- **Runtime**: Node.js (v20+ LTS)
- **Framework**: Express.js 4 (ES Modules)
- **Database ODM**: Mongoose 8
- **Configuration & Validation**: `dotenv`, `zod`
- **Security & Utilities**: `cors`, `helmet`, `morgan`, `express-rate-limit`
- **Testing**: Node.js built-in test runner (`node --test`), Supertest

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v20 or higher recommended, verified on v24.11.1)
- npm (v10+ recommended)
- MongoDB (Local MongoDB Community Server running on `27017` or MongoDB Atlas URI)

---

### 1. Frontend Setup & Launch

From the project root directory:

```bash
# 1. Install frontend dependencies
npm install

# 2. Configure environment (optional, defaults to http://localhost:5000/api)
cp .env.example .env

# 3. Start development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

To verify production frontend build:
```bash
npm run build
```

---

### 2. Backend Setup & Launch (Phase 1)

From the project root directory, navigate to the `server/` folder:

```bash
# 1. Navigate to backend directory
cd server

# 2. Install backend dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

Review your `server/.env` configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/interviewace
CLIENT_URL=http://localhost:5173
```

#### Running Local MongoDB vs MongoDB Atlas:
- **Local MongoDB**: Ensure MongoDB service is running (`net start MongoDB` on Windows or `brew services start mongodb-community` on macOS). Use `mongodb://127.0.0.1:27017/interviewace`.
- **MongoDB Atlas**: Replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/interviewace?retryWrites=true&w=majority`.

#### Starting the Backend:
```bash
# Development mode with hot-reloading (nodemon)
npm run dev

# Standard production startup
npm start
```

Backend will listen at `http://localhost:5000`.

---

## 🔍 Health Check & Liveness Probes

The backend exposes two standard monitoring endpoints:

### 1. Full Health Check (with Database status)
```http
GET /api/health
```
**Healthy Response (HTTP 200)**:
```json
{
  "success": true,
  "message": "InterviewAce API is healthy",
  "data": {
    "service": "InterviewAce Backend",
    "status": "healthy",
    "database": "connected",
    "timestamp": "2026-11-26T13:18:55.973Z",
    "uptime": 12
  }
}
```
*Note: If the database is disconnected, this endpoint automatically returns **HTTP 503 Service Unavailable** with `"database": "disconnected"`.*

### 2. Liveness Probe (Process execution status)
```http
GET /api/health/live
```
**Response (HTTP 200)**:
```json
{
  "success": true,
  "message": "InterviewAce API is live",
  "data": {
    "service": "InterviewAce Backend",
    "status": "live",
    "timestamp": "2026-11-26T13:18:55.992Z",
    "uptime": 12
  }
}
```

---

## 🧪 Automated Testing

Backend unit and integration tests use the Node.js built-in test runner and Supertest. They run without requiring active MongoDB Atlas credentials:

```bash
cd server
npm test
```

**Executed Test Cases**:
1. `GET /api/health/live` returns HTTP 200 with live process status.
2. `GET /api/health` returns HTTP 200 when database status is connected.
3. `GET /api/health` returns HTTP 503 when database is unavailable.
4. Unknown API routes return HTTP 404 with structured error JSON.
5. Invalid JSON request payloads return HTTP 400 with syntax error details.
6. API response structure consistency across success and error responses.
7. CORS configuration authorizes configured frontend origin and blocks untrusted origins.
8. Helmet security headers attached and `X-Powered-By` disabled.

---

## 📌 Phase 1 Scope & Limitations

> [!NOTE]
> **Phase 1 strictly establishes backend foundation and infrastructure setup.**
> The following features are intentionally scoped for future phases and not yet implemented:
> - User registration, login, and JWT authentication (Phase 2)
> - User and Interview Mongoose database models
> - AI generation with Gemini / OpenAI APIs
> - Resume parsing and file uploads
> - Production cloud deployment
> 
> The frontend currently operates using self-contained mock services and browser storage, ensuring uninterrupted client functionality while backend phases progress.

---

## 📝 License & Academic Acknowledgement

Developed as a Final-Year Major Project for the Bachelor of Technology (B.Tech) in Computer Science & Engineering degree. Designed for demonstration, evaluation, and viva presentations.
