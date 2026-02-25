#!/usr/bin/env node

/**
 * Setup script for DocuMind AI
 * Creates .env.local with placeholder values if it doesn't exist
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('🚀 DocuMind AI Setup\n');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
  console.log('   To reset, delete .env.local and run this script again\n');
  process.exit(0);
}

// Read .env.example
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example not found');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Generate placeholder .env.local
const placeholderEnv = `# Auto-generated .env.local
# Replace these placeholder values with real API keys
# See QUICKSTART.md for setup instructions

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
CLERK_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder

# Stripe (Optional for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
STRIPE_PRICE_ID_FREE=price_placeholder
STRIPE_PRICE_ID_PRO=price_placeholder
STRIPE_PRICE_ID_ENTERPRISE=price_placeholder

# Upstash Redis (Optional for development)
UPSTASH_REDIS_REST_URL=https://placeholder.upstash.io
UPSTASH_REDIS_REST_TOKEN=placeholder

# Pinecone (Required for AI features)
PINECONE_API_KEY=placeholder
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=documind-vectors

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-placeholder

# Resend (Optional for development)
RESEND_API_KEY=re_placeholder
RESEND_FROM_EMAIL=noreply@example.com

# PostHog (Optional for development)
NEXT_PUBLIC_POSTHOG_KEY=phc_placeholder
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry (Optional for development)
SENTRY_AUTH_TOKEN=placeholder
SENTRY_DSN=https://placeholder@placeholder.ingest.sentry.io/placeholder
NEXT_PUBLIC_SENTRY_DSN=https://placeholder@placeholder.ingest.sentry.io/placeholder

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

fs.writeFileSync(envPath, placeholderEnv);

console.log('✅ Created .env.local with placeholder values\n');
console.log('📝 Next steps:');
console.log('   1. Edit .env.local and add your real API keys');
console.log('   2. See QUICKSTART.md for setup instructions');
console.log('   3. Run: npm run dev\n');
console.log('🔗 Get API keys from:');
console.log('   • Clerk: https://clerk.com');
console.log('   • Supabase: https://supabase.com');
console.log('   • Pinecone: https://pinecone.io');
console.log('   • OpenAI: https://platform.openai.com\n');
