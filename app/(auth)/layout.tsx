import type { ReactNode } from 'react';

export const runtime = 'nodejs';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-6 py-12 text-[#d9d9d9]">
      <div className="w-full max-w-md border border-[#2a2a2a] bg-[#151515] p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
