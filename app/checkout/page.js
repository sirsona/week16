// app/checkout/page.js
"use client";

import { useCallback, useReducer } from "react";
import { checkoutReducer, initialState } from "./checkoutReducer";

// Import the separated components
import CartStep from "../components/CartStep";
import ConfirmedStep from "../components/ConfirmedStep";
import ErrorStep from "../components/ErrorStep";
import InfoStep from "../components/InfoStep";
import PaymentStep from "../components/PaymentStep";
import ProcessingStep from "../components/ProcessingStep";
import AwaitPayment from "../components/AwaitPayment";

export default function CheckoutPage() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const handleSuccess = useCallback((orderId) => {
    dispatch({ type: "SUCCESS", orderId });
  }, []);

  const handleError = useCallback((message) => {
    dispatch({ type: "ERROR", message });
  }, []);

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  // Render the current step
  if (state.step === "cart") {
    return <CartStep onNext={() => dispatch({ type: "NEXT" })} />;
  }

  if (state.step === "info") {
    return <InfoStep state={state} dispatch={dispatch} />;
  }

  if (state.step === "payment") {
    return <PaymentStep state={state} dispatch={dispatch} />;
  }

  if (state.step === "processing") {
    return <ProcessingStep onSuccess={handleSuccess} onError={handleError} />;
  }

  if (state.step === "await_payment") {
    return (
      <AwaitPayment
        orderId={state.orderId}
        checkoutRequestId={state.checkoutRequestId}
        onPaid={handleSuccess}
        onFailed={handleError}
      />
    );
  }

  if (state.step === "confirmed") {
    return <ConfirmedStep orderId={state.orderId} />;
  }

  if (state.step === "error") {
    return <ErrorStep error={state.error} onReset={handleReset} />;
  }

  return null;
}
