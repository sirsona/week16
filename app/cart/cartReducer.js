export const initialState = { status: "empty", items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { productId, priceCents, quantity = 1 } = action;
      const existing = state.items.find((i) => i.productId === productId);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      } else {
        items = [...state.items, { productId, priceCents, quantity }];
      }
      return { ...state, status: "populated", items };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.productId !== action.productId);
      return {
        ...state,
        items,
        status: items.length === 0 ? "empty" : "populated",
      };
    }
    case "CLEAR":
      return initialState;
    case "PROCEED":
      return { ...state, status: "checking_out" };
    case "BACK":
      return { ...state, status: "populated" };
    default:
      return state;
  }
}
