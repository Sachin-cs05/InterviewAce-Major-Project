import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom React Hook for managing getUserMedia webcam/microphone streams.
 * Handles permissions, track toggling, real-time audio level monitoring via Web Audio API,
 * and proper cleanup to ensure the camera light indicator turns off on unmount.
 * 
 * @returns {{
 *   stream: MediaStream | null,
 *   videoRef: React.RefObject<HTMLVideoElement>,
 *   audioLevel: number,
 *   isMicActive: boolean,
 *   isCamActive: boolean,
 *   permissionError: string | null,
 *   startStream: () => Promise<void>,
 *   stopStream: () => void,
 *   toggleVideo: () => void,
 *   toggleAudio: () => void
 * }}
 */
export default function useMediaStream() {
  const [stream, setStream] = useState(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  /**
   * Initialize Web Audio API pipeline for real-time microphone volume detection.
   * Sets up AudioContext -> MediaStreamSource -> AnalyserNode -> Time-domain volume calculation.
   */
  const setupAudioMonitoring = useCallback((mediaStream) => {
    try {
      // Create audio context (use webkit prefix for Safari compatibility)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Create analyser node for frequency/waveform data extraction
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Small FFT size for fast response
      analyser.smoothingTimeConstant = 0.8; // Smooth out rapid fluctuations
      analyserRef.current = analyser;

      // Connect microphone stream to analyser
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      // Buffer to hold time-domain audio data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      /**
       * Continuously calculate the average amplitude (volume level) of the mic input.
       * Maps the byte range (0-255) to a 0-100 scale for UI display.
       */
      const updateAudioLevel = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyser.getByteTimeDomainData(dataArray);

        // Calculate RMS (root mean square) volume from time-domain samples
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const normalized = (dataArray[i] - 128) / 128; // Convert to -1 to 1 range
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / bufferLength);

        // Scale RMS (0-1 range) to 0-100 percentage
        const volume = Math.min(100, Math.floor(rms * 200));

        setAudioLevel(volume);

        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (err) {
      console.error('[useMediaStream] Audio monitoring setup failed:', err);
    }
  }, []);

  /**
   * Request camera and microphone permissions from the browser.
   * Automatically attaches the video stream to the videoRef element.
   */
  const startStream = useCallback(async () => {
    try {
      setPermissionError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setStream(mediaStream);
      setIsMicActive(true);
      setIsCamActive(true);

      // Attach stream to <video> element for preview
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initialize audio level monitoring
      setupAudioMonitoring(mediaStream);
    } catch (err) {
      console.error('[useMediaStream] Permission denied or device unavailable:', err);

      // User-friendly error messages
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera/Microphone access denied. Please enable permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No camera or microphone detected. Please connect a device and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setPermissionError('Camera/Microphone is already in use by another application.');
      } else {
        setPermissionError('Failed to access camera/microphone. Please check your device settings.');
      }
    }
  }, [setupAudioMonitoring]);

  /**
   * Stop all media tracks and clean up Web Audio API resources.
   * Ensures camera indicator light turns off properly.
   */
  const stopStream = useCallback(() => {
    // Stop all video and audio tracks
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // Clear video element source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Cancel animation frame loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Close AudioContext to free resources
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    // Reset state
    setStream(null);
    setIsMicActive(false);
    setIsCamActive(false);
    setAudioLevel(0);
    setPermissionError(null);
  }, [stream]);

  /**
   * Toggle video track enabled/disabled without stopping the entire stream.
   * Useful for "Camera On/Off" button in the UI.
   */
  const toggleVideo = useCallback(() => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCamActive(videoTrack.enabled);
    }
  }, [stream]);

  /**
   * Toggle audio track enabled/disabled without stopping the entire stream.
   * Useful for "Mic Mute/Unmute" button in the UI.
   */
  const toggleAudio = useCallback(() => {
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicActive(audioTrack.enabled);

      // Reset audio level when muted
      if (!audioTrack.enabled) {
        setAudioLevel(0);
      }
    }
  }, [stream]);

  /**
   * Cleanup effect: Stop stream and release resources when component unmounts.
   * Critical for ensuring camera light turns off properly.
   */
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    stream,
    videoRef,
    audioLevel,
    isMicActive,
    isCamActive,
    permissionError,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
  };
}
