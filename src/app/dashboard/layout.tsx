import DashboardLayoutClient from '@/layouts/client/Client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
