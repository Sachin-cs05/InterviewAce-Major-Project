import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Video,
  VideoOff,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

/**
 * Pre-Interview Hardware & Readiness Check Page (White & Emerald Theme)
 * Tests webcam feeds, microphone audio meters, and provides a text-only fallback option.
 */
export default function DeviceCheckPage() {
  const navigate = useNavigate();
  const { sessionId, sessionConfig, isMicOn, isCamOn, toggleMic, toggleCam } = useInterviewStore();

  const [stream, setStream] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'granted' | 'denied' | 'prompt'
  const [micPermission, setMicPermission] = useState('prompt');
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const activeSessionId = sessionId || `sess_${Date.now()}`;

  // Request permissions and initialize webcam/mic
  useEffect(() => {
    let activeStream = null;

    const startMedia = async () => {
      setIsInitializing(true);
      setErrorMessage('');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Your browser does not support webcam/microphone capture.');
        setCameraPermission('denied');
        setMicPermission('denied');
        setIsInitializing(false);
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        activeStream = mediaStream;
        setStream(mediaStream);
        setCameraPermission('granted');
        setMicPermission('granted');

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Setup Web Audio Analyser for mic volume level
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(mediaStream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        } catch (audioErr) {
          console.warn('[DeviceCheck] AudioContext init warning:', audioErr);
        }
      } catch (err) {
        console.warn('[DeviceCheck] getUserMedia error:', err);
        setCameraPermission('denied');
        setMicPermission('denied');
        setErrorMessage(
          'Camera or microphone access was blocked or is unavailable. You can still proceed with a text-based interview fallback.'
        );
      } finally {
        setIsInitializing(false);
      }
    };

    startMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleToggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    }
    toggleCam();
  };

  const handleToggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    }
    toggleMic();
  };

  const handleStartInterview = (mode = 'standard') => {
    // Release preview stream tracks so interview room can take fresh control
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigate(`/interview/${activeSessionId}`, { state: { interviewMode: mode } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pre-Flight Readiness</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Device & Hardware Check
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verify your camera and microphone permissions to ensure a smooth mock interview session.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStartInterview('text-fallback')}
          >
            Start Text Interview
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Video Preview & Device Controls */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="overflow-hidden p-0 border-slate-200 shadow-md">
            {/* Webcam Viewport */}
            <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
              {isCamOn && cameraPermission === 'granted' ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <VideoOff className="w-10 h-10 mb-2 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-300">Camera Feed Off</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cameraPermission === 'denied'
                      ? 'Camera permission denied or unavailable'
                      : 'Camera preview is disabled'}
                  </p>
                </div>
              )}

              {/* Status Badges Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Preview</span>
                </span>
              </div>

              {/* Audio Volume Visualizer Bar Overlay */}
              {micPermission === 'granted' && isMicOn && (
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs p-2 rounded-xl flex items-center gap-3">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-75"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono w-8 text-right">
                    {audioLevel}%
                  </span>
                </div>
              )}
            </div>

            {/* Device Toggles Bar */}
            <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isCamOn ? 'outline' : 'danger'}
                  onClick={handleToggleCam}
                  icon={isCamOn ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4" />}
                >
                  {isCamOn ? 'Camera On' : 'Camera Off'}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={isMicOn ? 'outline' : 'danger'}
                  onClick={handleToggleMic}
                  icon={isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
                >
                  {isMicOn ? 'Mic Active' : 'Mic Muted'}
                </Button>
              </div>

              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                HD 720p Recommended
              </span>
            </div>
          </Card>

          {/* Fallback Option Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-800">Hardware not cooperating?</p>
              <p className="text-slate-500">
                You can complete your entire mock interview with speech synthesis and text answers.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStartInterview('text-fallback')}
            >
              Use Text Mode
            </Button>
          </div>
        </div>

        {/* Right: Readiness Checklist & Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pre-Flight Checklist */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pre-Flight System Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Webcam Permission:</span>
                {cameraPermission === 'granted' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">Not Granted</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Microphone Input:</span>
                {micPermission === 'granted' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Detected
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">Not Detected</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Speech Synthesis (Voice):</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600">Local Question Bank:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Loaded
                </span>
              </div>
            </div>
          </Card>

          {/* Interview Guidelines Card */}
          <Card className="space-y-3 bg-emerald-50/40 border-emerald-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              Session Guidelines
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Position yourself in a well-lit and quiet room.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Speak clearly into your microphone or type your responses into the answer box.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Maintain tab focus; leaving the window simulates interview proctoring alerts.</span>
              </li>
            </ul>
          </Card>

          {/* Launch Action */}
          <div className="space-y-2.5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleStartInterview('standard')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Enter Live Interview Room
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => navigate('/setup')}
            >
              Reconfigure Interview Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
