// import apiClient from './apiClient';

/**
 * Simulates network latency for mock API calls.
 * @param {number} ms - Milliseconds to delay (default 800ms)
 * @returns {Promise<void>}
 */
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * In-memory Mock Interview Question Banks organized by target career role.
 * Powers the smart mock interview engine before Express API integration.
 */
const ROLE_QUESTION_BANKS = {
  'sde-1': [
    {
      id: 'sde_q1',
      question:
        'Could you explain how the JavaScript event loop operates, specifically contrasting microtasks (like Promises) with macrotasks (like setTimeout)?',
      category: 'Core JavaScript & Concurrency',
      expectedKeyPoints: ['Call stack execution', 'Microtask queue priority', 'Macrotask dequeue', 'Event loop tick'],
    },
    {
      id: 'sde_q2',
      question:
        'What are the key time and space complexity differences between QuickSort and MergeSort, and when would you prefer MergeSort in practice?',
      category: 'Data Structures & Algorithms',
      expectedKeyPoints: ['Worst case O(N^2) vs O(N log N)', 'Stable sorting', 'Linked lists vs Arrays', 'Auxiliary memory'],
    },
    {
      id: 'sde_q3',
      question:
        'In React, what are the primary causes of unnecessary re-renders, and how do React.memo, useMemo, and useCallback mitigate them?',
      category: 'React Architecture & Performance',
      expectedKeyPoints: ['Referential equality', 'Shallow prop comparison', 'Memoization trade-offs', 'Render cascades'],
    },
    {
      id: 'sde_q4',
      question:
        'How would you design a robust RESTful API endpoint supporting cursor-based pagination and idempotent request handling?',
      category: 'System Design & APIs',
      expectedKeyPoints: ['Idempotency keys', 'Offset vs Cursor pagination', 'HTTP status codes', 'Error payload standards'],
    },
    {
      id: 'sde_q5',
      question:
        'Walk me through a production bug or performance bottleneck you resolved. How did you isolate root causes and verify your fix?',
      category: 'Behavioral & Troubleshooting',
      expectedKeyPoints: ['Structured debugging', 'Metrics and logging', 'Root cause analysis', 'Regression testing'],
    },
  ],

  'frontend developer': [
    {
      id: 'fe_q1',
      question:
        'How does the browser Critical Rendering Path work, and what actionable strategies do you use to improve Core Web Vitals like LCP and CLS?',
      category: 'Browser Internals & Performance',
      expectedKeyPoints: ['DOM/CSSOM construction', 'Render tree and layout', 'Resource hints (preload, preconnect)', 'Image aspect ratios'],
    },
    {
      id: 'fe_q2',
      question:
        'When architecting responsive component layouts, how do you decide between CSS Grid and Flexbox, and how do container queries change that dynamic?',
      category: 'Modern CSS & Responsive Design',
      expectedKeyPoints: ['1D vs 2D layout models', 'Subgrid support', 'Container query advantages over media queries'],
    },
    {
      id: 'fe_q3',
      question:
        'How does React Fiber reconciliation algorithm optimize updates, and how do React 18/19 concurrent transitions (startTransition) improve UI responsiveness?',
      category: 'React Internals',
      expectedKeyPoints: ['Fiber node tree', 'Interruptible work units', 'Priority lanes', 'Urgent vs transition updates'],
    },
    {
      id: 'fe_q4',
      question:
        'How do you structure client-side state in complex SPAs? Contrast client stores like Zustand with server-state libraries like TanStack Query.',
      category: 'State Architecture',
      expectedKeyPoints: ['Server state caching vs Client UI state', 'Stale-while-revalidate', 'Optimistic UI mutations'],
    },
    {
      id: 'fe_q5',
      question:
        'How do you guarantee full web accessibility (a11y) and keyboard navigation compliance across custom modal and dropdown components?',
      category: 'Accessibility & Standards',
      expectedKeyPoints: ['WAI-ARIA roles', 'Focus traps', 'Keyboard listeners (Escape, Tab)', 'Screen reader announcements'],
    },
  ],

  'backend developer': [
    {
      id: 'be_q1',
      question:
        'How do you design and scale a relational database schema for high-throughput write operations while maintaining ACID transactional guarantees?',
      category: 'Databases & Concurrency',
      expectedKeyPoints: ['Normalization vs Denormalization', 'Write-ahead logging', 'Deadlock prevention', 'Connection pooling'],
    },
    {
      id: 'be_q2',
      question:
        'How do load balancers distribute traffic across a microservices cluster, and what are the trade-offs between Round Robin and Consistent Hashing?',
      category: 'System Architecture & Scaling',
      expectedKeyPoints: ['Layer 4 vs Layer 7 routing', 'Consistent hashing ring', 'Session stickiness', 'Health checks'],
    },
    {
      id: 'be_q3',
      question:
        'Explain how database B-Tree indexes work compared to Hash indexes. How do you analyze execution plans (EXPLAIN) to eliminate table scans?',
      category: 'Database Optimization',
      expectedKeyPoints: ['B-Tree range scans', 'Covering indexes', 'Cardinality', 'Index bloat and write overhead'],
    },
    {
      id: 'be_q4',
      question:
        'How do you architect distributed authentication using JWT access tokens, rotating refresh tokens, and Redis-backed blacklists?',
      category: 'Security & Auth',
      expectedKeyPoints: ['Stateless validation', 'Short-lived access tokens', 'HttpOnly cookies', 'Revocation strategies'],
    },
    {
      id: 'be_q5',
      question:
        'When would you decouple services with asynchronous message queues like Kafka or RabbitMQ instead of synchronous REST / gRPC APIs?',
      category: 'Distributed Systems',
      expectedKeyPoints: ['Backpressure handling', 'Loose coupling', 'At-least-once delivery', 'Eventual consistency'],
    },
  ],

  'full stack mern': [
    {
      id: 'mern_q1',
      question:
        'Walk me through the lifecycle of a request in a MERN application, from a user action in React, through Express middleware, to MongoDB persistence.',
      category: 'Full Stack Architecture',
      expectedKeyPoints: ['Axios interceptors', 'Express routing & middleware', 'Mongoose ODM queries', 'JSON serialization'],
    },
    {
      id: 'mern_q2',
      question:
        'In MongoDB, when do you choose document embedding over referencing with $lookup, and how do you ensure index coverage on sub-documents?',
      category: 'MongoDB Data Modeling',
      expectedKeyPoints: ['1:1 vs 1:N vs N:M relationships', '16MB document limit', 'Aggregation pipeline efficiency'],
    },
    {
      id: 'mern_q3',
      question:
        'How do you implement secure cross-origin authentication with JWT tokens stored in HttpOnly cookies between a Vite frontend and Express API?',
      category: 'Full Stack Security',
      expectedKeyPoints: ['CORS credentials flag', 'SameSite cookie policies', 'CSRF protection', 'Secure headers (Helmet)'],
    },
    {
      id: 'mern_q4',
      question:
        'How do you optimize a slow MongoDB aggregation pipeline querying millions of documents with multiple join and filter stages?',
      category: 'Performance Tuning',
      expectedKeyPoints: ['$match early in pipeline', 'Compound indexes', 'AllowDiskUse considerations', 'Projection pruning'],
    },
    {
      id: 'mern_q5',
      question:
        'How do you handle real-time bi-directional events (e.g. live interview audio cues) between React and Node using WebSockets / Socket.io?',
      category: 'Real-time Web',
      expectedKeyPoints: ['Handshake authentication', 'Room management', 'Heartbeat reconnection', 'Scaling with Redis adapter'],
    },
  ],

  'data analyst': [
    {
      id: 'da_q1',
      question:
        'How do you handle missing values, outliers, and skewed distributions during exploratory data analysis (EDA) before drawing conclusions?',
      category: 'Data Cleaning & EDA',
      expectedKeyPoints: ['Imputation techniques', 'IQR and Z-score outlier detection', 'Log transformations', 'Bias risks'],
    },
    {
      id: 'da_q2',
      question:
        'Explain the practical difference between WHERE and HAVING in SQL, and share an example where you used Window Functions like ROW_NUMBER or DENSE_RANK.',
      category: 'SQL & Data Extraction',
      expectedKeyPoints: ['Pre-aggregation vs post-aggregation filter', 'PARTITION BY clause', 'Ties handling in ranking'],
    },
    {
      id: 'da_q3',
      question:
        'How do you establish clear business KPIs to analyze customer churn, and how do you methodically distinguish correlation from causation?',
      category: 'Business Analytics & Metrics',
      expectedKeyPoints: ['Cohort analysis', 'LTV:CAC ratios', 'Confounding variables', 'Controlled experiments'],
    },
    {
      id: 'da_q4',
      question:
        'How does the Central Limit Theorem apply when determining minimum sample sizes and statistical significance in product A/B tests?',
      category: 'Applied Statistics',
      expectedKeyPoints: ['Sampling distributions', 'P-values vs Confidence intervals', 'Type I and Type II errors'],
    },
    {
      id: 'da_q5',
      question:
        'How do you translate complex technical statistical findings into clear executive summaries and interactive dashboards for non-technical leadership?',
      category: 'Data Storytelling & Visualization',
      expectedKeyPoints: ['Executive summaries', 'Action-oriented charts', 'Eliminating chart junk', 'Stakeholder alignment'],
    },
  ],
};

