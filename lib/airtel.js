import axios from "axios";

const BASE_URL = "https://openapiuat.airtel.africa";
const X_COUNTRY = "KE";
const X_CURRENCY = "KES";

// Airtel rate-limits token requests heavily -- cache the token and refresh
// one minute before it expires.
let cachedToken = null;
let tokenExpiry = 0;

export async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await axios.post(`${BASE_URL}/auth/oauth2/token`, {
    client_id: process.env.AIRTEL_CLIENT_ID,
    client_secret: process.env.AIRTEL_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
  return cachedToken;
}

// Normalise to international digits (07... / +254... -> 254...).
export function formatPhone(phone) {
  const digits = String(phone).trim().replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

// Initiate a collection (Airtel's name for a push prompt).
// Amount is passed in whole KSh -- Airtel does not accept cents.
export async function initiateCollection({ phone, amountCents, orderId }) {
  const token = await getToken();
  const amountKsh = Math.ceil(amountCents / 100);
  const referenceId = `ord_${orderId.slice(0, 8)}_${Date.now()}`;

  const res = await axios.post(
    `${BASE_URL}/merchant/v1/payments/`,
    {
      reference: orderId.slice(0, 12),
      subscriber: {
        country: X_COUNTRY,
        currency: X_CURRENCY,
        msisdn: formatPhone(phone),
      },
      transaction: {
        amount: amountKsh,
        country: X_COUNTRY,
        currency: X_CURRENCY,
        id: referenceId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Country": X_COUNTRY,
        "X-Currency": X_CURRENCY,
      },
    },
  );

  if (res.data.status?.code !== "200") {
    throw new Error(res.data.status?.message || "Airtel rejected the payment");
  }

  return { referenceId, raw: res.data };
}
