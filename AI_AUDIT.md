# AI Audit

## Week 16 - Day 1

### lib/mpesa.js

- **Classification:** Server-only (shared module)
- **Reason:** Runs only on the server — `getToken` and `initiateStkPush` call Daraja directly and never ship to the client.
- **Money lines (hand-typed):** `Amount`, `Password`, `Timestamp`, `PartyA`, `AccountReference`, `CallBackURL`.
- **Provenance:** Ported by hand from Week 10 `services/mpesa.js`. No AI on money lines.

### app/checkout/mpesaAction.js

- **Classification:** Server-only (`"use server"`)
- **Reason:** Mutates the database (`mpesa_checkout_id`) and triggers the STK push — must never ship to the client.
- **Money lines (hand-typed):** `normalizePhone` (07/+254 → 254), phone regex `/^254(7|1)\d{8}$/`, `amountCents < 100` guard, `Math.ceil(amountCents / 100)` conversion, `accountRef = orderId.slice(0, 12)`.
- **Provenance:** Hand-typed. No AI on validation, amounts, or the reference.

### app/checkout/actions.js

- **Classification:** Server-only (`"use server"`)
- **Reason:** Creates orders inside a transaction and computes the total server-side; runs only on the server.
- **Money lines (hand-typed):** `total = validItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)`, `BEGIN`/`COMMIT`/`ROLLBACK`.
- **Provenance:** Refactored from Week 15 — extracted `insertOrder` so cash (`createOrder`) and M-Pesa (`createOrderForMpesa`) share one transaction. Amounts computed only on the server.

### app/components/PaymentStep.jsx

- **Classification:** Client Component
- **Reason:** Interactive form; dispatches `AWAIT_PAYMENT` and `ERROR` — requires `"use client"`.
- **Money rule:** No money math here. It passes `orderId`/`totalCents` (returned by the server) into `initiateMpesaPayment`; the client never computes an amount.
- **Provenance:** AI-assisted dispatch wiring only.

### app/checkout/checkoutReducer.js

- **Classification:** Client (module shared with client components)
- **Reason:** Pure reducer for `useReducer` — runs wherever the checkout lives; no server-only code.
- **Note:** New `AWAIT_PAYMENT` state holds `orderId` and `checkoutRequestId` only — no amounts.

### app/components/AwaitPayment.jsx

- **Classification:** Client Component
- **Reason:** Renders the "Check your phone…" screen and the checkout request id; no server-only code.
- **Note:** Static UI — no money code.

## Week 16 - Day 2

### app/api/mpesa/callback/route.js

- **Classification:** Route Handler (Server-only)
- **Reason:** Receives the Daraja STK callback, reconciles the payment against the stored order, and mutates the database — runs only on the server.
- **Money lines (hand-typed):** amount comparison `receivedCents !== expectedCents` (with `Math.round(Number(amountReceived) * 100)`), the idempotency check `order.status === "paid"`, and the `status = 'paid'` / `'cancelled'` updates.
- **Provenance:** Hand-typed. No AI on amount comparison, idempotency, or the status transition.

### Money rule notes (Day 2)

- The callback returns 200 on every reconcile path (invalid body is the only 400) so Daraja never retries on a non-200.
- Amount verification compares Daraja's reported amount to the server-stored `total_cents`; a mismatch cancels the order instead of marking it paid.
- Idempotency protects against duplicate callback deliveries.

## Week 16 - Day 3

### lib/whatsapp.js (primary — template path)

- **Classification:** Server-only (shared module)
- **Reason:** `sendTemplate` posts to the Meta Cloud API with the server-side access token and never ships to the client.
- **Money lines:** None — no amounts are computed or compared here.
- **Provenance:** `sendTemplate` ported from mctaba-shop (Graph `v26.0`). `formatPhone` (07/+254 → 254 digits) is hand-typed. `buildTemplateParams` (formatting only) is AI-assisted.
- **Why templates:** the Meta number is a test number. Free-form text is only delivered inside a 24-hour customer-service window that opens when the _customer_ messages first; otherwise the API accepts the send (HTTP 200) but delivery silently fails. Approved templates (`mctaba_shop`) always deliver.

### lib/whatsapp.js (kept — session-text path)

- **Classification:** Server-only (shared module)
- **Reason:** `sendWhatsApp` posts free-form text; kept per the assignment's Task 1/2 shape.
- **Provenance:** `sendWhatsApp` ported from Week 11 (Graph `v26.0`). `buildConfirmationMessage` (formatting only) is AI-assisted.

