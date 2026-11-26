import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Reusable Web Speech API Hook for InterviewAce
 * Provides Text-to-Speech (SpeechSynthesis) and Speech-to-Text (webkitSpeechRecognition / SpeechRecognition)
 */
export default function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Synthesis support
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }

    // Check Speech Recognition support
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.warn('[useSpeech] Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        if (current) {
          setTranscriptText((prev) => (prev ? `${prev} ${current}` : current));
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  /**
   * Reads text aloud using browser SpeechSynthesis
   * @param {string} text - Content to speak
   * @param {function} [onEnd] - Callback when speech ends
   */
  const speakText = useCallback(
    (text, onEnd) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      // Check user preference in settings
      try {
        const settings = JSON.parse(localStorage.getItem('interviewace-settings') || '{}');
        if (settings.voicePlayback === false) {
          onEnd?.();
          return;
        }
      } catch {
        // continue
      }

      window.speechSynthesis.cancel();

      if (!text) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  /**
   * Stop speaking immediately
   */
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Start speech-to-text recording
   */
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  }, []);

  /**
   * Stop speech-to-text recording
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscriptText('');
  }, []);

  return {
    isSpeaking,
    isListening,
    transcriptText,
    setTranscriptText,
    clearTranscript,
    speakText,
    stopSpeaking,
    startListening,
    stopListening,
    speechSupported,
    recognitionSupported,
  };
}
