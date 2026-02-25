import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '10 documents',
      '100 AI queries/month',
      'Basic search',
      'Email support',
    ],
    limits: {
      documents: 10,
      queries: 100,
    },
  },
  PRO: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      '1,000 documents',
      'Unlimited AI queries',
      'Advanced search',
      'Priority support',
      'Team sharing',
    ],
    limits: {
      documents: 1000,
      queries: Infinity,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: [
      'Unlimited documents',
      'Unlimited AI queries',
      'Advanced search',
      '24/7 support',
      'Team collaboration',
      'API access',
      'Custom integrations',
    ],
    limits: {
      documents: Infinity,
      queries: Infinity,
    },
  },
} as const;
