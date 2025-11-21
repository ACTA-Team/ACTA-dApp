'use client';
import { HeaderHome } from '@/layouts/header/Header';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export default function GlobalHeaderHost() {
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith('/dashboard');
  const isHome = pathname === '/' || pathname === undefined || pathname === null;
  const isMobile = useIsMobile();
  if (isMobile) return null;
  if (inDashboard) return null;
  if (isHome) return null;
  return <HeaderHome />;
}
