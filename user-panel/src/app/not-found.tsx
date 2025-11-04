'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Custom404() {
  const router = useRouter();

  // Redirect to homepage immediately
  useEffect(() => {
    router.replace('/');
  }, [router]);

  // Return null or a minimal loading state while redirecting
  return null;
}