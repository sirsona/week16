"use client";
import { useCart } from "@/app/cart/CartContext";

export default function AddToCartButton({ productId, priceCents }) {
  const { dispatch } = useCart();
  return (
    <button
      onClick={() => dispatch({ type: "ADD_ITEM", productId, priceCents })}
      className="rounded-full bg-gray-900 px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
    >
      Add to cart
    </button>
  );
}
