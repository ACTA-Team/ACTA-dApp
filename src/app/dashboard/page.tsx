import type React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { FileText, PenTool } from 'lucide-react';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardHomePage() {
  return (
    <div className="p-4 md:p-6">
      <div className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your credentials and vault</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <Card className="w-full sm:w-1/2 border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-semibold text-white">Quick Start</h3>
            <ol className="space-y-2 text-1xl text-zinc-300">
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  1
                </span>
                <span>Connect your wallet and choose a network</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  2
                </span>
                <span>Create your personal vault</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  3
                </span>
                <span>Authorize wallets to issue credentials</span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  4
                </span>
                <span>Start issuing and managing credentials</span>
              </li>
            </ol>
          </Card>

          <div className="w-full sm:w-1/2 flex flex-col gap-4">
            <div className="flex-1">
              <ActionCard
                title="Issue"
                description="Create new credentials"
                href="/dashboard/issue"
                icon={<PenTool className="h-6 w-6" />}
              />
            </div>
            <div className="flex-1">
              <ActionCard
                title="My Credentials"
                description="View your credentials"
                href="/dashboard/credentials"
                icon={<FileText className="h-6 w-6" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/70">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>
        <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </Card>
    </Link>
  );
}
