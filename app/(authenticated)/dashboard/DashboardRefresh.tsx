'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
