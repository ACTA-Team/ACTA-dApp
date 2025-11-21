'use client';

import { useState, useEffect } from 'react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  videoPath: string;
}

const FALLBACK: Tutorial[] = [
  {
    id: 'wallet',
    title: 'Connect Wallet',
    description: 'Cómo conectar tu wallet',
    category: 'Setup',
    duration: '0:00',
    videoPath: '/videos/tutorials/wallet.mp4',
  },
];

export function useTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>(FALLBACK);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(() => {
    try {
      if (typeof window === 'undefined') return new Set();
      const stored = localStorage.getItem('completedTutorials');
      if (!stored) return new Set();
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  // Save completed tutorials to localStorage whenever it changes
  useEffect(() => {
    if (completedTutorials.size > 0) {
      localStorage.setItem('completedTutorials', JSON.stringify([...completedTutorials]));
    }
  }, [completedTutorials]);

  const selectTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const markComplete = (tutorialId: string) => {
    setCompletedTutorials((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tutorialId)) {
        newSet.delete(tutorialId);
      } else {
        newSet.add(tutorialId);
      }
      return newSet;
    });
  };

  const getVideoDuration = async (src: string): Promise<number> => {
    return new Promise((resolve) => {
      const v = document.createElement('video');
      const done = (n: number) => {
        try {
          v.src = '';
          v.load();
        } catch {}
        resolve(n);
      };
      v.preload = 'metadata';
      v.onloadedmetadata = () => {
        const d = Number.isFinite(v.duration) ? v.duration : 0;
        done(d);
      };
      v.onerror = () => done(0);
      v.src = src;
    });
  };

  const fmt = (seconds: number): string => {
    const s = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/tutorials', { cache: 'no-store' });
        if (!res.ok) return;
        const base = (await res.json()) as Tutorial[];
        if (!cancelled && Array.isArray(base) && base.length > 0) {
          const withDur = await Promise.all(
            base.map(async (t) => ({ ...t, duration: fmt(await getVideoDuration(t.videoPath)) }))
          );
          setTutorials(withDur);
          if (!selectedTutorial) {
            setSelectedTutorial(withDur[0]);
          }
        }
      } catch {}
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedTutorial]);

  return {
    tutorials,
    selectedTutorial,
    completedTutorials,
    selectTutorial,
    markComplete,
  };
}
