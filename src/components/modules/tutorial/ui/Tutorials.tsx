'use client';

import { Button } from '@/components/ui/button';
import { Play, Clock, CheckCircle2 } from 'lucide-react';
import { useTutorials } from '../hooks/useTutorials';

export default function Tutorials() {
  const { tutorials, selectedTutorial, completedTutorials, selectTutorial, markComplete } =
    useTutorials();

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#edeed1]/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Video Tutorials</h1>
                <p className="text-base text-white/50 mt-1">Learn how to use the platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-[#edeed1]/20 px-5 py-3 shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span className="text-white font-medium">
                {completedTutorials.size} of {tutorials.length} completed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-[#edeed1]/20 bg-white/5 backdrop-blur-xl shadow-2xl">
              {selectedTutorial ? (
                <div className="space-y-0">
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <video
                      key={selectedTutorial.videoPath}
                      controls
                      className="h-full w-full"
                      controlsList="nodownload"
                    >
                      <source src={selectedTutorial.videoPath} type="video/mp4" />
                      <track kind="captions" srcLang="en" src="/videos/tutorials/captions.vtt" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="space-y-6 p-8 bg-gradient-to-b from-black/40 to-black/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3 inline-block rounded-full bg-white/10 backdrop-blur-sm border border-[#edeed1]/30 px-4 py-1.5 text-sm font-medium text-white">
                          {selectedTutorial.category}
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                          {selectedTutorial.title}
                        </h2>
                        <p className="mt-3 text-base text-white/60 leading-relaxed">
                          {selectedTutorial.description}
                        </p>
                      </div>
                      <Button
                        onClick={() => markComplete(selectedTutorial.id)}
                        className={`shrink-0 gap-2 rounded-xl px-6 py-6 font-semibold transition-all duration-300 ${
                          completedTutorials.has(selectedTutorial.id)
                            ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/20'
                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        {completedTutorials.has(selectedTutorial.id)
                          ? 'Completed'
                          : 'Mark Complete'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTutorial.duration}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
                      <Play className="h-10 w-10 text-white/40" />
                    </div>
                    <p className="text-lg text-white/50">Select a tutorial to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-bold text-white tracking-tight">Available Tutorials</h3>
            <div className="space-y-3">
              {tutorials.map((tutorial) => (
                <button
                  key={tutorial.id}
                  onClick={() => selectTutorial(tutorial)}
                  className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    selectedTutorial?.id === tutorial.id
                      ? 'border-white/30 bg-white/10 backdrop-blur-sm shadow-lg shadow-white/5'
                      : 'border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[#edeed1]/10 blur-3xl" />

                  <div className="relative p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/10 backdrop-blur-sm border border-[#edeed1]/30 px-3 py-1 text-xs font-medium text-white">
                        {tutorial.category}
                      </span>
                      {completedTutorials.has(tutorial.id) && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="mb-2 font-bold text-white group-hover:text-white/90 transition-colors">
                      {tutorial.title}
                    </h4>
                    <p className="mb-4 line-clamp-2 text-sm text-white/50 leading-relaxed">
                      {tutorial.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-[#edeed1]/20 group-hover:bg-[#edeed1]/10 transition-colors">
                        <Play className="h-3.5 w-3.5 text-white/60" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
