# DocuMind AI - Setup Guide

## 📋 Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- Tài khoản cho các services (xem bên dưới)

## 🔧 Các bước Setup

### 1. Clone và cài đặt
```bash
git clone <your-repo-url>
cd documind-ai
npm install
```

### 2. Setup Clerk (Authentication)
1. Đăng ký tại [clerk.com](https://clerk.com)
2. Tạo application mới
3. Copy API keys vào `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Thêm webhook endpoint: `/api/webhooks/clerk`
5. Copy webhook secret: `CLERK_WEBHOOK_SECRET`

### 3. Setup Supabase (Database)
1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào SQL Editor, chạy nội dung file `supabase_schema.sql`
4. Copy API keys từ Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 4. Setup Pinecone (Vector Database)
1. Đăng ký tại [pinecone.io](https://pinecone.io)
2. Tạo index mới:
   - Name: `documind-vectors`
   - Dimensions: `1536`
   - Metric: `cosine`
3. Copy API key: `PINECONE_API_KEY`
4. Copy environment: `PINECONE_ENVIRONMENT`

### 5. Setup OpenAI (AI)
1. Đăng ký tại [platform.openai.com](https://platform.openai.com)
2. Tạo API key
3. Copy vào `.env.local`: `OPENAI_API_KEY`

### 6. Setup Stripe (Payments)
1. Đăng ký tại [stripe.com](https://stripe.com)
2. Tạo 2 products với recurring prices:
   - Pro: $19/month
   - Enterprise: $99/month
3. Copy price IDs:
   - `STRIPE_PRICE_ID_PRO`
   - `STRIPE_PRICE_ID_ENTERPRISE`
4. Copy API keys:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
5. Thêm webhook endpoint: `/api/webhooks/stripe`
6. Copy webhook secret: `STRIPE_WEBHOOK_SECRET`

### 7. Setup Upstash Redis (Caching)
1. Đăng ký tại [upstash.com](https://upstash.com)
2. Tạo Redis database
3. Copy credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 8. Setup Resend (Email)
1. Đăng ký tại [resend.com](https://resend.com)
2. Verify domain của bạn
3. Copy API key: `RESEND_API_KEY`
4. Set email gửi: `RESEND_FROM_EMAIL` (vd: noreply@yourdomain.com)

### 9. Setup PostHog (Analytics)
1. Đăng ký tại [posthog.com](https://posthog.com)
2. Tạo project mới
3. Copy project key: `NEXT_PUBLIC_POSTHOG_KEY`
4. Set host: `NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com`

### 10. Setup Sentry (Error Tracking)
1. Đã setup tự động qua wizard
2. Update DSN trong `.env.local` nếu cần:
   - `SENTRY_DSN`
   - `NEXT_PUBLIC_SENTRY_DSN`

## 🚀 Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📦 Build Production

```bash
npm run build
npm start
```

## 🌐 Deploy lên Vercel

### Cách 1: Qua GitHub (Recommended)
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Chọn repository
5. Thêm tất cả environment variables từ `.env.local`
6. Click "Deploy"

### Cách 2: Qua CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔒 Setup Cloudflare DNS

1. Đăng nhập [cloudflare.com](https://cloudflare.com)
2. Add site (domain của bạn)
3. Update nameservers tại nhà cung cấp domain
4. Sau khi deploy Vercel, lấy domain từ Vercel
5. Trong Cloudflare DNS:
   - Tạo CNAME record trỏ đến Vercel domain
   - Enable Proxy (orange cloud)
6. Enable các tính năng bảo mật:
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: On
   - Brotli: On

## ✅ Checklist sau khi Deploy

- [ ] Test đăng nhập/đăng ký
- [ ] Test upload document
- [ ] Test AI search
- [ ] Test thanh toán (dùng test cards của Stripe)
- [ ] Test webhooks (xem logs trong Stripe & Clerk)
- [ ] Check analytics trong PostHog
- [ ] Check errors trong Sentry
- [ ] Verify emails được gửi qua Resend

## 🔐 Bảo mật

- **KHÔNG** commit `.env.local` vào Git
- **KHÔNG** share API keys công khai
- Sử dụng environment variables trên Vercel
- Enable 2FA cho tất cả services
- Rotate keys định kỳ

## 📊 Monitoring

- **Errors**: [sentry.io](https://sentry.io)
- **Analytics**: [posthog.com](https://posthog.com)
- **Payments**: [stripe.com/dashboard](https://stripe.com/dashboard)
- **Database**: [supabase.com/dashboard](https://supabase.com/dashboard)

## 🆘 Troubleshooting

### Lỗi Webhook
- Check webhook URL đúng chưa
- Verify webhook secret
- Xem logs trong Stripe/Clerk dashboard

### Lỗi Upload
- Check Pinecone index đã tạo chưa
- Verify OpenAI API key
- Check Supabase connection

### Lỗi Authentication
- Clear cookies và thử lại
- Check Clerk dashboard cho user
- Verify middleware config

## 📞 Support

Nếu gặp vấn đề, mở issue trên GitHub hoặc email: support@documind.ai
