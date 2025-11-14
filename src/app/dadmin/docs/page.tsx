// This page has been moved to /dadmin/developer/docs
// The content is now managed there. This file can be removed in a future cleanup task.
// We are redirecting via a client component to avoid build errors with server-side redirects in this context.
"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Page() {
  useEffect(() => {
    redirect('/dadmin/developer/docs');
  }, []);
  
  return null;
}
