
// This page has been moved to /dadmin/developer/tests
// The content is now managed there. This file can be removed in a future cleanup task.
"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Page() {
  useEffect(() => {
    redirect('/dadmin/developer/tests');
  }, []);
  
  return null;
}
