# ⚡ Quick Start Guide - DocuMind AI

## 🚀 5 Phút để Chạy Được!

### Bước 1: Clone & Install (2 phút)

```bash
git clone <your-repo-url>
cd documind-ai
npm install
```

### Bước 2: Setup Environment Variables (1 phút)

```bash
# Copy example file
cp .env.example .env.local
```

**Minimum để chạy được:**
```env
# Clerk (Free tier - clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Supabase (Free tier - supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (platform.openai.com - cần credit card)
OPENAI_API_KEY=sk-...

# Pinecone (Free tier - pinecone.io)
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=documind-vectors
```

**Optional (có thể setup sau):**
- Stripe (payments)
- Upstash Redis (rate limiting)
- Resend (emails)
- PostHog (analytics)

### Bước 3: Setup Supabase Database (1 phút)

1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung `supabase_schema.sql`
3. Paste và Run
4. Done! ✅

### Bước 4: Setup Pinecone Index (1 phút)

1. Vào Pinecone Dashboard → Indexes
2. Create new index:
   - Name: `documind-vectors`
   - Dimensions: `1536`
   - Metric: `cosine`
3. Done! ✅

### Bước 5: Run! 🎉

```bash
npm run dev
```

Mở http://localhost:3000

---

## ✅ Test Nhanh

### 1. Sign Up
- Click "Sign In" → "Sign Up"
- Đăng ký với email

### 2. Upload Document
- Vào Dashboard
- Click "Upload Document"
- Chọn file PDF test

### 3. Ask Question
- Nhập câu hỏi: "What is this document about?"
- Click "Search"
- Xem AI trả lời!

---

## 🎯 What Works Without Optional Services?

| Feature | Works? | Need |
|---------|--------|------|
| Sign up/in | ✅ | Clerk |
| Upload docs | ✅ | OpenAI + Pinecone |
| AI search | ✅ | OpenAI + Pinecone |
| View docs | ✅ | Supabase |
| Payments | ❌ | Need Stripe |
| Emails | ❌ | Need Resend |
| Rate limiting | ⚠️ | Works but no Redis |
| Analytics | ⚠️ | Works but no PostHog |

---

## 🔧 Troubleshooting

### Error: Clerk keys missing
```bash
# Get keys from clerk.com
# Copy to .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Error: Supabase connection failed
```bash
# Check URL and keys are correct
# Run supabase_schema.sql in SQL Editor
```

### Error: Pinecone index not found
```bash
# Create index in Pinecone Dashboard
# Name MUST match PINECONE_INDEX_NAME in .env.local
```

### Error: OpenAI API error
```bash
# Check API key is valid
# Check you have credits
# Visit platform.openai.com/account/billing
```

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Clerk | 10k MAU | $25/mo |
| Supabase | 500MB, 2GB transfer | $25/mo |
| Pinecone | 1 index, 100k vectors | $70/mo |
| OpenAI | $5 credit (new users) | Pay per use |
| Vercel | 100GB bandwidth | $20/mo |
| **Total** | **~$0-5** first month | **~$140/mo** after |

**Tip:** Dùng free tier để develop và test, nâng cấp khi có users!

---

## 🎓 Learning Path

### Day 1: Basic Setup
- [x] Install dependencies
- [x] Setup Clerk authentication
- [x] Setup Supabase database
- [ ] Test sign up/login

### Day 2: AI Features
- [ ] Setup OpenAI API
- [ ] Setup Pinecone
- [ ] Test document upload
- [ ] Test AI search

### Day 3: Payments
- [ ] Setup Stripe
- [ ] Test checkout flow
- [ ] Configure webhooks

### Day 4: Deploy
- [ ] Deploy to Vercel
- [ ] Setup custom domain
- [ ] Configure Cloudflare
- [ ] Test production

### Day 5: Go Live!
- [ ] Switch to production mode
- [ ] Launch on Product Hunt
- [ ] Share on social media

---

## 📚 Next Steps

After running locally:
1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed dev guide
2. Read [SETUP.md](./SETUP.md) for all services setup
3. Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
4. Read [API.md](./API.md) for API reference

---

## 🆘 Need Help?

- 📖 Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- 💬 Open GitHub Issue
- 📧 Email: support@documind.ai

---

## 🎉 You're Ready!

```bash
npm run dev
```

Visit http://localhost:3000 and start building! 🚀
