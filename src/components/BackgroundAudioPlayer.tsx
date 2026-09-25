import React, { useEffect, useRef, useState } from 'react';

const MAIN_AUDIO_URL = 'https://res.cloudinary.com/u1pgidk7/video/upload/v1785743944/whatsapp-video-2026-07-28-at-12-03-58-pm_xtp2fy.mp3';

export const BackgroundAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStartedRef = useRef<boolean>(false);
  const [isMuted] = useState<boolean>(false);

  const startMainAudio = () => {
    const audio = audioRef.current;
    if (audio && !isStartedRef.current) {
      isStartedRef.current = true;
      audio.currentTime = 0;
      audio.muted = isMuted;
      audio.play()
        .then(() => {
          console.log('Background voice started playing successfully.');
        })
        .catch((err) => {
          // If NotSupportedError or dead link (401), do NOT retry
          if (err.name === 'NotSupportedError' || err.message?.includes('supported')) {
            console.warn('Background audio source not available or expired.');
            isStartedRef.current = true;
            return;
          }
          // Only retry on user interaction if it was a NotAllowedError (browser autoplay policy)
          if (err.name === 'NotAllowedError') {
            isStartedRef.current = false;
          }
        });
    }
  };

  useEffect(() => {
    // 1. Attempt autoplay after 2 seconds
    const autoPlayTimer = setTimeout(() => {
      startMainAudio();
    }, 2000);

    // 2. Play on first user interaction (scroll, click, touch, key) as browser fallback
    const handleGesture = () => {
      startMainAudio();
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('pointerdown', handleGesture);
    window.addEventListener('scroll', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture);

    return () => {
      clearTimeout(autoPlayTimer);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={MAIN_AUDIO_URL}
      preload="auto"
      onError={() => {
        isStartedRef.current = true;
      }}
      style={{ display: 'none' }}
    />
  );
};
