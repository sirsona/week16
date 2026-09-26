"use client";

import { useState } from "react";

export default function InfoStep({ state, dispatch }) {
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const next = {};
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone").trim();

    if (!name || !name.trim()) next.name = "Full name is required.";

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address (e.g. you@example.com).";

    if (!/^(?:\+254|0)7\d{8}$/.test(phone))
      next.phone = "Enter a valid Kenyan phone (07XXXXXXXX or +2547XXXXXXXX).";

    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nextErrors = validate(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    dispatch({
      type: "SET_CUSTOMER",
      payload: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      },
    });
    dispatch({ type: "NEXT" });
  };

  const inputClass = (hasError) =>
    `px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Your details</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Full name</label>
          <input
            name="name"
            defaultValue={state.customer.name}
            className={inputClass(errors.name)}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={state.customer.email}
            className={inputClass(errors.email)}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone</label>
          <input
            name="phone"
            type="tel"
            defaultValue={state.customer.phone}
            className={inputClass(errors.phone)}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Address</label>
          <textarea
            name="address"
            defaultValue={state.customer.address}
            rows={3}
            className={inputClass(false)}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => dispatch({ type: "BACK" })}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue to payment
          </button>
        </div>
      </form>
    </div>
  );
}
