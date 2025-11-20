'use client';

import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useState } from 'react';

interface BalanceCardProps {
  balance: string;
  currency?: string;
  owner: string;
  variant?: 'blue' | 'dark';
  onRefresh?: () => void;
  title?: string;
}

export function BalanceCard({
  balance,
  currency = 'USD',
  owner,
  variant = 'blue',
  onRefresh,
  title = 'Balance',
}: BalanceCardProps) {
  const isDark = variant === 'dark';
  const [flipping, setFlipping] = useState(false);

  return (
    <Card
      className={`relative overflow-hidden border-0 ${
        isDark
          ? 'bg-linear-to-br from-slate-900 via-blue-900 to-cyan-900'
          : 'bg-linear-to-br from-blue-500 via-blue-600 to-blue-700'
      } p-8 text-white shadow-2xl transform-gpu ${flipping ? 'flip-y' : ''}
  w-full max-w-[460px]  
  h-[260px] sm:h-[280px] 
  rounded-2xl          
  mx-auto`}
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {isDark && (
          <>
            <div className="absolute inset-0 opacity-20">
              <svg
                viewBox="0 0 1200 600"
                className="h-full w-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M0,100 Q200,50 400,100 T800,100 T1200,100 L1200,250 Q1000,200 800,250 T400,250 T0,250 Z"
                  fill="rgba(255,255,255,0.3)"
                />
                <path
                  d="M0,300 Q200,250 400,300 T800,300 T1200,300 L1200,450 Q1000,400 800,450 T400,450 T0,450 Z"
                  fill="rgba(255,255,255,0.2)"
                />
              </svg>
            </div>
          </>
        )}

        {!isDark && (
          <div className="absolute inset-0 opacity-30">
            <svg
              viewBox="0 0 1200 600"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0,200 Q300,150 600,200 T1200,200 L1200,400 Q900,350 600,400 T0,400 Z"
                fill="rgba(255,255,255,0.1)"
              />
              <path
                d="M0,300 Q300,250 600,300 T1200,300 L1200,500 Q900,450 600,500 T0,500 Z"
                fill="rgba(255,255,255,0.15)"
              />
              <path
                d="M0,100 Q300,50 600,100 T1200,100 L1200,300 Q900,250 600,300 T0,300 Z"
                fill="rgba(255,255,255,0.05)"
              />
            </svg>
          </div>
        )}

        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-30">
          <Image src="/logo.png" alt="Logo" width={200} height={200} className="h-60 w-60" />
        </div>
      </div>

      <div className="relative z-10">
        <button
          onClick={() => {
            setFlipping(true);
            try {
              onRefresh?.();
            } finally {
              setTimeout(() => setFlipping(false), 600);
            }
          }}
          className="absolute right-0 top-0 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Refresh balance"
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        <div className="mb-20">
          <p className="mb-2 text-sm font-medium text-white/80">{title}</p>
          <p className="text-4xl font-bold tracking-tight">
            {currency === 'USD' && '$'}
            {balance}
            {currency && currency !== 'USD' && ` ${currency}`}
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-white/80">Owner</p>
          <p className="font-mono text-lg font-semibold tracking-wide" suppressHydrationWarning>
            {owner}
          </p>
        </div>
      </div>
    </Card>
  );
}
