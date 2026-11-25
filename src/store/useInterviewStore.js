import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @typedef {'IDLE' | 'AI_SPEAKING' | 'USER_LISTENING' | 'PROCESSING' | 'COMPLETED'} InterviewStatus
 * 
 * @typedef {Object} SessionConfig
 * @property {string} role - Target job role (e.g. 'SDE-1', 'Frontend Developer')
 * @property {string} difficulty - 'Easy' | 'Medium' | 'Hard'
 * @property {string} interviewType - 'Technical' | 'Behavioral' | 'System Design' | 'DSA'
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
 * Centralized Zustand Store for the Live Interview lifecycle.
 * Upgraded with sessionStorage persist middleware so refreshing mid-interview preserves
 * sessionId, sessionConfig, currentQuestionIndex, and transcript.
 * 
 * 100% backward-compatible with all existing actions and state properties used by Members 3 & 4.
 */
export const useInterviewStore = create(
  persist(
    (set, get) => ({
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
       * Used by Member 3 (InterviewSetupPage).
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
       * Sets sessionId, sessionConfig, status to AI_SPEAKING, currentQuestionIndex to 1,
       * and seeds the transcript with the first question.
       * Used by Member 4 (DeviceCheckPage & InterviewRoomPage).
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
       * Updates the active question index pointer.
       * @param {number} index
       */
      setCurrentQuestionIndex: (index) => {
        set({ currentQuestionIndex: index });
      },

      /**
       * Increments question index to the next question.
       */
      nextQuestion: () => {
        set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 }));
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
       * Resets the entire interview state back to its Day-1 initial state
       * and clears persisted session data.
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
    }),
    {
      name: 'interviewace-session', // Key in sessionStorage
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionConfig: state.sessionConfig,
        currentQuestionIndex: state.currentQuestionIndex,
        transcript: state.transcript,
        status: state.status,
        isMicOn: state.isMicOn,
        isCamOn: state.isCamOn,
      }),
    }
  )
);
