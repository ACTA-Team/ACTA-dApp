'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import Image from 'next/image';
import type { CredentialCardProps } from '@/@types/credentials';

export function CredentialCard({
  name,
  category,
  wallet,
  url,
  onCopy,
  onShare,
}: CredentialCardProps) {
  return (
    <Card className="relative overflow-hidden bg-black border-[#edeed1]/40 min-h-[200px] w-full">
      <div className="relative flex flex-col p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <span className="px-3 py-1 rounded-full bg-[#edeed1]/10 backdrop-blur-sm border border-[#edeed1]/30 text-xs font-medium whitespace-nowrap text-[#edeed1]">
            {category}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Wallet Address</p>
          <div className="flex items-start gap-2">
            <p className="font-mono text-xs font-medium break-all flex-1 leading-relaxed">
              {wallet}
            </p>
            {onCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(wallet, 'Wallet')}
                className="h-8 w-8 p-0 hover:bg-[#edeed1]/10 text-[#edeed1] flex-shrink-0 border border-[#edeed1]/30 rounded-lg"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Credential Name</p>
            <p className="text-lg font-semibold truncate">{name}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline block truncate"
              >
                {new URL(url).hostname}
              </a>
            )}
          </div>
          {onShare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              title="Share"
              aria-label="Share"
              className="h-11 w-11 rounded-xl bg-[#edeed1]/10 border border-[#edeed1]/30 hover:bg-[#edeed1]/20 text-[#edeed1] flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
