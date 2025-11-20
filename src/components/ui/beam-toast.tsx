'use client';

import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';

interface BeamToastProps {
  title: string;
  description?: string;
  className?: string;
}

export function BeamToast({ title, description, className }: BeamToastProps) {
  return (
    <div className={cn('relative rounded-md bg-black text-white px-4 py-3 shadow-lg', className)}>
      {/* Animated border using BorderBeam */}
      <BorderBeam colorFrom="#ffffff" colorTo="#ffffff" borderWidth={1} />

      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-neutral-300">{description}</div>}
      </div>
    </div>
  );
}
