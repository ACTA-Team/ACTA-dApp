'use client';

import { Button } from '@/components/ui/button';
import { Play, Clock, CheckCircle2 } from 'lucide-react';
import { useTutorials } from '../hooks/useTutorials';

export default function Tutorials() {
  const { tutorials, selectedTutorial, completedTutorials, selectTutorial, markComplete } =
    useTutorials();

  return (
    <div className="min-h-screen">
      <div className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Video Tutorials</h1>
                <p className="text-sm text-gray-500">Learn how to use the platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400">
                {completedTutorials.size} of {tutorials.length} completed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-950 shadow-2xl">
              {selectedTutorial ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <video
                      key={selectedTutorial.videoPath}
                      controls
                      className="h-full w-full"
                      controlsList="nodownload"
                    >
                      <source src={selectedTutorial.videoPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                          {selectedTutorial.category}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{selectedTutorial.title}</h2>
                        <p className="mt-2 text-gray-500">{selectedTutorial.description}</p>
                      </div>
                      <Button
                        onClick={() => markComplete(selectedTutorial.id)}
                        className={`shrink-0 gap-2 ${
                          completedTutorials.has(selectedTutorial.id)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {completedTutorials.has(selectedTutorial.id)
                          ? 'Completed'
                          : 'Mark Complete'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTutorial.duration}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black">
                  <div className="text-center">
                    <Play className="mx-auto h-16 w-16 text-gray-700" />
                    <p className="mt-4 text-gray-500">Select a tutorial to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Available Tutorials</h3>
            <div className="space-y-3">
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial.id}
                  onClick={() => selectTutorial(tutorial)}
                  className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all ${
                    selectedTutorial?.id === tutorial.id
                      ? 'border-blue-500/50 bg-gray-950'
                      : 'border-gray-800/50 bg-gray-950 hover:border-gray-700'
                  }`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/5 blur-2xl" />

                  <div className="relative p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                        {tutorial.category}
                      </span>
                      {completedTutorials.has(tutorial.id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <h4 className="mb-1 font-semibold text-white group-hover:text-blue-400">
                      {tutorial.title}
                    </h4>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <Play className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}

              <div className="rounded-xl border border-dashed border-gray-800/50 bg-gray-950/50 p-6 text-center">
                <p className="text-sm text-gray-700">More tutorials coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
