# 🔑 Hướng Dẫn Lấy API Keys Chi Tiết

## Mục Lục
1. [Clerk - Authentication](#1-clerk---authentication)
2. [Supabase - Database](#2-supabase---database)
3. [OpenAI - AI](#3-openai---ai)
4. [Pinecone - Vector DB](#4-pinecone---vector-db)
5. [Stripe - Payments](#5-stripe---payments)
6. [Upstash Redis - Caching](#6-upstash-redis---caching)
7. [Resend - Email](#7-resend---email)
8. [PostHog - Analytics](#8-posthog---analytics)
9. [Sentry - Error Tracking](#9-sentry---error-tracking)
10. [GitHub - Source Control](#10-github---source-control)
11. [Vercel - Deployment](#11-vercel---deployment)
12. [Cloudflare - DNS/CDN](#12-cloudflare---dnscdn)

---

## 1. Clerk - Authentication

### Đăng ký và lấy keys (5 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://clerk.com
2. Click **"Start building for free"**
3. Đăng ký bằng GitHub hoặc Google (khuyến nghị)
4. Xác nhận email

#### Bước 2: Tạo Application
1. Sau khi đăng nhập, click **"+ Create application"**
2. Đặt tên: `DocuMind AI` (hoặc tên bạn thích)
3. Chọn authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)
4. Click **"Create application"**

#### Bước 3: Lấy API Keys
1. Sau khi tạo xong, bạn sẽ thấy màn hình **Quickstart**
2. Copy 2 keys này:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Hoặc tìm keys:**
- Sidebar → **API Keys**
- Copy **Publishable Key** và **Secret Key**

#### Bước 4: Setup Webhooks (cho production)
1. Sidebar → **Webhooks**
2. Click **"+ Add Endpoint"**
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/clerk`
4. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Click **"Create"**
6. Copy **Signing Secret**:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**💡 Tip:** Webhook chỉ cần khi deploy production, local dev không cần.

---

## 2. Supabase - Database

### Đăng ký và setup database (10 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://supabase.com
2. Click **"Start your project"**
3. Đăng ký bằng GitHub (khuyến nghị cho tích hợp dễ)
4. Authorize Supabase

#### Bước 2: Tạo Project
1. Click **"New project"**
2. Chọn Organization (hoặc tạo mới)
3. Điền thông tin:
   - **Name:** `documind-ai`
   - **Database Password:** Tạo mật khẩu mạnh (LƯU LẠI!)
   - **Region:** Chọn gần nhất (vd: `Southeast Asia (Singapore)`)
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Đợi 2-3 phút để provision

#### Bước 3: Lấy API Keys
1. Sidebar → **Settings** → **API**
2. Trong phần **Project API keys**, copy:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

3. Scroll xuống phần **Service role**, click **Reveal** và copy:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

**⚠️ Warning:** Service role key rất quan trọng, KHÔNG share công khai!

#### Bước 4: Setup Database Schema
1. Sidebar → **SQL Editor**
2. Click **"New query"**
3. Mở file `supabase_schema.sql` trong project
4. Copy toàn bộ nội dung
5. Paste vào SQL Editor
6. Click **"Run"** (hoặc Ctrl+Enter)
7. Chờ thực thi xong, sẽ thấy "Success"

**✅ Done!** Database đã có tables, indexes, và RLS policies.

---

## 3. OpenAI - AI

### Đăng ký và lấy API key (5 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://platform.openai.com
2. Click **"Sign up"**
3. Đăng ký bằng email hoặc Google
4. Xác nhận email và số điện thoại

#### Bước 2: Add Payment Method
1. Sidebar → **Settings** → **Billing**
2. Click **"Add payment method"**
3. Thêm credit card
4. Add credit: $5-10 (đủ để test)

**💰 Chi phí:**
- Text embeddings: $0.0001/1K tokens (~$0.10/1M tokens)
- GPT-4o-mini: $0.15/1M input tokens
- Ước tính: $5 = ~10,000 queries

#### Bước 3: Tạo API Key
1. Sidebar → **API keys**
2. Click **"+ Create new secret key"**
3. Đặt tên: `DocuMind AI`
4. Permissions: **All** (hoặc chỉ cần Read/Write)
5. Click **"Create secret key"**
6. **⚠️ QUAN TRỌNG:** Copy key NGAY (chỉ hiện 1 lần):

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

7. LƯU LẠI key này, không thể xem lại!

#### Bước 4: Set Usage Limits (khuyến nghị)
1. **Settings** → **Billing** → **Usage limits**
2. Set hard limit: $10/month (tránh surprise bill)
3. Set email notification: $5

---

## 4. Pinecone - Vector DB

### Đăng ký và tạo index (5 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://www.pinecone.io
2. Click **"Sign Up"**
3. Đăng ký bằng Google hoặc email
4. Chọn plan **Starter** (FREE)

#### Bước 2: Tạo Index
1. Sau khi đăng nhập → **Indexes** tab
2. Click **"Create Index"**
3. Điền thông tin:
   - **Name:** `documind-vectors`
   - **Dimensions:** `1536` (cho OpenAI text-embedding-3-small)
   - **Metric:** `cosine`
   - **Cloud:** `AWS`
   - **Region:** `us-east-1` (hoặc gần nhất)
4. Click **"Create Index"**
5. Đợi 1-2 phút để index active

#### Bước 3: Lấy API Key
1. Sidebar → **API Keys**
2. Bạn sẽ thấy **Default API Key**
3. Click **Copy** icon:

```env
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

4. Lấy environment:
   - Nhìn vào cột **Environment**
   - Copy environment name (vd: `us-east1-gcp` hoặc `us-east-1`)

```env
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=documind-vectors
```

**💡 Tip:** Free plan có giới hạn 1 index, 100K vectors.

---

## 5. Stripe - Payments

### Đăng ký và setup products (15 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://stripe.com
2. Click **"Sign up"**
3. Đăng ký bằng email
4. Xác nhận email

#### Bước 2: Activate Test Mode
1. Top-right corner → Toggle **"Test mode"** ON
2. Test mode cho phép test mà không cần card thật

#### Bước 3: Lấy API Keys
1. Sidebar → **Developers** → **API keys**
2. Copy 2 keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**⚠️ Lưu ý:** Dùng test keys, chuyển sang live keys khi production.

#### Bước 4: Tạo Products & Prices
1. Sidebar → **Product catalog** → **Products**
2. Click **"+ Add product"**

**Product 1: Pro Plan**
- **Name:** Pro Plan
- **Description:** 1,000 documents, unlimited queries
- **Pricing:**
  - **Type:** Recurring
  - **Price:** $19
  - **Billing period:** Monthly
- Click **"Save product"**
- Copy **Price ID** (bắt đầu bằng `price_`):

```env
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxx
```

**Product 2: Enterprise Plan**
- **Name:** Enterprise Plan
- **Description:** Unlimited documents and queries
- **Pricing:**
  - **Type:** Recurring
  - **Price:** $99
  - **Billing period:** Monthly
- Click **"Save product"**
- Copy **Price ID**:

```env
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxxxxxxxxxx
```

#### Bước 5: Setup Webhooks
1. **Developers** → **Webhooks**
2. Click **"+ Add endpoint"**
3. **Endpoint URL:** `https://your-domain.vercel.app/api/webhooks/stripe`
4. Click **"Select events"**
5. Chọn events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Click vào endpoint vừa tạo
8. Tab **"Signing secret"** → **Reveal**:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**💡 Tip:** Test webhooks local bằng Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 6. Upstash Redis - Caching

### Đăng ký và tạo database (3 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://upstash.com
2. Click **"Get Started"**
3. Đăng ký bằng GitHub/Google
4. Chọn plan **Free** (10K commands/day)

#### Bước 2: Tạo Redis Database
1. Click **"Create database"**
2. Điền thông tin:
   - **Name:** `documind-redis`
   - **Type:** Regional
   - **Region:** Chọn gần nhất
   - **TLS:** Enabled
3. Click **"Create"**

#### Bước 3: Lấy Connection Info
1. Click vào database vừa tạo
2. Tab **"Details"**
3. Scroll xuống phần **"REST API"**
4. Copy 2 giá trị:

```env
UPSTASH_REDIS_REST_URL=https://xxxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYxxxxxxxxxxxxxxxxx
```

**✅ Done!** Redis ready để dùng cho rate limiting.

---

## 7. Resend - Email

### Đăng ký và setup domain (10 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://resend.com
2. Click **"Sign Up"**
3. Đăng ký bằng GitHub/Google
4. Xác nhận email

#### Bước 2: Verify Domain
1. Sidebar → **Domains**
2. Click **"+ Add Domain"**
3. Nhập domain của bạn: `yourdomain.com`
4. Click **"Add"**

5. Copy DNS records và add vào domain provider:
   - **SPF record** (TXT)
   - **DKIM record** (TXT)
   - **DMARC record** (TXT)
6. Đợi verify (5-10 phút)

**💡 Tip cho testing:**
- Dùng email test: bạn sẽ thấy preview thay vì gửi thật
- Hoặc dùng subdomain: `mail.yourdomain.com`

#### Bước 3: Lấy API Key
1. Sidebar → **API Keys**
2. Click **"Create API Key"**
3. **Name:** `DocuMind AI`
4. **Permission:** Full Access
5. Click **"Create"**
6. Copy key:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**⚠️ Lưu ý:** Email phải từ domain đã verify.

**Không có domain?**
- Dùng test mode: emails không gửi thật
- Dùng subdomain của Vercel: `your-app.vercel.app`
- Mua domain rẻ: Namecheap, Porkbun (~$1-3/year)

---

## 8. PostHog - Analytics

### Đăng ký và setup project (5 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://posthog.com
2. Click **"Get started - free"**
3. Chọn **Cloud** (không cần self-host)
4. Đăng ký bằng email/GitHub
5. Xác nhận email

#### Bước 2: Tạo Organization & Project
1. Đặt tên Organization: `DocuMind AI`
2. Tên Project: `Production` (hoặc `Development`)
3. Chọn use case: **Product analytics**
4. Click **"Complete"**

#### Bước 3: Lấy Project Key
1. Bạn sẽ thấy setup wizard
2. Chọn **"Web"** → **"Next.js"**
3. Copy project key:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Hoặc tìm key:**
- Sidebar → **Project** → **Settings** → **Project API Key**

#### Bước 4: Verify Installation
1. Chạy `npm run dev`
2. Truy cập http://localhost:3000
3. Quay lại PostHog dashboard
4. Sidebar → **Activity** → **Live events**
5. Sẽ thấy events realtime nếu setup đúng

**📊 Events được track:**
- Page views
- Button clicks
- Document uploads
- Searches
- Sign ups

---

## 9. Sentry - Error Tracking

### ✅ Đã Setup Tự Động!

Sentry đã được setup bằng wizard. Bạn chỉ cần:

#### Bước 1: Verify Setup
1. Check file `.env.sentry-build-plugin` đã có
2. Check `sentry.server.config.ts` đã được tạo

#### Bước 2: Truy cập Dashboard
1. Truy cập: https://sentry.io
2. Đăng nhập (đã tạo account trong quá trình wizard)
3. Chọn project: `javascript-nextjs`

#### Bước 3: View Errors
- Sidebar → **Issues**
- Real-time error tracking
- Stack traces
- User context

**💡 Test thử:**
1. Truy cập: http://localhost:3000/sentry-example-page
2. Click nút test error
3. Xem error xuất hiện trong Sentry dashboard

**Keys đã có trong .env.local:**
```env
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

## 10. GitHub - Source Control

### Setup repository (5 phút)

#### Bước 1: Tạo Repository
1. Truy cập: https://github.com
2. Click **"+"** → **"New repository"**
3. Điền thông tin:
   - **Repository name:** `documind-ai`
   - **Description:** AI-powered document intelligence platform
   - **Visibility:** Private (khuyến nghị) hoặc Public
   - **❌ KHÔNG** chọn "Initialize with README" (đã có rồi)
4. Click **"Create repository"**

#### Bước 2: Push Code lên GitHub
```bash
cd d:\ffmm\documind-ai

# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: DocuMind AI"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/documind-ai.git

# Push
git branch -M main
git push -u origin main
```

#### Bước 3: Verify
- Refresh GitHub page
- Bạn sẽ thấy tất cả files đã được push
- ✅ Done!

**💡 Tips:**
- File `.gitignore` đã được tạo sẵn
- `.env.local` KHÔNG được commit (đã có trong .gitignore)
- Secrets an toàn

---

## 11. Vercel - Deployment

### Deploy project (10 phút)

#### Bước 1: Đăng ký tài khoản
1. Truy cập: https://vercel.com
2. Click **"Sign Up"**
3. Chọn **"Continue with GitHub"** (QUAN TRỌNG!)
4. Authorize Vercel

#### Bước 2: Import Project
1. Dashboard → Click **"Add New..."** → **"Project"**
2. Chọn repository: `documind-ai`
3. Click **"Import"**

#### Bước 3: Configure Project
1. **Framework Preset:** Next.js (auto-detect)
2. **Root Directory:** `./` (default)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `.next` (default)

#### Bước 4: Add Environment Variables
Click **"Environment Variables"** và thêm TẤT CẢ variables từ `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

STRIPE_SECRET_KEY=sk_live_xxxxx  (⚠️ Dùng LIVE key cho production!)
# ... tất cả các keys khác
```

**💡 Tips:**
- Copy từng key cẩn thận
- Production nên dùng **live keys**, không phải test keys
- Click **"Add"** sau mỗi variable

#### Bước 5: Deploy!
1. Click **"Deploy"**
2. Đợi 2-3 phút
3. Xem build logs realtime
4. ✅ Deploy thành công!

#### Bước 6: Get Domain
1. Sau khi deploy xong, copy domain:
   - `https://documind-ai.vercel.app`
2. Update trong `.env.local` và Vercel:
```env
NEXT_PUBLIC_APP_URL=https://documind-ai.vercel.app
```

#### Bước 7: Update Webhooks
Quay lại Clerk và Stripe, update webhook URLs:
- Clerk: `https://documind-ai.vercel.app/api/webhooks/clerk`
- Stripe: `https://documind-ai.vercel.app/api/webhooks/stripe`

---

## 12. Cloudflare - DNS/CDN

### Setup custom domain (15 phút)

#### Yêu cầu tiên quyết
- Có domain riêng (vd: `documind.ai`)
- Đã deploy lên Vercel

#### Bước 1: Add Domain to Cloudflare
1. Truy cập: https://dash.cloudflare.com
2. Đăng nhập hoặc Sign up
3. Click **"Add a Site"**
4. Nhập domain: `documind.ai`
5. Click **"Add site"**
6. Chọn plan **Free**
7. Click **"Continue"**

#### Bước 2: Update Nameservers
1. Cloudflare sẽ scan DNS records hiện tại
2. Click **"Continue"**
3. Bạn sẽ thấy 2 nameservers:
   ```
   nina.ns.cloudflare.com
   rick.ns.cloudflare.com
   ```

4. **Đi đến domain registrar** (GoDaddy, Namecheap, etc.)
5. Tìm **DNS Settings** hoặc **Nameservers**
6. Thay thế nameservers cũ bằng Cloudflare nameservers
7. **Save changes**
8. Quay lại Cloudflare, click **"Done, check nameservers"**

⏰ **Đợi:** Nameserver propagation mất 4-24 giờ (thường < 1 giờ)

#### Bước 3: Configure DNS Records
1. Trong Cloudflare → **DNS** → **Records**
2. Add CNAME record:
   - **Type:** CNAME
   - **Name:** `@` (cho root domain)
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** ✅ Proxied (orange cloud)
   - **TTL:** Auto
3. Click **"Save"**

4. (Optional) Add www subdomain:
   - **Type:** CNAME
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** ✅ Proxied
5. Click **"Save"**

#### Bước 4: Add Domain to Vercel
1. Vào Vercel project
2. **Settings** → **Domains**
3. Click **"Add"**
4. Nhập: `documind.ai`
5. Click **"Add"**
6. Vercel sẽ verify (1-2 phút)
7. Thêm `www.documind.ai` nếu muốn

#### Bước 5: SSL/TLS Settings
1. Cloudflare → **SSL/TLS** → **Overview**
2. Chọn **Full (strict)** ⚠️ QUAN TRỌNG
3. **SSL/TLS** → **Edge Certificates**
4. Enable:
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **Certificate Transparency Monitoring**

#### Bước 6: Performance Settings
1. **Speed** → **Optimization**
2. Enable:
   - ✅ **Auto Minify:** HTML, CSS, JavaScript
   - ✅ **Brotli**
3. Click **"Save"**

#### Bước 7: Security Settings
1. **Security** → **Settings**
2. **Security Level:** Medium
3. Enable **Bot Fight Mode** (Free)
4. **Firewall** → **Rules**
5. (Optional) Create rules to block spam

#### Bước 8: Caching
1. **Caching** → **Configuration**
2. **Browser Cache TTL:** 4 hours
3. **Always Online:** ✅ Enabled

#### Bước 9: Verify Setup
1. Truy cập: `https://documind.ai`
2. Check SSL (khóa xanh trong browser)
3. Test performance: https://www.webpagetest.org

**✅ Done!** Domain với Cloudflare CDN + security!

---

## 📋 Checklist Tổng Hợp

Copy checklist này để track:

### Essential (Required to Run)
- [ ] **Clerk** - Authentication
  - [ ] Publishable Key
  - [ ] Secret Key
  - [ ] Webhook Secret (production)
  
- [ ] **Supabase** - Database
  - [ ] URL
  - [ ] Anon Key
  - [ ] Service Role Key
  - [ ] Database schema executed
  
- [ ] **OpenAI** - AI
  - [ ] API Key
  - [ ] Payment method added
  
- [ ] **Pinecone** - Vector DB
  - [ ] API Key
  - [ ] Index created (documind-vectors)
  - [ ] Environment

### Optional (Can Setup Later)
- [ ] **Stripe** - Payments
  - [ ] Publishable Key
  - [ ] Secret Key
  - [ ] Products created
  - [ ] Price IDs
  - [ ] Webhook configured
  
- [ ] **Upstash Redis** - Caching
  - [ ] REST URL
  - [ ] REST Token
  
- [ ] **Resend** - Email
  - [ ] API Key
  - [ ] Domain verified
  
- [ ] **PostHog** - Analytics
  - [ ] Project Key
  
- [ ] **Sentry** - Error Tracking
  - [ ] Already configured ✅

### Deployment
- [ ] **GitHub** - Source control
  - [ ] Repository created
  - [ ] Code pushed
  
- [ ] **Vercel** - Hosting
  - [ ] Project imported
  - [ ] Environment variables added
  - [ ] Deployed successfully
  
- [ ] **Cloudflare** - DNS (if custom domain)
  - [ ] Domain added
  - [ ] Nameservers updated
  - [ ] DNS configured
  - [ ] SSL enabled

---

## 🚀 Quick Start Command

Sau khi có đủ keys, update `.env.local`:

```bash
# Open editor
code .env.local

# Paste your keys
# Save file

# Test local
npm run dev

# Visit http://localhost:3000
```

---

## 💰 Chi Phí Ước Tính

| Service | Free Tier | Paid (nếu vượt free) |
|---------|-----------|----------------------|
| Clerk | 10K MAU | $25/mo |
| Supabase | 500MB DB, 2GB transfer | $25/mo |
| OpenAI | $5 credit (new) | Pay per use |
| Pinecone | 1 index, 100K vectors | $70/mo |
| Stripe | Unlimited | 2.9% + $0.30/transaction |
| Upstash | 10K commands/day | $0.2/100K commands |
| Resend | 3K emails/mo | $20/mo for 50K |
| PostHog | 1M events/mo | $0.00031/event |
| Sentry | 5K errors/mo | $26/mo |
| GitHub | Unlimited public/private | Free |
| Vercel | 100GB bandwidth | $20/mo |
| Cloudflare | Unlimited bandwidth | Free |

**Tổng Free Tier:** Đủ để chạy và test với ~100 users

**Khi scale (1000 users):** ~$100-150/month

---

## 🆘 Troubleshooting

### Không verify được domain (Resend/Cloudflare)?
- Đợi thêm 30 phút cho DNS propagate
- Check DNS records đúng chưa: https://mxtoolbox.com
- Clear DNS cache: `ipconfig /flushdns` (Windows)

### Stripe webhook không hoạt động?
- Check URL có đúng không
- Check webhook secret đúng không
- Test với Stripe CLI local
- Xem logs trong Stripe Dashboard → Webhooks

### Build fail trên Vercel?
- Check environment variables đã add đủ chưa
- Check build logs để xem lỗi cụ thể
- Test build local: `npm run build`

### OpenAI API quota exceeded?
- Check usage: https://platform.openai.com/usage
- Add more credits
- Set usage limits

---

## 📞 Support Links

- **Clerk:** https://clerk.com/docs
- **Supabase:** https://supabase.com/docs
- **OpenAI:** https://platform.openai.com/docs
- **Pinecone:** https://docs.pinecone.io
- **Stripe:** https://stripe.com/docs
- **Upstash:** https://docs.upstash.com
- **Resend:** https://resend.com/docs
- **PostHog:** https://posthog.com/docs
- **Sentry:** https://docs.sentry.io
- **Vercel:** https://vercel.com/docs
- **Cloudflare:** https://developers.cloudflare.com

---

**🎉 Hoàn thành! Bạn đã có tất cả keys cần thiết để chạy DocuMind AI!**

Next: Đọc [QUICKSTART.md](./QUICKSTART.md) để bắt đầu development.
