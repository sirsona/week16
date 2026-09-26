"use client";
import { useCart } from "@/app/cart/CartContext";

export default function CartBadge() {
  const { state } = useCart();
  const count = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <span className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">
      Cart ({count})
    </span>
  );
}