/**
 * Resolves a role string to the normalized question bank key.
 * @param {string} role
 * @returns {string}
 */
const resolveRoleKey = (role = '') => {
  const normalized = role.toLowerCase().trim();
  if (normalized.includes('front') || normalized.includes('react')) return 'frontend developer';
  if (normalized.includes('back') || normalized.includes('node') || normalized.includes('api')) return 'backend developer';
  if (normalized.includes('mern') || normalized.includes('full')) return 'full stack mern';
  if (normalized.includes('data') || normalized.includes('analyst') || normalized.includes('sql')) return 'data analyst';
  return 'sde-1'; // Default
};

/**
 * In-memory active session trackers for realistic multi-turn question flows.
 */
const activeSessions = new Map();

/**
 * Creates and initializes a new AI Mock Interview session.
 * Tailors the initial question according to the selected career role.
 * 
 * // TODO: Replace with real Express API:
 * // const formData = new FormData();
 * // formData.append('config', JSON.stringify(config));
 * // if (resumeFile) formData.append('resume', resumeFile);
 * // const response = await apiClient.post('/interview/session', formData, {
 * //   headers: { 'Content-Type': 'multipart/form-data' }
 * // });
 * // return response.data;
 * 
 * @param {Object} config - Interview configuration parameters
 * @param {string} config.role - Target job role
 * @param {string} [config.difficulty='Medium'] - 'Easy' | 'Medium' | 'Hard'
 * @param {string} [config.interviewType='Technical'] - 'Technical' | 'Behavioral' | 'System Design' | 'DSA'
 * @param {Array<string>} [config.techStack] - Technologies to focus on
 * @param {number} [config.totalQuestions=5] - Number of questions in session
 * @param {File|null} [resumeFile] - Candidate's resume file
 * @returns {Promise<{ sessionId: string, sessionConfig: Object, status: string, firstQuestion: Object, createdAt: string }>}
 */
