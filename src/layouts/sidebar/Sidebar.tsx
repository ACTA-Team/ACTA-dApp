import { useRouter } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/aceternity-sidebar';
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
  const links = [
    {
      label: 'ACTA',
      href: '/dashboard',
      icon: (
        <img
          src="/logo.png"
          alt="ACTA"
          className="h-6 w-6 shrink-0 rounded"
          width={24}
          height={24}
        />
      ),
    },
    {
      label: 'Home',
      href: '/dashboard',
      icon: <IconHome className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: 'Issue',
      href: '/dashboard/issue',
      icon: <IconUpload className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: 'Authorize',
      href: '/dashboard/authorize',
      icon: <IconId className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: 'Vault',
      href: '/dashboard/credentials',
      icon: <IconLock className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: 'Tutorials',
      href: '/dashboard/tutorials',
      icon: <IconPlayerPlay className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
  ];
  return (
    <Sidebar animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="mt-2 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: 'Settings',
              href: '#',
              icon: <IconUser className="h-5 w-5 shrink-0 text-neutral-200" />,
              onClick: () => {
                try {
                  window.dispatchEvent(new CustomEvent('open-settings'));
                } catch {
                  router.push('/settings');
                }
              },
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
