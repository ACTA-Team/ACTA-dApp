'use client';

import { useState } from 'react';
import type { Tutorial } from '@/@types/tutorials';

export function useTutorials() {
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'How to Use Your Wallet',
      description:
        'Learn the basics of managing your digital wallet, sending and receiving transactions, and keeping your assets secure.',
      videoPath: '/videos/tutorials/wallet.mp4',
      duration: '0:09',
      category: 'Getting Started',
    },
  ];

  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());

  const selectTutorial = (t: Tutorial) => setSelectedTutorial(t);
  const markComplete = (tutorialId: string) => {
    setCompletedTutorials((prev) => {
      const next = new Set(prev);
      if (next.has(tutorialId)) next.delete(tutorialId);
      else next.add(tutorialId);
      return next;
    });
  };

  return { tutorials, selectedTutorial, completedTutorials, selectTutorial, markComplete };
}
