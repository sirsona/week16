# Mctaba Shop

A full-stack e-commerce platform built with Next.js and PostgreSQL — browse a
book catalogue, pay with M-Pesa STK Push, and receive a WhatsApp order
confirmation.

**Live:** https://mctaba-shop-week16.vercel.app

---

## Features

- Product catalogue (8 books with images and shareable slugs)
- Cart with localStorage persistence
- Checkout state machine: cart → info → payment → awaiting M-Pesa → confirmed
- M-Pesa STK Push (Daraja sandbox) with callback reconciliation
  (idempotency + amount verification)
- Payment status polling, with auto-reconciliation on timeout (STK Push Query API)
- WhatsApp order confirmation (Meta Cloud API, approved template) with retry
- Admin: JWT-cookie auth, orders list/detail, status updates, and a
  "Check with M-Pesa" reconciliation button
- Order tracking pages

## Tech stack

Next.js 16 (App Router, Server Actions), PostgreSQL, Tailwind CSS,
Safaricom Daraja (M-Pesa), Meta WhatsApp Cloud API.

## Local setup

```bash
npm install
cp .env.example .env.local    # fill in the values (see below)
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
npm run dev
```

Admin access: insert a row in `users` with `role = 'admin'` (bcrypt
`password_hash`), then log in at `/login`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE` | PostgreSQL connection |
| `PG_SSL` | `true` for hosted Postgres (Neon, Supabase, …) |
| `JWT_SECRET` | Admin session signing |
| `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_SHORTCODE` | Daraja (sandbox) credentials |
| `PUBLIC_URL` | Public base URL — used for the M-Pesa callback and order links |
| `META_PHONE_NUMBER_ID`, `META_ACCESS_TOKEN` | WhatsApp Cloud API |
| `WHATSAPP_TEMPLATE_NAME` | Approved order-confirmation template |

## How to test end-to-end

1. Open the live site → browse → add a book to the cart.
2. Checkout → enter customer details (use a Safaricom sandbox test number, e.g.
   `254708374149`).
3. Choose **M-Pesa** → Place order → the STK prompt appears on the phone →
   enter the PIN.
4. Daraja calls back to `PUBLIC_URL/api/mpesa/callback`; the order flips to
   **paid** and the checkout advances to the confirmation.
5. The customer receives the WhatsApp confirmation (see opt-in note) with a
   link to `/orders/<id>`.
6. Admin: log in at `/login` → `/admin/orders` → open an order → update status,
   or click **Check with M-Pesa** to reconcile a stuck payment.

### WhatsApp opt-in (test number)

The Meta test number can only message recipients who have messaged it first.
From the customer phone, send any WhatsApp message to the shop's test number
before testing the confirmation.

## Screenshots

See `assets/` — STK prompt (`day1-stk.png`), paid order (`day-paid.png`),
callback mismatch/idempotency (`day2-*.png`), WhatsApp confirmation
(`day3-confirmation.jpeg`).
