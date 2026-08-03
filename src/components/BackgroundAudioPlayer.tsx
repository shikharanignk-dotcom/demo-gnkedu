import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MAIN_AUDIO_URL = 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785743944/whatsapp-video-2026-07-28-at-12-03-58-pm_xtp2fy.mp3';

type Phase = 'IDLE' | 'INTRO_5S' | 'MAIN_AUDIO' | 'OUTRO_10S';

export const BackgroundAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const isStartedRef = useRef<boolean>(false);
  const currentPhaseRef = useRef<Phase>('IDLE');

  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Initialize or get Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    intervalRef.current = null;
    timerRef.current = null;
  };

  const startIntro5s = () => {
    clearTimers();
    currentPhaseRef.current = 'INTRO_5S';

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const ctx = getAudioContext();
    if (ctx) {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      let idx = 0;
      intervalRef.current = setInterval(() => {
        try {
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[idx % notes.length], ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.9);
          idx++;
        } catch (e) {}
      }, 700);
    }

    timerRef.current = setTimeout(() => {
      startMainAudio();
    }, 5000);
  };

  const startMainAudio = () => {
    clearTimers();
    currentPhaseRef.current = 'MAIN_AUDIO';

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.muted = isMuted;
      audio.play().catch((err) => {
        console.warn('Main audio playback deferred:', err);
      });
    }
  };

  const startOutro10s = () => {
    clearTimers();
    currentPhaseRef.current = 'OUTRO_10S';

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const ctx = getAudioContext();
    if (ctx) {
      const notes = [349.23, 440.00, 523.25, 659.25, 440.00];
      let idx = 0;
      intervalRef.current = setInterval(() => {
        try {
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[idx % notes.length], ctx.currentTime);
          gain.gain.setValueAtTime(0.10, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
          idx++;
        } catch (e) {}
      }, 900);
    }

    timerRef.current = setTimeout(() => {
      startIntro5s();
    }, 10000);
  };

  const handleAudioEnded = () => {
    startOutro10s();
  };

  const unlockAndPlay = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!isStartedRef.current) {
      isStartedRef.current = true;
      startIntro5s();
    } else {
      if (currentPhaseRef.current === 'MAIN_AUDIO' && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    // Attempt playback immediately
    unlockAndPlay();

    const handleGesture = () => {
      unlockAndPlay();
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('pointerdown', handleGesture);
    window.addEventListener('scroll', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture);

    return () => {
      clearTimers();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  return (
    <audio
      ref={audioRef}
      src={MAIN_AUDIO_URL}
      onEnded={handleAudioEnded}
      onError={() => startOutro10s()}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};


