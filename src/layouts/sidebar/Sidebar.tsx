'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  IconHome,
  IconId,
  IconUpload,
  IconArrowLeft,
  IconUser,
  IconPlayerPlay,
  IconLock,
} from '@tabler/icons-react';

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {}, [pathname]);
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="px-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
            aria-label="Back"
          >
            <IconArrowLeft className="size-5" />
          </button>
        </div>
        <SidebarSeparator className="my-3" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="flex flex-col items-center gap-5 pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Home"
                href="/dashboard"
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconHome className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Issue"
                href="/dashboard/issue"
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconUpload className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Issue</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Credentials"
                href="/dashboard/credentials"
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconId className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Credentials</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Tutorials"
                href="/dashboard/tutorials"
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconPlayerPlay className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tutorials</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label="Vault"
                href="/dashboard/credentials"
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconLock className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Vault</TooltipContent>
          </Tooltip>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 pb-2 mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Settings"
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('open-settings'));
                  } catch {
                    router.push('/settings');
                  }
                }}
                className="size-12 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-white grid place-items-center"
              >
                <IconUser className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
