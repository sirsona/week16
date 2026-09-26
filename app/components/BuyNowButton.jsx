// app/components/BuyNowButton.jsx
"use client";

import { useCart } from "@/app/cart/CartContext";
import { useRouter } from "next/navigation";

export default function BuyNowButton({ productId, priceCents, quantity = 1 }) {
  const router = useRouter();
  const { dispatch } = useCart();

  const handleBuyNow = () => {
    // 1. Add the item to the cart immediately
    dispatch({
      type: "ADD_ITEM",
      productId,
      priceCents,
      quantity,
    });

    // 2. Navigate directly to the checkout page
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleBuyNow}
      className="flex-1 rounded-full border border-gray-300 px-8 py-4 font-semibold text-gray-900 transition hover:bg-gray-50"
    >
      Buy Now
    </button>
  );
}
