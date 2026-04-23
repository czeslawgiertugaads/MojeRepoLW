'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error for maintenance
    console.error('Runtime error captured:', error);
    
    // Smoothly redirect to home
    router.replace('/');
  }, [error, router]);

  // Return null or a simple blank view while redirecting
  return (
    <html>
      <body style={{ background: 'white' }}></body>
    </html>
  );
}