export const createInterviewSession = async (config, resumeFile = null) => {
  await mockDelay(800);

  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const totalQuestions = Number(config?.totalQuestions) || 5;
  const role = config?.role || 'SDE-1';
  const roleKey = resolveRoleKey(role);
  const questions = ROLE_QUESTION_BANKS[roleKey] || ROLE_QUESTION_BANKS['sde-1'];

  const firstQuestionData = questions[0];

  // Store in-memory tracker for multi-turn answers
  activeSessions.set(sessionId, {
    sessionId,
    roleKey,
    currentQuestionIndex: 1,
    totalQuestions,
    questions,
  });

  return {
    sessionId,
    sessionConfig: {
      role,
      difficulty: config?.difficulty || 'Medium',
      interviewType: config?.interviewType || 'Technical',
      techStack: config?.techStack || ['JavaScript', 'React', 'Tailwind CSS'],
      resumeFileName: resumeFile?.name || config?.resumeFileName || 'Resume.pdf',
      totalQuestions,
    },
    status: 'AI_SPEAKING',
    firstQuestion: {
      id: firstQuestionData.id,
      index: 1,
      total: totalQuestions,
      question: `Welcome to your ${role} interview. To begin: ${firstQuestionData.question}`,
      category: firstQuestionData.category,
      expectedKeyPoints: firstQuestionData.expectedKeyPoints,
    },
    createdAt: new Date().toISOString(),
  };
};

