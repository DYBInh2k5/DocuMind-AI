# 📡 API Documentation - DocuMind AI

## Base URL
```
Development: http://localhost:3000
Production: https://documind.ai
```

## Authentication

All protected endpoints require Clerk authentication token in headers:

```http
Authorization: Bearer YOUR_CLERK_TOKEN
```

Get token from Clerk session in browser.

---

## Endpoints

### 1. Upload Document

Upload and process a document with AI.

**Endpoint**: `POST /api/documents/upload`

**Headers**:
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data
```

**Body** (form-data):
```
file: [PDF/DOCX/TXT file]
```

**Supported File Types**:
- `application/pdf` - PDF documents
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - Word documents
- `text/plain` - Text files

**Response** (200 OK):
```json
{
  "document": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Document Title",
    "file_name": "document.pdf",
    "file_size": 1048576,
    "file_type": "application/pdf",
    "content": "Full text content...",
    "summary": "AI-generated summary...",
    "storage_path": "user_id/timestamp-filename",
    "created_at": "2026-02-25T10:00:00Z",
    "updated_at": "2026-02-25T10:00:00Z"
  },
  "remaining": 9
}
```

**Rate Limit**: 10 uploads per hour

**Errors**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 400 Bad Request
{ "error": "No file provided" }
{ "error": "Unsupported file type" }

// 403 Forbidden
{ "error": "Document limit reached. Please upgrade your plan." }

// 429 Too Many Requests
{ "error": "Too many uploads. Please try again later." }

// 500 Internal Server Error
{ "error": "Failed to upload document" }
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

---

### 2. AI Search

Search documents and get AI-powered answers.

**Endpoint**: `POST /api/search`

**Headers**:
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "query": "What is this document about?"
}
```

**Response** (200 OK):
```json
{
  "answer": "Based on the documents, this is about...",
  "sources": [
    {
      "id": "doc-uuid-1",
      "title": "Document 1",
      "file_name": "doc1.pdf"
    },
    {
      "id": "doc-uuid-2",
      "title": "Document 2",
      "file_name": "doc2.pdf"
    }
  ],
  "matches": 5
}
```

**Rate Limits**:
- Free: 100 queries per month
- Pro: Unlimited
- Enterprise: Unlimited

**Errors**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 400 Bad Request
{ "error": "Query is required" }

// 404 Not Found
{ "error": "User not found" }

// 429 Too Many Requests
{ "error": "Query limit reached. Please upgrade your plan." }

// 500 Internal Server Error
{ "error": "Failed to process query" }
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Summarize the key points"}'
```

---

### 3. Create Checkout Session

Create Stripe checkout session for subscription.

**Endpoint**: `POST /api/checkout`

**Headers**:
```http
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "plan": "PRO"
}
```

**Plan Options**:
- `PRO` - $19/month
- `ENTERPRISE` - $99/month

**Response** (200 OK):
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/pay/cs_test_xxx"
}
```

**Errors**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 400 Bad Request
{ "error": "Invalid plan" }

// 404 Not Found
{ "error": "User not found" }

// 500 Internal Server Error
{ "error": "Failed to create checkout session" }
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "PRO"}'
```

---

## Webhooks

### Clerk Webhook

Handles user lifecycle events from Clerk.

**Endpoint**: `POST /api/webhooks/clerk`

**Events**:
- `user.created` - New user registered
- `user.updated` - User profile updated
- `user.deleted` - User deleted account

**Headers** (from Clerk):
```http
svix-id: msg_xxx
svix-timestamp: 1234567890
svix-signature: v1,xxx
```

**Payload Example**:
```json
{
  "type": "user.created",
  "data": {
    "id": "user_xxx",
    "email_addresses": [
      {
        "email_address": "user@example.com"
      }
    ],
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Response** (200 OK):
```json
{ "received": true }
```

---

### Stripe Webhook

Handles payment events from Stripe.

**Endpoint**: `POST /api/webhooks/stripe`

**Events**:
- `checkout.session.completed` - Payment successful
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_failed` - Payment failed

**Headers** (from Stripe):
```http
stripe-signature: t=xxx,v1=xxx
```

**Payload Example**:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "customer": "cus_xxx",
      "subscription": "sub_xxx",
      "metadata": {
        "userId": "user_xxx",
        "plan": "PRO"
      }
    }
  }
}
```

**Response** (200 OK):
```json
{ "received": true }
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions or quota |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Rate limits are enforced using Redis and vary by plan:

| Endpoint | Free | Pro | Enterprise |
|----------|------|-----|------------|
| Upload | 10/hour | 100/hour | 1000/hour |
| Search | 100/month | Unlimited | Unlimited |

Rate limit info returned in headers:
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1677337200
```

---

## Pagination

Currently not implemented. Will be added in future versions for:
- Document listing
- Search history
- Query logs

---

## Versioning

Current version: **v1**

Future versions will use URL versioning:
```
/api/v2/documents/upload
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Upload document
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const { document } = await response.json();
```

```typescript
// Search documents
const response = await fetch('/api/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: 'What is AI?' }),
});

const { answer, sources } = await response.json();
```

### Python

```python
import requests

# Upload document
files = {'file': open('document.pdf', 'rb')}
headers = {'Authorization': f'Bearer {token}'}

response = requests.post(
    'http://localhost:3000/api/documents/upload',
    files=files,
    headers=headers
)

document = response.json()['document']
```

```python
# Search documents
payload = {'query': 'What is AI?'}
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'http://localhost:3000/api/search',
    json=payload,
    headers=headers
)

answer = response.json()['answer']
```

---

## Postman Collection

Import this collection for easy API testing:

```json
{
  "info": {
    "name": "DocuMind AI",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload Document",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file"
            }
          ]
        },
        "url": "{{baseUrl}}/api/documents/upload"
      }
    },
    {
      "name": "Search Documents",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"query\": \"What is this about?\"}"
        },
        "url": "{{baseUrl}}/api/search"
      }
    }
  ]
}
```

---

## Support

For API support:
- Email: api@documind.ai
- GitHub: Open an issue
- Discord: [Join community]

## Changelog

### v1.0.0 (2026-02-25)
- Initial API release
- Document upload endpoint
- AI search endpoint
- Checkout endpoint
- Clerk & Stripe webhooks
