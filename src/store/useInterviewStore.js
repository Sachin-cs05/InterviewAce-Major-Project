import { create } from 'zustand';

/**
 * @typedef {'IDLE' | 'AI_SPEAKING' | 'USER_LISTENING' | 'PROCESSING' | 'COMPLETED'} InterviewStatus
 * 
 * @typedef {Object} SessionConfig
 * @property {string} role - Target job role (e.g. 'SDE-1')
 * @property {string} difficulty - 'Easy' | 'Medium' | 'Hard'
 * @property {string} interviewType - 'Technical' | 'Behavioral' | 'System Design'
 * @property {Array<string>} techStack - Array of technologies (e.g. ['React', 'Node.js'])
 * @property {string} resumeFileName - Name of uploaded resume file
 * @property {number} totalQuestions - Total count of interview questions
 * 
 * @typedef {Object} TranscriptEntry
 * @property {string} id - Unique identifier for the transcript item
 * @property {'AI' | 'USER'} sender - The entity that spoke
 * @property {string} text - Message or transcription text
 * @property {string} timestamp - Formatted time string (e.g. "11:30 AM")
 */

const defaultSessionConfig = {
  role: 'SDE-1',
  difficulty: 'Medium',
  interviewType: 'Technical',
  techStack: ['JavaScript', 'React', 'Data Structures'],
  resumeFileName: '',
  totalQuestions: 5,
};

/**
 * Centralized Zustand Store for the Live Interview lifecycle,
 * media device states, configuration parameters, and conversation transcripts.
 */
export const useInterviewStore = create((set, get) => ({
  // State
  status: 'IDLE',
  sessionId: null,
  sessionConfig: { ...defaultSessionConfig },
  currentQuestionIndex: 1,
  transcript: [],
  isMicOn: true,
  isCamOn: true,

  // Actions

  /**
   * Updates or merges interview configuration settings.
   * Used primarily by Member 3 (InterviewSetupPage).
   * @param {Partial<SessionConfig>} config
   */
  setSessionConfig: (config) => {
    set((state) => ({
      sessionConfig: {
        ...state.sessionConfig,
        ...config,
      },
    }));
  },

  /**
   * Initializes a live interview session with generated session details.
   * Used by Member 4 (InterviewRoomPage).
   * @param {Object} sessionData
   * @param {string} sessionData.sessionId
   * @param {Object} [sessionData.firstQuestion]
   * @param {Partial<SessionConfig>} [sessionData.sessionConfig]
   */
  startInterview: (sessionData) => {
    const initialTranscript = [];

    if (sessionData?.firstQuestion?.question) {
      initialTranscript.push({
        id: `msg_${Date.now()}`,
        sender: 'AI',
        text: sessionData.firstQuestion.question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    set((state) => ({
      sessionId: sessionData.sessionId,
      sessionConfig: {
        ...state.sessionConfig,
        ...(sessionData.sessionConfig || {}),
      },
      status: 'AI_SPEAKING',
      currentQuestionIndex: 1,
      transcript: initialTranscript,
      isMicOn: true,
      isCamOn: true,
    }));
  },

  /**
   * Sets the active status of the interview agent.
   * @param {InterviewStatus} status
   */
  setStatus: (status) => {
    set({ status });
  },

  /**
   * Appends a new conversation entry to the live transcript.
   * @param {'AI' | 'USER'} sender - Speaker origin
   * @param {string} text - Message content
   */
  addTranscriptMessage: (sender, text) => {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      transcript: [...state.transcript, newMessage],
    }));
  },

  /**
   * Toggles the user microphone mute/unmute state.
   */
  toggleMic: () => {
    set((state) => ({ isMicOn: !state.isMicOn }));
  },

  /**
   * Toggles the user webcam enable/disable state.
   */
  toggleCam: () => {
    set((state) => ({ isCamOn: !state.isCamOn }));
  },

  /**
   * Resets the entire interview state back to its Day-1 initial state.
   */
  resetInterview: () => {
    set({
      status: 'IDLE',
      sessionId: null,
      sessionConfig: { ...defaultSessionConfig },
      currentQuestionIndex: 1,
      transcript: [],
      isMicOn: true,
      isCamOn: true,
    });
  },
}));
