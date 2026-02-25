'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    
    if (typeof window !== 'undefined' && posthogKey && !posthogKey.includes('placeholder')) {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Helper functions for tracking events
export function trackEvent(
  event: string,
  properties?: Record<string, any>
) {
  posthog.capture(event, properties);
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog.identify(userId, properties);
}
