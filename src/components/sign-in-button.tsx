'use client';

import { SignInButton as ClerkSignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode } from 'react';

export function SignInButton({ 
  mode = 'redirect',
  children 
}: { 
  mode?: 'redirect' | 'modal';
  children: ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If no valid Clerk key, fallback to redirect link
  if (!publishableKey || publishableKey.includes('placeholder')) {
    return <Link href="/sign-in">{children}</Link>;
  }
  
  return <ClerkSignInButton mode={mode}>{children}</ClerkSignInButton>;
}
