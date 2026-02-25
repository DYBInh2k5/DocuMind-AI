# 💻 Development Guide - DocuMind AI

## 🏗️ Project Structure

```
documind-ai/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── checkout/         # Stripe checkout session
│   │   │   ├── documents/
│   │   │   │   └── upload/       # Document upload & processing
│   │   │   ├── search/           # AI semantic search
│   │   │   └── webhooks/
│   │   │       ├── clerk/        # Clerk user events
│   │   │       └── stripe/       # Stripe payment events
│   │   ├── dashboard/            # Protected dashboard page
│   │   ├── pricing/              # Public pricing page
│   │   ├── sign-in/              # Clerk sign-in
│   │   ├── sign-up/              # Clerk sign-up
│   │   ├── layout.tsx            # Root layout với Clerk & PostHog
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   ├── lib/                      # Shared utilities
│   │   ├── supabase.ts           # Supabase client & admin
│   │   ├── stripe.ts             # Stripe client & plans config
│   │   ├── pinecone.ts           # Pinecone vector DB & embeddings
│   │   ├── redis.ts              # Upstash Redis & rate limiting
│   │   ├── openai.ts             # OpenAI API wrapper
│   │   ├── resend.ts             # Email sending functions
│   │   └── posthog.tsx           # PostHog analytics provider
│   ├── types/
│   │   └── database.ts           # TypeScript types for Supabase
│   └── middleware.ts             # Clerk authentication middleware
├── supabase_schema.sql           # Database schema & RLS policies
├── .env.local                    # Local environment variables
├── .env.example                  # Example env vars
└── README.md                     # Project documentation
```

## 🔄 Data Flow

### Document Upload Flow
```
User uploads file → /api/documents/upload
  ↓
1. Rate limit check (Redis)
2. File type validation
3. Extract text (PDF/DOCX/TXT)
4. Generate AI summary (OpenAI)
5. Save to Supabase
6. Create embeddings (OpenAI)
7. Store vectors (Pinecone)
8. Track event (PostHog)
  ↓
Return document metadata
```

### AI Search Flow
```
User asks question → /api/search
  ↓
1. Rate limit check (Redis)
2. Generate query embedding (OpenAI)
3. Vector search (Pinecone)
4. Fetch document content (Supabase)
5. Generate answer (OpenAI GPT-4)
6. Save query history (Supabase)
7. Track event (PostHog)
  ↓
Return answer + sources
```

### Payment Flow
```
User clicks upgrade → /api/checkout
  ↓
1. Create Stripe checkout session
2. Redirect to Stripe
  ↓
User completes payment
  ↓
Stripe webhook → /api/webhooks/stripe
  ↓
1. Verify webhook signature
2. Update user plan (Supabase)
3. Send confirmation email (Resend)
4. Track conversion (PostHog)
```

## 🛠️ Development Workflow

### Start Development Server

```bash
npm run dev
```

Server chạy tại: http://localhost:3000

### API Routes Testing

#### Upload Document
```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -F "file=@test.pdf"
```

#### Search Documents
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this document about?"}'
```

#### Create Checkout Session
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "PRO"}'
```

### Database Development

#### Run Schema Changes
```bash
# In Supabase SQL Editor
# Copy and run SQL from supabase_schema.sql
```

#### Generate TypeScript Types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

### Testing Webhooks Locally

#### Clerk Webhooks với ngrok
```bash
# Install ngrok
npm i -g ngrok

# Start ngrok
ngrok http 3000

# Copy URL (e.g., https://abc123.ngrok.io)
# Add webhook in Clerk Dashboard: https://abc123.ngrok.io/api/webhooks/clerk
```

#### Stripe Webhooks với Stripe CLI
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook secret to .env.local
```

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Sign out
- [ ] Protected routes redirect to sign-in

#### Documents
- [ ] Upload PDF
- [ ] Upload DOCX
- [ ] Upload TXT
- [ ] View document list
- [ ] View document summary

#### AI Search
- [ ] Ask question about uploaded document
- [ ] View sources
- [ ] Check rate limiting

#### Payments
- [ ] View pricing page
- [ ] Click upgrade (use test card: 4242 4242 4242 4242)
- [ ] Check plan updated
- [ ] Receive confirmation email

#### Webhooks
- [ ] Clerk user.created fires
- [ ] Welcome email sent
- [ ] Stripe checkout.session.completed fires
- [ ] Plan updated in database

### Stripe Test Cards

```
# Success
4242 4242 4242 4242

# Declined
4000 0000 0000 0002

# 3D Secure
4000 0027 6000 3184
```

## 🐛 Debugging

### Check Logs

```bash
# Vercel logs (if deployed)
vercel logs

# Or check browser console & Network tab
```

### Common Issues

#### Upload fails
```typescript
// Check in /api/documents/upload/route.ts
console.log('File size:', file.size);
console.log('File type:', file.type);
console.log('User plan:', user.plan);
```

#### Search returns no results
```typescript
// Check in /api/search/route.ts
console.log('Query:', query);
console.log('Matches:', results);
console.log('Documents:', documents);
```

#### Webhook not firing
- Check webhook URL is correct
- Verify webhook secret matches
- Check request headers in webhook handler
- View webhook logs in service dashboard

### Database Queries

```typescript
// Get user with documents count
const { data, error } = await supabaseAdmin
  .from('users')
  .select(`
    *,
    documents (count)
  `)
  .eq('clerk_id', userId)
  .single();

// Get recent queries
const { data: queries } = await supabaseAdmin
  .from('queries')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .limit(10);
```

## 📊 Monitoring in Development

### PostHog Events

```typescript
import { trackEvent } from '@/lib/posthog';

// Track custom events
trackEvent('document_uploaded', {
  fileType: file.type,
  fileSize: file.size,
  userId: user.id,
});

trackEvent('search_performed', {
  query: query,
  resultsCount: results.length,
  userId: user.id,
});
```

### Sentry Errors

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'document-upload',
    },
    user: {
      id: userId,
    },
  });
}
```

## 🔧 Adding New Features

### Add New API Route

1. Create file: `src/app/api/your-feature/route.ts`
2. Implement handler:
```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here
  
  return NextResponse.json({ success: true });
}
```

### Add New Database Table

1. Write SQL in `supabase_schema.sql`:
```sql
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can read own data" ON your_table
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));
```

2. Run SQL in Supabase Dashboard
3. Update TypeScript types

### Add New Email Template

In `src/lib/resend.ts`:
```typescript
export async function sendYourEmail(email: string, data: any) {
  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Your Subject',
    html: `<h1>Your HTML</h1>`,
  });
}
```

## 📦 Build & Deploy

### Local Build Test
```bash
npm run build
npm start
```

### Production Build
```bash
# Automatically runs on Vercel when pushing to main
git push origin main
```

## 🔐 Security Best Practices

1. **Never commit secrets** - Use `.env.local` locally, Vercel env vars in production
2. **Validate all inputs** - Check file types, sizes, user permissions
3. **Use RLS in Supabase** - Row-level security prevents unauthorized access
4. **Rate limit APIs** - Prevent abuse with Redis rate limiting
5. **Verify webhooks** - Always check signature before processing
6. **Sanitize user input** - Prevent XSS and injection attacks

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Pinecone Docs](https://docs.pinecone.io)
- [OpenAI Docs](https://platform.openai.com/docs)

## 💬 Get Help

- GitHub Issues: Open issue with detailed description
- Discord: [Join our community]
- Email: dev@documind.ai
