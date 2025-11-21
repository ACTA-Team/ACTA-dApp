'use client';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function Sidebar({
  open,
  setOpen,
  children,
  animate = false,
  className,
}: {
  open?: boolean;
  setOpen?: (o: boolean) => void;
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 flex h-screen w-16 flex-col items-center border-r border-neutral-800 bg-neutral-900',
        animate ? 'transition-all duration-300 ease-out' : '',
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex flex-1 flex-col items-center gap-5', className)}>{children}</div>;
}

export function SidebarLink({
  link,
}: {
  link: { label: string; href: string; icon?: React.ReactNode; onClick?: () => void };
}) {
  const pill = (
    <div
      className={cn(
        'size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center'
      )}
    >
      {link.icon}
    </div>
  );
  if (link.onClick) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={link.onClick} aria-label={link.label} className="">
            {pill}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="px-2 py-1 rounded-md bg-white text-black shadow-lg">
          {link.label}
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={link.href} aria-label={link.label} className="block">
          {pill}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="px-2 py-1 rounded-md bg-white text-black shadow-lg">
        {link.label}
      </TooltipContent>
    </Tooltip>
  );
}
