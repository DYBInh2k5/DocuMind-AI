/**
 * Build-time configuration check
 * This file helps the build succeed even without all API keys
 */

export const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

export const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

export const hasSupabaseKeys = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const hasStripeKeys = Boolean(
  process.env.STRIPE_SECRET_KEY
);

export const hasOpenAIKey = Boolean(
  process.env.OPENAI_API_KEY
);

export const hasPineconeKeys = Boolean(
  process.env.PINECONE_API_KEY
);

// Warn about missing keys in development
if (process.env.NODE_ENV === 'development' && !isBuildTime) {
  const missing = [];
  
  if (!hasClerkKeys) missing.push('Clerk (auth)');
  if (!hasSupabaseKeys) missing.push('Supabase (database)');
  if (!hasOpenAIKey) missing.push('OpenAI (AI)');
  if (!hasPineconeKeys) missing.push('Pinecone (vector DB)');
  
  if (missing.length > 0) {
    console.warn('\n⚠️  Missing API keys for:', missing.join(', '));
    console.warn('📝 See QUICKSTART.md for setup instructions\n');
  }
}
