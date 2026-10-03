import axios from "axios";

// Normalise a Kenyan phone number to WhatsApp's international digits format.
export function formatPhone(phone) {
  const digits = String(phone).trim().replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export async function sendWhatsApp(to, text) {
  await axios.post(
    `https://graph.facebook.com/v26.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
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
