import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for recording audio from a MediaStream using the MediaRecorder API.
 * Accepts the stream object returned by useMediaStream().
 *
 * @param {MediaStream|null} stream - Live media stream from useMediaStream
 * @returns {{
 *   isRecording: boolean,
 *   recordingDuration: number,
 *   startRecording: () => void,
 *   stopRecording: () => Promise<Blob>
 * }}
 */
export default function useAudioRecorder(stream) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const resolveRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!stream || isRecording) return;

    // Isolate only audio tracks for the recorder
    const audioStream = new MediaStream(stream.getAudioTracks());

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : '';

    const recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
      if (resolveRef.current) {
        resolveRef.current(blob);
        resolveRef.current = null;
      }
    };

    recorder.start(250); // collect chunks every 250ms
    setIsRecording(true);
    setRecordingDuration(0);

    // Tick every second
    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  }, [stream, isRecording]);

  /**
   * Stops recording and returns a Promise that resolves with the audio Blob.
   * @returns {Promise<Blob>}
   */
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        // Nothing was recorded — return an empty blob
        resolve(new Blob([], { type: 'audio/webm' }));
        return;
      }

      resolveRef.current = resolve;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  }, [isRecording]);

  return { isRecording, recordingDuration, startRecording, stopRecording };
}
