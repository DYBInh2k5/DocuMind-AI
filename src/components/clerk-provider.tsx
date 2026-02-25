'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export function ClerkProvider({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // During build or if no valid key, render without Clerk
  if (!publishableKey || publishableKey.includes('placeholder')) {
    return <>{children}</>;
  }
  
  return <BaseClerkProvider>{children}</BaseClerkProvider>;
}
