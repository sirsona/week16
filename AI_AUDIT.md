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
