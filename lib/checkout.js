// lib/checkout.js
// Modal de Checkout (Stripe inline) con diseño aprobado

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function InlineStripeForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) throw new Error(error || "Missing client secret");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) alert(result.error.message || "Payment failed");
      else if (result.paymentIntent?.status === "succeeded") onSuccess?.();
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="rounded-2xl border bg-gray-50 p-4">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 w-full rounded-full py-3 font-semibold text-white transition ${
          loading ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Processing..." : "Confirm & Pay 💜"}
      </button>
    </form>
  );
}

export default function CheckoutModal({
  total,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60">
      <div className="relative w-11/12 max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close checkout"
        >
          ✕
        </button>

        <h3 className="mb-1 text-center text-xl font-bold text-purple-600">
          Checkout seguro con Stripe 💜
        </h3>
        <p className="mb-4 text-center text-sm text-gray-500">
          Tus datos se procesan de forma segura por Stripe.
        </p>

        {/* Sender / Recipient */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Sender <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="mb-2 w-full rounded-xl border p-3"
              value={sender.name}
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="mb-2 w-full rounded-xl border p-3"
              value={sender.email}
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={sender.phone}
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Recipient <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="mb-2 w-full rounded-xl border p-3"
              value={recipient.name}
              onChange={(e) =>
                setRecipient({ ...recipient, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="mb-2 w-full rounded-xl border p-3"
              value={recipient.email}
              onChange={(e) =>
                setRecipient({ ...recipient, email: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={recipient.phone}
              onChange={(e) =>
                setRecipient({ ...recipient, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-5 border-t pt-4 text-sm text-gray-700">
          <p className="mb-1 font-semibold">Order summary</p>

          <div className="flex justify-between">
            <span>Everwish Card</span>
            <span>$5.00</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span>
              Gift Card{" "}
              {gift?.brand
                ? `(${gift.brand} $${Number(gift.amount || 0)})`
                : "(none)"}
            </span>
            <div className="flex items-center gap-3">
              {gift?.brand ? (
                <>
                  <button
                    onClick={onGiftChange}
                    className="text-pink-600 hover:underline"
                  >
                    Change
                  </button>
                  <button
                    onClick={onGiftRemove}
                    className="text-gray-500 hover:text-red-500"
                    title="Remove gift card"
                  >
                    🗑️
                  </button>
                </>
              ) : (
                <button
                  onClick={onGiftChange}
                  className="text-pink-600 hover:underline"
                >
                  Add
                </button>
              )}
            </div>
          </div>

          <div className="my-2 h-px bg-gray-200" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe */}
        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </div>
    </div>
  );
}
