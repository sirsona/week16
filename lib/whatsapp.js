import axios from "axios";

const GRAPH_BASE_URL = "https://graph.facebook.com/v26.0";

// Normalise a Kenyan phone number to WhatsApp's international digits format.
export function formatPhone(phone) {
  const digits = String(phone).trim().replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

// Free-form text. Only delivers inside an open 24h customer-service window
// (the customer messaged us first). Kept for opted-in/session use.
export async function sendWhatsApp(to, text) {
  const response = await axios.post(
    `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: formatPhone(to),
      type: "text",
      text: { body: text },
    },
    {
      headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` },
    },
  );
  console.log("sendWhatsApp succeeded:", JSON.stringify(response.data));
  return response.data;
}

// Business-initiated message via an approved template. Confirmations must use
// this path: free-form text outside the 24h window is accepted (HTTP 200) but
// silently fails delivery (Meta error 131026).
export async function sendTemplate(to, templateName, params) {
  const response = await axios.post(
    `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: formatPhone(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: params.map((text) => ({ type: "text", text })),
          },
        ],
      },
    },
    {
      headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` },
    },
  );
  console.log("sendTemplate succeeded:", JSON.stringify(response.data));
  return response.data;
}

export function buildConfirmationMessage(order, items) {
  const firstName = (order.customer_name || "").split(" ")[0];
  const greeting = firstName
    ? `Asante ${firstName}! Your order is confirmed.`
    : "Asante! Your order is confirmed.";

  const lines = [
    greeting,
    `Order: ${order.id.slice(0, 8)}`,
    `Total: KES ${(order.total_cents / 100).toLocaleString()}`,
    `Items:`,
    ...items.map((i) => `- ${i.quantity}x ${i.name}`),
    `Track: ${process.env.PUBLIC_URL}/orders/${order.id}`,
  ];
  return lines.join("\n");
}

function computeDeliveryDate() {
  const delivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  return delivery.toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function buildTemplateParams(order, items) {
  const firstName = (order.customer_name || "").split(" ")[0];
  const shortId = order.id.slice(0, 8).toUpperCase();
  const totalKsh = (order.total_cents / 100).toLocaleString();
  const itemsText = items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
  const itemsWithTrack = `${itemsText} - Track: ${process.env.PUBLIC_URL}/orders/${order.id}`;

  return [firstName, shortId, totalKsh, itemsWithTrack, computeDeliveryDate()];
}