/**
 * Submits the candidate's answer (audio recording or live code snippet) for AI evaluation.
 * Tracks progress against totalQuestions and serves the next question or completes the interview.
 * 
 * // TODO: Replace with real Express API:
 * // const formData = new FormData();
 * // formData.append('sessionId', sessionId);
 * // if (audioBlob) formData.append('audio', audioBlob, 'answer.webm');
 * // if (codeSnippet) formData.append('codeSnippet', codeSnippet);
 * // const response = await apiClient.post(`/interview/${sessionId}/answer`, formData);
 * // return response.data;
 * 
 * @param {string} sessionId - Active interview session ID
 * @param {Blob|null} [audioBlob] - Recorded audio answer
 * @param {string|null} [codeSnippet] - Optional live code input
 * @returns {Promise<{ questionId: string, evaluation: Object, isInterviewComplete: boolean, isLastQuestion: boolean, nextQuestion: Object|null }>}
 */
export const submitUserAnswer = async (sessionId, audioBlob = null, codeSnippet = null) => {
  await mockDelay(800);

  let session = activeSessions.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      roleKey: 'sde-1',
      currentQuestionIndex: 1,
      totalQuestions: 5,
      questions: ROLE_QUESTION_BANKS['sde-1'],
    };
    activeSessions.set(sessionId, session);
  }

  const currentIndex = session.currentQuestionIndex;
  const currentQ = session.questions[currentIndex - 1] || session.questions[0];

  // Advance index for next question
  const nextIndex = currentIndex + 1;
  session.currentQuestionIndex = nextIndex;

  const isInterviewComplete = nextIndex > session.totalQuestions;

  // Realistic mock transcription & evaluation
  let transcription =
    'The core mechanism relies on prioritising synchronous operations on the call stack before processing microtask queues, followed by the next macro queue tick.';
  let feedback =
    'Strong grasp of operational fundamentals. Clearly structured reasoning and accurate terminology.';
  let suggestedImprovements = ['Elaborate with concrete performance profiling numbers.'];

  if (codeSnippet && codeSnippet.trim().length > 0) {
    transcription = `[Candidate Code Solution Submitted]\n${codeSnippet.trim()}`;
    feedback =
      'Clean syntax and appropriate choice of data structure. Edge cases were safely considered.';
    suggestedImprovements = ['Consider memory footprint optimizations when dealing with large arrays.'];
  }

  let nextQuestion = null;
  if (!isInterviewComplete) {
    const rawNext = session.questions[nextIndex - 1] || {
      id: `q_${nextIndex}`,
      question: `Question ${nextIndex}: How do you approach architectural scalability and reliability under heavy concurrent loads?`,
      category: 'System Architecture',
    };

    nextQuestion = {
      id: rawNext.id,
      index: nextIndex,
      total: session.totalQuestions,
      question: rawNext.question,
      category: rawNext.category,
    };
  }

  return {
    sessionId,
    questionId: currentQ.id,
    evaluation: {
      score: Math.floor(Math.random() * 11) + 84, // 84 to 94
      transcription,
      feedback,
      suggestedImprovements,
    },
    isInterviewComplete,
    isLastQuestion: isInterviewComplete, // 100% backward-compatibility
    nextQuestion,
  };
};

/**
 * Fetches the user's past interview records for Member 5's Dashboard.
 * Returns 4 realistic completed interview sessions.
 * 
 * // TODO: Replace with real Express API:
 * // const response = await apiClient.get('/interview/history');
 * // return response.data;
 * 
 * @returns {Promise<Array<{ sessionId: string, role: string, interviewType: string, difficulty: string, date: string, overallScore: number, status: string, durationMinutes: number, totalQuestions: number }>>}
 */
