"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Market', href: '/market' },
  { name: 'Assets', href: '/assets' },
  { name: 'Messages', href: '/messages' },
  { name: 'Wiki', href: '/wiki' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 hidden w-[220px] flex-col border-r border-[#2a2a2a] bg-[#111111] px-6 py-8 md:flex">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">PlainText Online</p>
        <p className="text-xs font-light uppercase tracking-[0.35em] text-[#d9d9d9]">Operations Directory</p>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a9a9a]">Simplicity is the interface.</p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-3 text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a]">
        {links.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const baseClass = 'rounded border border-transparent px-3 py-2 transition-colors';
          const activeClass = isActive
            ? 'border-[#2a2a2a] bg-[#151515] text-[#d9d9d9]'
            : 'hover:border-[#2a2a2a] hover:bg-[#151515] hover:text-[#d9d9d9]';

          return (
            <Link key={item.name} href={item.href} className={`${baseClass} ${activeClass}`}>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