### app/api/mpesa/callback/route.js (WhatsApp trigger)

- **Classification:** Route Handler (Server-only)
- **Reason:** The send is triggered after the order is marked `paid`, inside the callback handler.
- **Trigger logic (hand-typed):** fire the confirmation only on the `resultCode === 0` + amount-matched path; call `sendTemplate(order.customer_phone, process.env.WHATSAPP_TEMPLATE_NAME, buildTemplateParams(order, items))`; wrap the send in `try/catch` so a failed notification never fails the callback or changes the payment outcome.
- **Provenance:** Trigger point hand-typed. The placeholder formatting lives in `buildTemplateParams` (AI-assisted).

### Notification rule notes (Day 3)

- A notification is a side effect of the `paid` transition, not the transition itself — it runs after the DB update and cannot roll it back.
- The callback always returns `{status:"ok"}` even if the WhatsApp send fails (failure is logged for inspection).
- No network call is awaited inside a DB transaction.
- Send success is logged (`sendTemplate succeeded: {messages:[…]}`) so silent delivery failures surface immediately.

## Week 16 - Day 4

### lib/retry.js

- **Classification:** Server-only (shared module)
- **Reason:** Pure `withRetry(fn, { attempts, baseDelayMs })` helper — exponential backoff; no client or DB code.
- **Retry policy (hand-set):** 3 attempts, 500ms base delay; 4xx responses are thrown immediately (per the Day 4 "do not retry a 400" rule); network/5xx errors are retried.
- **Provenance:** Helper shape from the assignment; the policy constants were decided manually, not AI-generated.

### app/api/orders/[id]/status/route.js

- **Classification:** Route Handler (Server-only)
- **Reason:** Read-only `SELECT status` used by the checkout polling loop; returns only `{ status }`.
- **Money lines:** None — no amounts, references, or transitions.
- **Provenance:** Hand-typed (with the Next 16 `await params` adaptation).

### app/components/AwaitPayment.jsx

- **Classification:** Client Component
- **Reason:** Uses `useEffect` + `setInterval`/`setTimeout` to poll the status route; browser-only APIs require `"use client"`.
- **Money rule:** No money math — it only reads a status string and calls `onPaid`/`onFailed`.
- **Provenance:** Polling scaffold AI-assisted; timeout/cancelled wiring reviewed and wired manually.

### Money rule notes (Day 4)

- No new money lines were introduced — the money audit (Days 1–2) is unchanged and current.
- Polling never decides when an order is paid: the M-Pesa callback owns that transition; the client only observes it.

### lib/reconcile.js + lib/mpesa.js (queryStkStatus)

- **Classification:** Server-only (shared modules)
- **Reason:** Calls Daraja's STK Push Query API and updates `orders`; never ships to the client.
- **Money lines (hand-typed):** the ResultCode → status mapping (`"0"` → `paid`; `1032/1037/2001` → `cancelled`; `4999`/unknown → no change). Only an authoritative Daraja ResultCode flips an order to `paid`.
- **Provenance:** Hand-typed. No AI on the status decision.

### app/api/orders/[id]/reconcile/route.js + app/admin/orders/[id]/reconcile.js

- **Classification:** Route Handler / Server Action (Server-only)
- **Reason:** Exposes `reconcileOrder` to the checkout timeout backstop and the admin button.
- **Note:** Reconciliation cannot fabricate a payment — it only reflects Daraja's authoritative result; receipt numbers cannot be recovered once a callback is lost.

### app/admin/orders/[id]/ReconcileButton.jsx + app/components/AwaitPayment.jsx (timeout)

- **Classification:** Client Components
- **Reason:** Buttons/polling that invoke the server reconciliation.
- **Note:** No money math on the client; the timeout backstop only re-checks Daraja once before failing.

# Week 17 - Day 1 (Stripe)

### lib/stripe.js

- **Classification:** Server-only (shared module)
- **Reason:** Instantiates the Stripe SDK with the secret key; never ships to the client.
- **Money lines:** None itself — amounts are passed in by the action.
- **Provenance:** Assignment boilerplate. API version left to the SDK default (the pinned `2023-10-16` from the snippet is rejected by the installed SDK).

### app/checkout/stripeAction.js