export const getPastInterviews = async () => {
  await mockDelay(800);

  return [
    {
      sessionId: 'sess_101',
      role: 'SDE-1 (Frontend & React)',
      interviewType: 'Technical',
      difficulty: 'Medium',
      date: '2026-11-23T14:30:00.000Z',
      overallScore: 88,
      status: 'COMPLETED',
      durationMinutes: 24,
      totalQuestions: 5,
    },
    {
      sessionId: 'sess_102',
      role: 'Full Stack MERN',
      interviewType: 'System Design',
      difficulty: 'Hard',
      date: '2026-11-20T10:15:00.000Z',
      overallScore: 79,
      status: 'COMPLETED',
      durationMinutes: 32,
      totalQuestions: 5,
    },
    {
      sessionId: 'sess_103',
      role: 'Backend Developer',
      interviewType: 'Technical',
      difficulty: 'Hard',
      date: '2026-11-17T16:00:00.000Z',
      overallScore: 92,
      status: 'COMPLETED',
      durationMinutes: 28,
      totalQuestions: 5,
    },
    {
      sessionId: 'sess_104',
      role: 'Data Analyst',
      interviewType: 'Behavioral / HR',
      difficulty: 'Medium',
      date: '2026-11-14T11:45:00.000Z',
      overallScore: 84,
      status: 'COMPLETED',
      durationMinutes: 22,
      totalQuestions: 4,
    },
  ];
};

/**
 * Retrieves the comprehensive AI evaluation and feedback report for Member 5's FeedbackReport.jsx.
 * Includes overallScore, summaryFeedback, skillBreakdown (ready for Recharts RadarChart),
 * strengths, improvements, and questionFeedback.
 * 
 * // TODO: Replace with real Express API:
 * // const response = await apiClient.get(`/interview/report/${sessionId}`);
 * // return response.data;
 * 
 * @param {string} sessionId - The completed session identifier
 * @returns {Promise<Object>}
 */
