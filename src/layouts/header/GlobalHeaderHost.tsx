'use client';
import { HeaderHome } from '@/layouts/header/Header';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export default function GlobalHeaderHost() {
  const pathname = usePathname();
  const inDashboard = pathname?.startsWith('/dashboard');
  const isMobile = useIsMobile();
  if (isMobile) return null;
  if (inDashboard) return null;
  return <HeaderHome />;
}
