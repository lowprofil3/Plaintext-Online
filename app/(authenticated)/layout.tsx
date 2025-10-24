import Link from 'next/link';
import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Market', href: '/market' },
  { name: 'Assets', href: '/assets' },
  { name: 'Messages', href: '/messages' },
  { name: 'Wiki', href: '/wiki' },
  { name: 'Settings', href: '/settings' },
];

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111111] text-[#d9d9d9]">
      <Sidebar />
      <main className="flex-1 pb-12 pt-4 md:pl-[220px] md:pr-12">
        <nav className="flex gap-3 overflow-x-auto border-b border-[#2a2a2a] px-6 pb-4 text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a] md:hidden">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="whitespace-nowrap border border-transparent px-3 py-2">
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-6 md:px-0">{children}</div>
      </main>
    </div>
  );
}
