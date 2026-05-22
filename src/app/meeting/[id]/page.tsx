'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMatchingStore } from '@/features/matching/store/matching.store';
import { ArrowLeft, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import Link from 'next/link';

export default function MeetingPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const sessions = useMatchingStore((s) => s.sessions);
  const session = sessions.find((s) => s.id === sessionId);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const jitsiRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!session || !jitsiRef.current || loadedRef.current) return;

    const domain = 'meet.jit.si';

    try {
      const iframe = document.createElement('iframe');
      iframe.src = `https://${domain}/${session.roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableDeepLinking=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_ALWAYS_VISIBLE=true&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true`;
      iframe.allow = 'camera; microphone; display-capture; fullscreen';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0';
      iframe.allowFullscreen = true;
      jitsiRef.current.appendChild(iframe);
      loadedRef.current = true;
    } catch (err) {
      console.error('Failed to load Jitsi:', err);
    }

    const container = jitsiRef.current;
    return () => {
      container.innerHTML = '';
      loadedRef.current = false;
    };
  }, [session]);

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Session not found.</p>
        <Link
          href="/sessions"
          className="text-sm font-medium text-emerald-500 hover:underline"
        >
          Back to sessions
        </Link>
      </div>
    );
  }

  const partnerName =
    session.hostName || session.participantName || 'Your peer';

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-black/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <Link
            href="/sessions"
            className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm text-white/50">|</span>
          <span className="text-sm font-medium text-white">
            {partnerName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`rounded-full p-2 transition-colors ${
              micOn
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-red-600 text-white'
            }`}
          >
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setCamOn(!camOn)}
            className={`rounded-full p-2 transition-colors ${
              camOn
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-red-600 text-white'
            }`}
          >
            {camOn ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Jitsi iframe container */}
      <div ref={jitsiRef} className="flex-1" />
    </div>
  );
}