export const getInterviewReport = async (sessionId) => {
  await mockDelay(800);

  const safeSessionId = sessionId || 'sess_101';

  return {
    sessionId: safeSessionId,
    role: 'SDE-1 (Frontend Developer)',
    difficulty: 'Medium',
    interviewType: 'Technical',
    date: '2026-11-25T16:30:00.000Z',
    duration: '26 mins',
    overallScore: 87,

    // Executive summary feedback for Member 5's Report
    summaryFeedback:
      'Candidate displayed strong architectural intuition, clearly conveying asynchronous execution models and React optimization patterns. Communication was methodical with proactive error analysis. Continued refinement on distributed edge cases will elevate candidate to senior-level discussions.',

    // Ready for Recharts RadarChart: <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
    skillBreakdown: [
      { subject: 'Technical Accuracy', score: 88, fullMark: 100 },
      { subject: 'Problem Solving', score: 90, fullMark: 100 },
      { subject: 'System Architecture', score: 82, fullMark: 100 },
      { subject: 'Communication', score: 86, fullMark: 100 },
      { subject: 'Code Quality', score: 84, fullMark: 100 },
    ],

    // Legacy metrics object for 100% backward-compatibility
    metrics: {
      technicalAccuracy: 88,
      communicationClarity: 86,
      problemSolving: 90,
      codeQuality: 84,
    },

    // Demonstrated Strengths
    strengths: [
      'Crisp and precise explanation of the JavaScript event loop and microtask priority mechanics.',
      'Demonstrated hands-on experience optimizing React component hierarchies with memoization and concurrent hooks.',
      'Proactive discussion of boundary conditions, API error responses, and defense-in-depth security.',
    ],

    // Target areas for improvement
    improvements: [
      'Quantify performance impacts with concrete metrics (e.g. bundle size reduction, millisecond latency).',
      'Elaborate on distributed caching invalidation strategies when discussing high-throughput APIs.',
      'Structure behavioral examples with explicit STAR (Situation, Task, Action, Result) boundaries.',
    ],
    areasForImprovement: [
      'Quantify performance impacts with concrete metrics (e.g. bundle size reduction, millisecond latency).',
      'Elaborate on distributed caching invalidation strategies when discussing high-throughput APIs.',
      'Structure behavioral examples with explicit STAR (Situation, Task, Action, Result) boundaries.',
    ], // Alias for backward-compatibility

    // Detailed question-by-question breakdown
    questionFeedback: [
      {
        question:
          'Could you explain how the JavaScript event loop operates, specifically contrasting microtasks (like Promises) with macrotasks (like setTimeout)?',
        userAnswer:
          'The event loop prioritizes synchronous tasks on the call stack first. When empty, it empties all microtasks before picking the next macrotask from the queue.',
        idealAnswer:
          'The event loop continuously coordinates the call stack and task queues. When the stack clears, the microtask queue (Promises, queueMicrotask) is completely drained before a single macrotask (setTimeout, I/O) is processed.',
        score: 92,
        tip: 'Mentioning Node.js process.nextTick priority differences shows senior-level depth.',
      },
      {
        question:
          'In React, what are the primary causes of unnecessary re-renders, and how do React.memo, useMemo, and useCallback mitigate them?',
        userAnswer:
          'Unnecessary renders happen when parent components re-render or prop references change. React.memo prevents component renders if props have not changed.',
        idealAnswer:
          'Rerenders stem from state changes, context propagation, and new object/function references. React.memo provides shallow prop equality checks, while useMemo and useCallback stabilize references between renders.',
        score: 86,
        tip: 'Mention profiling with React DevTools Profiler to measure real frame render times.',
      },
      {
        question:
          'How would you design a robust RESTful API endpoint supporting cursor-based pagination and idempotent request handling?',
        userAnswer:
          'Use GET for queries with limit and cursor parameters. For mutating calls, include an Idempotency-Key header to prevent duplicate execution.',
        idealAnswer:
          'Cursor pagination encodes a unique, indexed pointer (such as an ID or timestamp) preventing duplicate records on updates. Idempotency is enforced using unique transaction keys cached in Redis.',
        score: 84,
        tip: 'Cursor-based pagination scales significantly better than offset pagination on large datasets.',
      },
    ],

    // Alias for backward-compatibility with existing FeedbackReportPage.jsx
    questionBreakdowns: [
      {
        questionNumber: 1,
        question: 'Explain the event loop and microtask queue mechanics.',
        category: 'Core JavaScript',
        score: 92,
        candidateSummary: 'Accurately outlined stack, microtasks (Promises), and macrotasks (timers).',
        feedback: 'Superb clarity on call stack ordering and microtask priority.',
      },
      {
        questionNumber: 2,
        question: 'How do you optimize render performance in complex React component trees?',
        category: 'React Architecture',
        score: 86,
        candidateSummary: 'Discussed memoization, transition hooks, and virtualization.',
        feedback: 'Good answer; could mention profiling tools like React DevTools Profiler.',
      },
      {
        questionNumber: 3,
        question: 'How would you architect an end-to-end authentication flow with JWT tokens?',
        category: 'Web Security & State',
        score: 84,
        candidateSummary: 'Detailed access tokens, refresh tokens, and Axios interceptor setup.',
        feedback: 'Solid security architecture understanding.',
      },
    ],

    // Transcript summary
    transcript: [
      {
        id: 't_1',
        sender: 'AI',
        text: 'Welcome to your SDE-1 technical interview. Could you explain how the JavaScript event loop operates?',
        timestamp: '04:30 PM',
      },
      {
        id: 't_2',
        sender: 'USER',
        text: 'The event loop processes synchronous tasks on the call stack first, then clears microtasks before picking the next macrotask.',
        timestamp: '04:32 PM',
      },
      {
        id: 't_3',
        sender: 'AI',
        text: 'Great! Next, what are the primary causes of unnecessary re-renders in React?',
        timestamp: '04:33 PM',
      },
    ],
  };
};
