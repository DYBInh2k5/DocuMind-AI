# 🚀 Deployment Guide - DocuMind AI

## Triển khai lên Vercel + Cloudflare

### Bước 1: Chuẩn bị Code

```bash
# Đảm bảo code đã commit
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Bước 2: Deploy Vercel

#### Option A: Deploy qua Vercel Dashboard (Khuyến nghị)

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập với GitHub
3. Click **"Add New Project"**
4. Import repository `documind-ai`
5. Configure Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Environment Variables** - Thêm TẤT CẢ các biến từ `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PRO=price_xxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYxxx

# Pinecone
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX_NAME=documind-vectors

# OpenAI
OPENAI_API_KEY=sk-xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
SENTRY_AUTH_TOKEN=sntrys_xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# App URL (Sẽ update sau khi deploy)
NEXT_PUBLIC_APP_URL=https://documind-ai.vercel.app
```

7. Click **"Deploy"** ⚡

8. Đợi 2-3 phút để Vercel build và deploy

9. **Copy Production URL** (vd: `https://documind-ai.vercel.app`)

#### Option B: Deploy qua CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts
```

### Bước 3: Update App URL

1. Trong Vercel Dashboard, vào **Settings > Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` với domain thật của bạn
3. Click **"Redeploy"** để áp dụng thay đổi

### Bước 4: Setup Webhooks

#### Clerk Webhook

1. Vào [Clerk Dashboard](https://dashboard.clerk.com)
2. Chọn application của bạn
3. Vào **Webhooks** > **Add Endpoint**
4. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/clerk`
5. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Copy **Signing Secret** và update `CLERK_WEBHOOK_SECRET` trong Vercel

#### Stripe Webhook

1. Vào [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy **Signing secret** và update `STRIPE_WEBHOOK_SECRET` trong Vercel

### Bước 5: Setup Cloudflare

#### Thêm Domain vào Cloudflare

1. Đăng nhập [Cloudflare](https://dash.cloudflare.com)
2. Click **"Add a Site"**
3. Nhập domain của bạn (vd: `documind.ai`)
4. Chọn plan **Free**
5. Copy **Nameservers** mà Cloudflare cung cấp

#### Update Nameservers

1. Đăng nhập vào nhà cung cấp domain (GoDaddy, Namecheap, etc.)
2. Vào DNS Settings
3. Thay nameservers bằng nameservers của Cloudflare
4. Đợi 24-48 giờ để propagate (thường < 1 giờ)

#### Configure DNS Records

1. Trong Cloudflare Dashboard, vào **DNS**
2. Thêm CNAME record:
   - **Type**: CNAME
   - **Name**: `@` (hoặc `www`)
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: ✅ Proxied (orange cloud)
   - **TTL**: Auto

3. Nếu muốn cả `www` và root domain:
   ```
   Type: CNAME | Name: @ | Target: cname.vercel-dns.com
   Type: CNAME | Name: www | Target: cname.vercel-dns.com
   ```

#### Add Domain to Vercel

1. Trong Vercel Project, vào **Settings > Domains**
2. Click **"Add"**
3. Nhập domain: `documind.ai` và `www.documind.ai`
4. Vercel sẽ tự động verify

#### Enable Cloudflare Security

1. **SSL/TLS**:
   - Vào **SSL/TLS** > **Overview**
   - Chọn **Full (strict)**

2. **Always Use HTTPS**:
   - Vào **SSL/TLS** > **Edge Certificates**
   - Enable **Always Use HTTPS**

3. **Performance**:
   - Vào **Speed** > **Optimization**
   - Enable **Auto Minify** (HTML, CSS, JS)
   - Enable **Brotli**

4. **Security**:
   - Vào **Security** > **WAF**
   - Set Security Level: **Medium**
   - Enable **Bot Fight Mode**

5. **Caching**:
   - Vào **Caching** > **Configuration**
   - Set Browser Cache TTL: **4 hours**

### Bước 6: Test Production

#### Test Checklist

```bash
# 1. Test trang chủ
curl https://documind.ai

# 2. Test authentication
# Vào https://documind.ai/sign-in và đăng ký

# 3. Test upload
# Upload một PDF test

# 4. Test AI search
# Hỏi câu hỏi về document

# 5. Test webhooks
# Check Clerk webhook logs
# Check Stripe webhook logs

# 6. Test payment
# Dùng Stripe test card: 4242 4242 4242 4242

# 7. Test email
# Check email welcome được gửi chưa
```

#### Monitoring

1. **Vercel Analytics**:
   - Vào project > **Analytics**
   - Xem traffic, performance

2. **Sentry**:
   - Vào [sentry.io](https://sentry.io)
   - Check errors, performance

3. **PostHog**:
   - Vào [posthog.com](https://posthog.com)
   - Check user events, funnels

4. **Stripe**:
   - Vào [dashboard.stripe.com](https://dashboard.stripe.com)
   - Check payments, subscriptions

### Bước 7: Production Checklist

- [ ] Domain đã point đến Vercel
- [ ] SSL certificate active (xanh lá)
- [ ] Webhooks configured và test thành công
- [ ] Environment variables đã set đầy đủ
- [ ] Cloudflare DNS active
- [ ] Security settings enabled
- [ ] Test sign up/login
- [ ] Test upload document
- [ ] Test AI search
- [ ] Test payment (dùng test mode)
- [ ] Email được gửi thành công
- [ ] Analytics tracking hoạt động
- [ ] Error tracking hoạt động

### 🔧 Maintenance

#### Update Code

```bash
# Local changes
git add .
git commit -m "Update features"
git push origin main

# Vercel tự động deploy khi push
```

#### Rollback

1. Vào Vercel Dashboard
2. Click **"Deployments"**
3. Tìm deployment trước đó
4. Click **"..."** > **"Promote to Production"**

#### View Logs

```bash
# Vercel CLI
vercel logs

# Hoặc trong Vercel Dashboard > Project > Logs
```

### 🆘 Troubleshooting

#### Domain không hoạt động
- Check nameservers đã update chưa
- Verify DNS records trong Cloudflare
- Clear browser cache

#### Webhook fails
- Check endpoint URL đúng chưa
- Verify webhook secret
- Check Vercel function logs

#### Build fails
- Check Vercel build logs
- Verify all env vars are set
- Test build locally: `npm run build`

#### SSL errors
- Set Cloudflare SSL to **Full (strict)**
- Wait 10-15 minutes cho certificate provision
- Force refresh browser (Ctrl+Shift+R)

### 📞 Support

Nếu gặp vấn đề:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Cloudflare Documentation](https://developers.cloudflare.com)
3. Open issue trên GitHub
4. Email: support@documind.ai
