"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutModal({
  onClose,
  selectedPlan,
  setSelectedPlan,
  giftCard,
  plans,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });

  const total =
    (plans.find((p) => p.id === selectedPlan)?.price || 0) +
    (giftCard?.amount || 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      alert(`✅ Payment successful! Total charged: $${total.toFixed(2)}`);
      onClose();
    } catch (err) {
      alert("❌ Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>

        <h2 className="text-center text-xl font-bold text-pink-500 mb-1">
          Checkout seguro con Stripe 💜
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Tus datos se procesan de forma segura por Stripe.
        </p>

        {/* Plan Selector */}
        <div className="border rounded-2xl p-4 mb-4">
          <p className="text-center font-semibold mb-3">
            Choose your Everwish style ✨
          </p>
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`flex flex-col border rounded-xl p-3 mb-2 cursor-pointer transition ${
                selectedPlan === plan.id
                  ? "border-pink-400 bg-pink-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <span className="font-semibold">
                {plan.id === "Heartfelt" ? "💌" : "💎"} {plan.name} — $
                {plan.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">
                {plan.id === "Heartfelt"
                  ? "A calm, beautiful card to share your feelings with sincerity."
                  : "A dynamic animated experience with motion, photo, and effects that bring your message to life."}
              </span>
            </label>
          ))}
          <p className="text-xs text-center mt-2 text-gray-500">
            Both include your personalized message and instant delivery 💖
          </p>
        </div>

        {/* Sender info */}
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Sender *</h3>
            <input
              type="text"
              placeholder="Full name"
              className="w-full border rounded-lg p-2 mb-2"
              value={sender.name}
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-2 mb-2"
              value={sender.email}
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border rounded-lg p-2"
              value={sender.phone}
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
              required
            />
          </div>

          {/* Recipient info */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Recipient *</h3>
            <input
              type="text"
              placeholder="Full name"
              className="w-full border rounded-lg p-2 mb-2"
              value={recipient.name}
              onChange={(e) =>
                setRecipient({ ...recipient, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-2 mb-2"
              value={recipient.email}
              onChange={(e) =>
                setRecipient({ ...recipient, email: e.target.value })
              }
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border rounded-lg p-2"
              value={recipient.phone}
              onChange={(e) =>
                setRecipient({ ...recipient, phone: e.target.value })
              }
              required
            />
          </div>

          {/* Summary */}
          <div className="border-t pt-3 mb-3 text-sm">
            <h4 className="font-semibold mb-2">Order summary</h4>
            <p>
              Everwish Card — $
              {plans.find((p) => p.id === selectedPlan)?.price.toFixed(2)}
            </p>
            {giftCard && (
              <p className="flex items-center justify-between">
                Gift Card ({giftCard.name} ${giftCard.amount}){" "}
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  🗑️
                </button>
              </p>
            )}
            <p className="font-semibold mt-2">Total — ${total.toFixed(2)}</p>
          </div>

          {/* Card input */}
          <div className="border rounded-xl p-3 mb-4 bg-gray-50">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-pink-500 text-white py-3 font-semibold text-center hover:bg-pink-600 transition"
          >
            {loading
              ? "Processing..."
              : `Confirm & Pay $${total.toFixed(2)} 💜`}
          </button>
        </form>
      </div>
    </div>
  );
            }
