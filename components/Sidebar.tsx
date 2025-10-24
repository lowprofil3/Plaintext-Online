import Link from 'next/link';

const links = [
  { name: 'Dashboard', href: '#' },
  { name: 'Jobs', href: '#' },
  { name: 'Market', href: '#' },
  { name: 'Assets', href: '#' },
  { name: 'Messages', href: '#' },
  { name: 'Wiki', href: '#' },
  { name: 'Settings', href: '#' },
];

export default function Sidebar() {
  return (
    <aside className="border-b border-[#2a2a2a] bg-[#111111] md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-6 md:block">
        <div>
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#9a9a9a]">PlainText Online</p>
          <p className="mt-2 text-xs font-light uppercase tracking-[0.35em] text-[#d9d9d9]">Directory</p>
        </div>
        <p className="hidden text-[11px] uppercase tracking-[0.3em] text-[#9a9a9a] md:mt-6 md:block">
          Simplicity is the interface.
        </p>
      </div>
      <nav className="flex gap-6 overflow-x-auto px-5 pb-4 text-[11px] uppercase tracking-[0.35em] text-[#9a9a9a] md:flex-1 md:flex-col md:gap-4 md:overflow-visible md:pb-8">
        {links.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className={`whitespace-nowrap transition-colors ${
              index === 0 ? 'text-[#d9d9d9]' : ''
            } hover:text-[#d9d9d9] hover:underline focus-visible:text-[#d9d9d9] focus-visible:underline`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
