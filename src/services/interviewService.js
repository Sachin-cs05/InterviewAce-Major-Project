// import apiClient from './apiClient';

/**
 * Simulates a network latency delay for mock API responses.
 * @param {number} ms - Milliseconds to delay (default 800ms)
 * @returns {Promise<void>}
 */
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates and initializes a new AI Mock Interview session.
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
 * @param {Object} config - Interview parameters configured by Member 3
 * @param {string} config.role - Target job role (e.g. 'SDE-1', 'Frontend Engineer')
 * @param {string} config.difficulty - 'Easy' | 'Medium' | 'Hard'
 * @param {string} config.interviewType - 'Technical' | 'Behavioral' | 'System Design'
 * @param {Array<string>} [config.techStack] - Technologies to focus on (e.g. ['React', 'Node.js'])
 * @param {number} [config.totalQuestions=5] - Number of questions in session
 * @param {File|null} [resumeFile] - Candidate's resume file for dynamic context injection
 * @returns {Promise<{ sessionId: string, sessionConfig: Object, status: string, firstQuestion: Object, createdAt: string }>}
 */
export const createInterviewSession = async (config, resumeFile = null) => {
  await mockDelay(800);

  const sessionId = `sess_${Date.now()}`;
  const totalQuestions = config?.totalQuestions || 5;

  return {
    sessionId,
    sessionConfig: {
      role: config?.role || 'SDE-1',
      difficulty: config?.difficulty || 'Medium',
      interviewType: config?.interviewType || 'Technical',
      techStack: config?.techStack || ['React', 'JavaScript', 'Tailwind CSS'],
      resumeFileName: resumeFile?.name || config?.resumeFileName || 'Resume.pdf',
      totalQuestions,
    },
    status: 'AI_SPEAKING',
    firstQuestion: {
      id: 'q_1',
      index: 1,
      total: totalQuestions,
      question: `Welcome to your ${config?.role || 'SDE-1'} technical interview. Could you explain how the JavaScript event loop operates, specifically contrasting microtasks (like Promises) with macrotasks (like setTimeout)?`,
      category: 'Core JavaScript & Architecture',
      expectedKeyPoints: [
        'Call stack execution',
        'Microtask queue vs. Macrotask queue priority',
        'Event loop tick cycle',
        'Promise resolution timing',
      ],
    },
    createdAt: new Date().toISOString(),
  };
};

/**
 * Submits the candidate's answer (audio recording, transcription, or code snippet) for AI evaluation.
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
 * @param {Blob|null} [audioBlob] - Recorded audio answer from Member 4's media recorder
 * @param {string|null} [codeSnippet] - Optional live code input from code editor
 * @returns {Promise<{ questionId: string, feedback: string, score: number, isLastQuestion: boolean, nextQuestion: Object|null }>}
 */
export const submitUserAnswer = async (sessionId, audioBlob = null, codeSnippet = null) => {
  await mockDelay(800);

  return {
    sessionId,
    questionId: 'q_1',
    evaluation: {
      score: 86,
      transcription:
        'The JavaScript event loop prioritizes synchronous execution on the call stack. Once the stack is clear, all pending microtasks from Promise resolutions and queueMicrotask are processed before dequeuing the next macrotask such as setTimeout or setInterval.',
      feedback:
        'Excellent articulation of the microtask priority phase over timers. Demonstrates strong fundamentals.',
      suggestedImprovements: [
        'Mention Node.js process.nextTick priority differences if discussing backend environments.',
      ],
    },
    isLastQuestion: false,
    nextQuestion: {
      id: 'q_2',
      index: 2,
      total: 5,
      question:
        'In React, how does the reconciliation algorithm (Virtual DOM / Fiber) optimize DOM updates, and what are best practices to prevent unnecessary component re-renders?',
      category: 'React Internals & Performance',
    },
  };
};

/**
 * Fetches the user's past interview session records for Member 3's Dashboard.
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
      date: '2026-11-18T14:30:00.000Z',
      overallScore: 88,
      status: 'COMPLETED',
      durationMinutes: 24,
      totalQuestions: 5,
    },
    {
      sessionId: 'sess_102',
      role: 'Full Stack Engineer',
      interviewType: 'System Design',
      difficulty: 'Hard',
      date: '2026-11-15T10:15:00.000Z',
      overallScore: 76,
      status: 'COMPLETED',
      durationMinutes: 32,
      totalQuestions: 4,
    },
    {
      sessionId: 'sess_103',
      role: 'Frontend Architect',
      interviewType: 'Behavioral & Leadership',
      difficulty: 'Medium',
      date: '2026-11-12T16:00:00.000Z',
      overallScore: 92,
      status: 'COMPLETED',
      durationMinutes: 20,
      totalQuestions: 5,
    },
  ];
};

/**
 * Retrieves the comprehensive AI evaluation and feedback report for Member 5's Report Page.
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

  return {
    sessionId: sessionId || 'sess_101',
    role: 'SDE-1 (Frontend & React)',
    difficulty: 'Medium',
    interviewType: 'Technical',
    date: '2026-11-20T10:45:00.000Z',
    duration: '25 mins',
    overallScore: 87,
    metrics: {
      technicalAccuracy: 88,
      communicationClarity: 85,
      problemSolving: 90,
      codeQuality: 84,
    },
    strengths: [
      'Crisp explanation of the JavaScript event loop and asynchronous microtask prioritization.',
      'Clear understanding of React Fiber reconciliation and performance optimization hooks.',
      'Effective communication with structured responses and calm demeanor.',
    ],
    areasForImprovement: [
      'Provide more concrete real-world code examples when explaining state lifting.',
      'Elaborate on edge-case scenarios and browser rendering pipeline (reflow vs repaint).',
    ],
    questionBreakdowns: [
      {
        questionNumber: 1,
        question: 'Explain the event loop and microtask queue mechanics.',
        category: 'Core JavaScript',
        score: 90,
        candidateSummary: 'Accurately outlined stack, microtasks (Promises), and macrotasks (timers).',
        feedback: 'Superb clarity on call stack ordering.',
      },
      {
        questionNumber: 2,
        question: 'How do you optimize render performance in complex React component trees?',
        category: 'React Architecture',
        score: 85,
        candidateSummary: 'Discussed memoization, transition hooks, and virtualization.',
        feedback: 'Good answer; could mention profiling tools like React DevTools Profiler.',
      },
      {
        questionNumber: 3,
        question: 'How would you architect an end-to-end authentication flow with JWT tokens?',
        category: 'Web Security & State',
        score: 86,
        candidateSummary: 'Detailed access tokens, refresh tokens, and Axios interceptor setup.',
        feedback: 'Solid security architecture understanding.',
      },
    ],
    transcript: [
      { id: 't_1', sender: 'AI', text: 'Welcome to your technical mock interview! Are you ready to begin?', timestamp: '10:45 AM' },
      { id: 't_2', sender: 'USER', text: 'Yes, ready! Excited to dive in.', timestamp: '10:45 AM' },
      { id: 't_3', sender: 'AI', text: 'Great! Let us start: Could you explain how the JavaScript event loop operates?', timestamp: '10:46 AM' },
      { id: 't_4', sender: 'USER', text: 'The event loop prioritizes synchronous tasks on the call stack, then processes the microtask queue before picking from the macrotask queue.', timestamp: '10:47 AM' },
    ],
  };
};
