# Design Notes - Checkout State Machine

## 1. Why use a state machine instead of booleans like `isInfoStep`, `isPaymentStep`?

- Using a single `step` string (`"cart"`, `"info"`, `"payment"`, etc.) is much cleaner than managing multiple boolean flags.
- With booleans, you'd have to ensure that `isInfoStep` and `isPaymentStep` are never both true at the same time, and you'd need to manually set/unset them on every transition. -
- With a state machine, the `step` value is always in exactly one valid state, making the code less error-prone and easier to debug. The reducer also centralizes all transition logic in one place.

## 2. What happens if you refresh the page mid-checkout? How would you persist the state?\*\*

- Currently, refreshing the page resets the checkout state to `initialState` (step: "cart"). This is because the state lives only in the browser's memory (React's `useReducer`).
- To persist it, I could use `sessionStorage` (which survives refreshes but not browser restarts).
- I would add a `useEffect` that writes `state` to `sessionStorage` on every change, and initialize the reducer by reading from `sessionStorage` on mount (with a `typeof window !== "undefined"` guard).

## 3. What would you change if the payment took 30 seconds and you had to show progress?\*\*

- I would add a progress indicator (e.g., a spinner with a percentage bar or animated steps) and show more informative messages like "Verifying payment...", "Contacting bank...", "Confirming order...".
- I would also add a "Cancel" button that dispatches a `CANCEL` action to return to the cart.
- Additionally, I would set a timeout to automatically retry the payment if it hangs for too long, and display a user-friendly error message if it ultimately fails.
