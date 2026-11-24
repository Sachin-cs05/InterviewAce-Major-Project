import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Settings,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import useMediaStream from '../hooks/useMediaStream';
import { useInterviewStore } from '../store/useInterviewStore';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

/**
 * DeviceCheck Page - Pre-interview camera/microphone testing and permission verification.
 * Assigned to: Member 4
 * 
 * Features:
 * - Automatic camera/mic permission request on mount
 * - Live video preview with mirror effect
 * - Real-time audio level meter with visual feedback
 * - Camera toggle button (on/off test)
 * - Pre-flight checklist (camera, mic, config ready)
 * - Troubleshooting alerts for permission errors
 * - Clean stream cleanup before navigating to interview room
 */
export default function DeviceCheckPage() {
  const navigate = useNavigate();
  const { sessionId, sessionConfig } = useInterviewStore();

  const {
    videoRef,
    audioLevel,
    isMicActive,
    isCamActive,
    permissionError,
    stream,
    startStream,
    stopStream,
    toggleVideo,
  } = useMediaStream();

  const [isInitializing, setIsInitializing] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  /**
   * Request media permissions automatically on component mount
   */
  useEffect(() => {
    const initializeMedia = async () => {
      setIsInitializing(true);
      await startStream();
      setIsInitializing(false);
    };

    initializeMedia();

    // Cleanup on unmount
    return () => {
      stopStream();
    };
  }, [startStream, stopStream]);

  /**
   * Retry permissions after user fixes browser settings
   */
  const handleRetryPermissions = async () => {
    setIsInitializing(true);
    await startStream();
    setIsInitializing(false);
  };

  /**
   * Navigate to interview room and clean up test stream
   */
  const handleJoinInterview = () => {
    setIsJoining(true);

    // Stop the test stream cleanly before navigating
    stopStream();

    // Navigate after a brief delay to ensure cleanup completes
    setTimeout(() => {
      const targetSessionId = sessionId || 'demo-session';
      navigate(`/interview/${targetSessionId}`);
    }, 300);
  };

  /**
   * Calculate audio level status and styling
   */
  const getAudioLevelStatus = () => {
    if (!isMicActive) {
      return { text: 'Microphone is muted', color: 'text-slate-500', badgeColor: 'bg-slate-700' };
    }

    if (audioLevel < 5) {
      return { text: 'Speak to test your microphone', color: 'text-slate-400', badgeColor: 'bg-slate-700' };
    }

    if (audioLevel < 30) {
      return { text: 'Audio detected - Low volume', color: 'text-yellow-400', badgeColor: 'bg-yellow-600/20' };
    }

    return { text: 'Mic is picking up audio', color: 'text-emerald-400', badgeColor: 'bg-emerald-600/20' };
  };

  const audioStatus = getAudioLevelStatus();

  /**
   * Pre-flight checklist items
   */
  const checklistItems = [
    {
      label: 'Camera Connected',
      isReady: isCamActive && stream && !permissionError,
      icon: Video,
    },
    {
      label: 'Microphone Active',
      isReady: isMicActive && stream && !permissionError,
      icon: Mic,
    },
    {
      label: 'Interview Config Ready',
      isReady: sessionConfig.role && sessionConfig.totalQuestions > 0,
      icon: Settings,
    },
  ];

  const allChecksPass = checklistItems.every((item) => item.isReady);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isJoining && <Loader fullScreen text="Joining interview room..." />}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Device Check & Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Test Your Camera & Microphone
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Ensure your devices are working properly before starting the interview.
          </p>
        </div>

        {/* Permission Error Alert */}
        {permissionError && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-semibold text-rose-300 mb-1">Camera/Microphone Access Denied</p>
                <p className="text-xs text-rose-200/80">{permissionError}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryPermissions}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Retry Permissions
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Camera Preview */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" />
                Camera Preview
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVideo}
                icon={isCamActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              >
                {isCamActive ? 'Turn Off' : 'Turn On'}
              </Button>
            </div>

            {/* Video Preview */}
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              {isInitializing ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader text="Initializing camera..." />
                </div>
              ) : !stream || permissionError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <VideoOff className="w-12 h-12 text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">
                    {permissionError ? 'Camera unavailable' : 'Camera not started'}
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCamActive ? '' : 'opacity-0'}`}
                    style={{ transform: 'scaleX(-1)' }} // Mirror effect
                  />
                  {!isCamActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90">
                      <VideoOff className="w-12 h-12 text-slate-600" />
                      <p className="text-sm font-medium text-slate-400">Camera is off</p>
                    </div>
                  )}
                </>
              )}

              {/* Live Indicator */}
              {stream && isCamActive && !permissionError && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-200">Live</span>
                </div>
              )}
            </div>

            {/* Camera Info */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your video is mirrored for preview only</span>
            </div>
          </div>

          {/* Right Column: Audio Test & Checklist */}
          <div className="space-y-6">
            {/* Audio Level Meter */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-400" />
                Microphone Test
              </h2>

              {/* Audio Level Bar */}
              <div className="space-y-3">
                <div className="relative h-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-100 ease-out"
                    style={{ width: `${audioLevel}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-slate-200 drop-shadow-lg">
                      {audioLevel}%
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${audioStatus.badgeColor} border border-slate-700`}
                >
                  {isMicActive ? (
                    <Mic className="w-3.5 h-3.5 text-current" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-current" />
                  )}
                  <span className={`text-xs font-medium ${audioStatus.color}`}>
                    {audioStatus.text}
                  </span>
                </div>
              </div>

              {/* Audio Tip */}
              <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                <p className="text-xs text-indigo-300/80">
                  💡 Speak naturally to test your microphone. The bar should move in response to your voice.
                </p>
              </div>
            </div>

            {/* Pre-Flight Checklist */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Readiness Checklist
              </h2>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      item.isReady
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-slate-950/50 border-slate-800'
                    }`}
                  >
                    {item.isReady ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <item.icon className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        item.isReady ? 'text-emerald-300' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interview Config Preview */}
              {sessionConfig.role && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Interview Details
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Role:</span>{' '}
                      <span className="text-slate-300 font-medium">{sessionConfig.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Questions:</span>{' '}
                      <span className="text-slate-300 font-medium">{sessionConfig.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Type:</span>{' '}
                      <span className="text-slate-300 font-medium">{sessionConfig.interviewType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Difficulty:</span>{' '}
                      <span className="text-slate-300 font-medium">{sessionConfig.difficulty}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Join Interview Button */}
        <div className="max-w-md mx-auto">
          <Button
            fullWidth
            variant="primary"
            size="lg"
            onClick={handleJoinInterview}
            disabled={!allChecksPass || isJoining}
            isLoading={isJoining}
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            {allChecksPass ? 'Join Interview Room' : 'Complete Setup to Continue'}
          </Button>

          {!allChecksPass && !permissionError && (
            <p className="text-xs text-center text-slate-500 mt-3">
              Please ensure all checklist items are complete before joining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
