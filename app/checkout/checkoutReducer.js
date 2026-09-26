export const initialState = {
  step: "cart",
  customer: { name: "", email: "", phone: "", address: "" },
  paymentMethod: null,
  orderId: null,
  checkoutRequestId: null,
  error: null,
};

export function checkoutReducer(state, action) {
  switch (action.type) {
    case "NEXT":
      if (state.step === "cart") return { ...state, step: "info" };
      if (state.step === "info") return { ...state, step: "payment" };
      if (state.step === "payment") return { ...state, step: "processing" };
      return state;
    case "BACK":
      if (state.step === "info") return { ...state, step: "cart" };
      if (state.step === "payment") return { ...state, step: "info" };
      return state;
    case "SET_CUSTOMER":
      return { ...state, customer: { ...state.customer, ...action.payload } };
    case "SET_PAYMENT":
      return { ...state, paymentMethod: action.payload };
    case "AWAIT_PAYMENT":
      return {
        ...state,
        step: "await_payment",
        orderId: action.orderId,
        checkoutRequestId: action.checkoutRequestId,
      };
    case "SUCCESS":
      return { ...state, step: "confirmed", orderId: action.orderId };
    case "ERROR":
      return { ...state, step: "error", error: action.message };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
