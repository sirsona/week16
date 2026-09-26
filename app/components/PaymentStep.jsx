"use client";

import { useCart } from "@/app/cart/CartContext";
import { useTransition } from "react";
import { createOrder, createOrderForMpesa } from "../checkout/actions";
import { initiateMpesaPayment } from "../checkout/mpesaAction";

export default function PaymentStep({ state, dispatch }) {
  const { state: cart, dispatch: cartDispatch } = useCart();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData) {
    const items = cart.items;

    // Append cart items to the form data
    formData.append("items", JSON.stringify(items));

    const paymentMethod = formData.get("paymentMethod");

    // A successful cash order redirects server-side and never returns,
    // so clear the cart optimistically before calling the action.
    cartDispatch({ type: "CLEAR" });

    try {
      if (paymentMethod === "mpesa") {
        const created = await createOrderForMpesa(formData);
        if (created?.error) {
          restoreCart(items);
          dispatch({ type: "ERROR", message: created.error });
          return;
        }

        const result = await initiateMpesaPayment(
          created.orderId,
          state.customer.phone,
          created.totalCents,
        );

        if (result?.error) {
          dispatch({ type: "ERROR", message: result.error });
          return;
        }

        dispatch({
          type: "AWAIT_PAYMENT",
          orderId: created.orderId,
          checkoutRequestId: result.checkoutRequestId,
        });
        return;
      }

      // Cash on delivery: create the order and redirect.
      const result = await createOrder(formData);

      if (result?.error) {
        // Order failed — put the items back
        restoreCart(items);
        dispatch({ type: "ERROR", message: result.error });
      }
      // Success: createOrder calls redirect(), navigation happens here
    } catch {
      restoreCart(items);
      dispatch({
        type: "ERROR",
        message: "Could not place your order. Please try again.",
      });
    }
  }

  function restoreCart(items) {
    for (const item of items) {
      cartDispatch({
        type: "ADD_ITEM",
        productId: item.productId,
        priceCents: item.priceCents,
        quantity: item.quantity,
      });
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Payment method</h1>

      <form
        action={(fd) => startTransition(() => handleSubmit(fd))}
        className="space-y-4"
      >
        {/* Hidden fields with customer data from context */}
        <input type="hidden" name="name" value={state.customer.name} />
        <input type="hidden" name="email" value={state.customer.email} />
        <input type="hidden" name="phone" value={state.customer.phone} />
        <input type="hidden" name="address" value={state.customer.address} />

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            required
            defaultChecked={state.paymentMethod === "cash"}
            className="w-4 h-4 text-black focus:ring-black"
          />
          <span>Cash on delivery</span>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="mpesa"
            required
            defaultChecked={state.paymentMethod === "mpesa"}
            className="w-4 h-4 text-black focus:ring-black"
          />
          <span>M-Pesa </span>
        </label>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => dispatch({ type: "BACK" })}
            disabled={isPending}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Processing..." : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