- **Classification:** Server-only (`"use server"`)
- **Reason:** Reads the order total server-side and creates a Stripe Checkout Session; must never run on the client.
- **Money lines (hand-typed):** `currency: "kes"`, `unit_amount: order.total_cents` (amount always read from the DB, never from the client), `metadata.order_id` linkage.
- **Provenance:** Structure from the assignment, adapted to the live API (see quirks).

### app/api/webhooks/stripe/route.js

- **Classification:** Route Handler (Server-only)
- **Reason:** Receives Stripe events, verifies signatures, and mutates orders.
- **Money lines (hand-typed):** signature verification (`stripe.webhooks.constructEvent`), idempotency via `webhook_events(event.id)`, the `status = 'paid'` transition guarded by `payment_method = 'stripe'`.
- **Provenance:** Hand-typed. No AI on signature verification, idempotency, or the paid decision.

### lib/notifications.js

- **Classification:** Server-only (shared module)
- **Reason:** Extracted `sendOrderConfirmation(orderId)` now used by both the M-Pesa callback and the Stripe webhook.
- **Provenance:** Refactor of Week 16 code; no new money lines.

## Provider quirks log

### Stripe

1. `payment_method_types: ["card"]` is **no longer accepted** by the Checkout Sessions API (verified live against API version `2026-09-30.endive`) — payment methods are dashboard-managed; omitting the param uses card by default in test mode.
2. The assignment's pinned `apiVersion: "2023-10-16"` is rejected by the installed SDK — use the SDK default.
3. The client `success_url` is **not proof of payment**; the signed webhook (`checkout.session.completed`) is the only source of truth for `paid`.
4. Idempotency is **event-based** (`event.id` + `webhook_events` dedup), unlike Daraja's reference-based duplicate check.
5. `metadata.order_id` is the Stripe equivalent of Daraja's `CheckoutRequestID` — how the webhook finds the order.
6. Amounts are the smallest currency unit (`unit_amount` cents) with `currency: "kes"`.
7. A US test account accepts KES as a presentment currency, and test-mode Checkout works even with `charges_enabled: false` (that flag gates live charges only).

# Week 17 - Day 2 (Airtel Money)

### lib/airtel.js

- **Classification:** Server-only (shared module)
- **Reason:** Calls Airtel's OAuth and Collections APIs with server credentials; never ships to the client.
- **Money lines (hand-typed):** `Math.ceil(amountCents / 100)` (Airtel takes whole KSh), the reference format `ord_<short>_<ts>`, and the `status.code === "200"` success gate.
- **Provenance:** Hand-typed from the assignment/reading shape (docs-first). Token cached with an expiry buffer.

### app/checkout/airtelAction.js

- **Classification:** Server-only (`"use server"`)
- **Reason:** Validates input and initiates the collection; runs only on the server.
- **Money lines (hand-typed):** phone normalisation + regex, the `amountCents < 100` guard, and persisting `airtel_reference` + `status='initiated'`.
- **Provenance:** Hand-typed.

### app/api/airtel/callback/route.js

- **Classification:** Route Handler (Server-only)
- **Reason:** Reconciles Airtel's callback against the stored order.
- **Money lines (hand-typed):** the amount comparison (`Math.ceil(total_cents / 100) !== Number(txn.amount)`), idempotency (`status === 'paid'`), the TS/TF/TIP mapping, and the `paid`/`cancelled` transitions.
- **Provenance:** Hand-typed. No AI on amount checks, idempotency, or status decisions.

### Provider quirks log — Airtel Money

1. **OAuth tokens are rate-limited heavily** — cache the token and refresh 60s before expiry; a token per request would throttle within dozens of orders.
2. The initiate API returns a **synchronous status code** (`status.code === "200"`), unlike Daraja which only acknowledges async acceptance.
3. Every request requires `X-Country` and `X-Currency` headers, not just `Authorization`.
4. The customer prompt is a **USSD popup**, not an app notification.
5. Callback status codes are `TS` (success), `TF` (failed), `TIP` (in progress) — `TIP` must be ignored (leave `initiated`); Airtel calls again.
6. Amounts are **whole KSh** — no cents; conversion happens at the boundary (`Math.ceil`).
7. The callback signature scheme is inconsistent across Airtel's docs (HMAC vs `hash`) — defence relies on the non-guessable reference id + a validated order lookup; production should add IP allowlisting.
8. The callback looks up orders by `airtel_reference`, so it must be unique — hardened with a unique partial index (`WHERE airtel_reference IS NOT NULL`).
