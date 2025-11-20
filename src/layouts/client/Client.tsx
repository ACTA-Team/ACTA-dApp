'use client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/sidebar/Sidebar';
import { HeaderHome } from '@/layouts/header/Header';
import { VaultSidePanel } from '@/components/modules/vault/ui/VaultSidePanel';
import { SettingsOverlayHost } from '@/components/modules/settings/ui/SettingsOverlayHost';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TutorialModal from '@/components/modules/tutorial/ui/TutorialModal';
import { useWalletContext } from '@/providers/wallet.provider';
import { useVault } from '@/components/modules/vault/hooks/use-vault';
import { useNetwork } from '@/providers/network.provider';
import MobileBottomNav from '@/components/ui/mobile-bottom-nav';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DashboardLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useWalletContext();
  useVault();
  useNetwork();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [showVaultPanel, setShowVaultPanel] = useState<boolean>(pathname !== '/dashboard');
  const [tutorialClosed, setTutorialClosed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    const toggle = () => setShowVaultPanel((v) => !v);
    const open = () => setShowVaultPanel(true);
    const close = () => setShowVaultPanel(false);
    window.addEventListener('toggle-vault-panel', toggle as EventListener);
    window.addEventListener('open-vault-panel', open as EventListener);
    window.addEventListener('close-vault-panel', close as EventListener);
    return () => {
      window.removeEventListener('toggle-vault-panel', toggle as EventListener);
      window.removeEventListener('open-vault-panel', open as EventListener);
      window.removeEventListener('close-vault-panel', close as EventListener);
    };
  }, []);

  // Mark as mounted on client to avoid SSR/client mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/dashboard/tutorials') {
      setShowVaultPanel(false);
    } else {
      setShowVaultPanel(true);
    }
  }, [pathname]);

  useEffect(() => {
    const evt = new CustomEvent('vault-panel-state', {
      detail: { open: showVaultPanel },
    });
    window.dispatchEvent(evt);
  }, [showVaultPanel]);

  // Client-only: decide if tutorial should open using localStorage after mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const key = 'tutorial_shown_global';
      const seen = localStorage.getItem(key) === 'true';
      setTutorialOpen(!seen);
    } catch {
      setTutorialOpen(false);
    }
  }, [mounted]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SettingsOverlayHost />
        {mounted && (
          <TutorialModal
            open={tutorialOpen && !tutorialClosed}
            onClose={() => {
              try {
                const key = 'tutorial_shown_global';
                localStorage.setItem(key, 'true');
              } catch {}
              setTutorialClosed(true);
              setTutorialOpen(false);
            }}
          />
        )}
        <div className="p-4 md:p-6 pb-20 md:pb-6 flex flex-col md:flex-row gap-4 md:gap-6">
          <div
            className={
              `flex-none overflow-hidden transition-all duration-300 ease-out ` +
              (showVaultPanel
                ? 'h-auto w-full md:w-[360px] lg:w-[400px] xl:w-[440px] opacity-100'
                : 'h-0 md:h-auto w-0 opacity-0 pointer-events-none')
            }
          >
            <VaultSidePanel />
          </div>
          <div className="min-w-0 flex-1">
            {/* En móvil, ocultar Header en la sección de tutoriales del dashboard */}
            {!(isMobile && pathname?.startsWith('/dashboard/tutorials')) && <HeaderHome />}
            {children}
          </div>
        </div>
      </SidebarInset>
      {/* Bottom navigation for mobile */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
