"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, Info, Loader2 } from "lucide-react";
import { isAdminUser, getCurrentUser } from "@/lib/admin-config";

// ⚠️ Asegúrate de tener esto en tu .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ total, gift, onSuccess, onError, isAdmin, cardData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Formulario de datos
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validar formulario
  const validateForm = () => {
    const required = ["senderName", "senderEmail", "recipientName", "recipientEmail"];
    return required.every(field => formData[field]?.trim());
  };

  // 🎯 ENVÍO DE ADMIN (sin pago)
  const handleAdminSend = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fill all required fields");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Enviar directamente sin cobrar
      const res = await fetch("/api/admin/send-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cardData,
          isAdminSend: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send card");

      onSuccess({
        type: "admin_send",
        data,
      });
    } catch (err) {
      setError(err.message);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  // 💳 PAGO NORMAL (Stripe)
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      return;
    }

    if (!validateForm()) {
      setError("Please fill all required fields");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Crear Payment Intent
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convertir a centavos
          sender: {
            name: formData.senderName,
            email: formData.senderEmail,
            phone: formData.senderPhone,
          },
          recipient: {
            name: formData.recipientName,
            email: formData.recipientEmail,
            phone: formData.recipientPhone,
          },
          message: cardData?.message || "",
          cardSlug: cardData?.slug || "custom-card", // 🔥 AGREGADO
          gift,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error creating payment");
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error("No client secret received");
      }

      // 2. Confirmar pago
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.senderName,
              email: formData.senderEmail,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // 3. Pago exitoso
      console.log("✅ Payment successful:", paymentIntent.id);
      onSuccess({
        type: "payment",
        paymentIntent,
      });

    } catch (err) {
      console.error("❌ Payment error:", err);
      setError(err.message);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={isAdmin ? handleAdminSend : handlePayment} className="space-y-4">
      {/* Sender Info */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Sender *</label>
        <input
          name="senderName"
          value={formData.senderName}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Name"
          required
        />
        <input
          name="senderEmail"
          type="email"
          value={formData.senderEmail}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Email"
          required
        />
        <input
          name="senderPhone"
          value={formData.senderPhone}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Phone (optional)"
        />
      </div>

      {/* Recipient Info */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Recipient *</label>
        <input
          name="recipientName"
          value={formData.recipientName}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Name"
          required
        />
        <input
          name="recipientEmail"
          type="email"
          value={formData.recipientEmail}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Email"
          required
        />
        <input
          name="recipientPhone"
          value={formData.recipientPhone}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm"
          placeholder="Phone (optional)"
        />
      </div>

      {/* Payment Section - Solo si NO es admin */}
      {!isAdmin && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">Payment Method</label>
          <div className="border rounded-xl p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Admin Badge */}
      {isAdmin && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-700 flex items-center gap-2">
          <span className="text-xl">👑</span>
          <span className="font-semibold">Admin Mode: Sending FREE</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing || (!stripe && !isAdmin)}
        className={`w-full rounded-xl py-3 font-bold text-white flex items-center justify-center gap-2 ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : isAdmin
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
        }`}
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isAdmin ? "Sending..." : "Processing..."}
          </>
        ) : isAdmin ? (
          <>
            <span>👑</span>
            Send FREE (Admin)
          </>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

export default function CheckoutModal({ total, gift, onClose, cardData }) {
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGiftAmount, setSelectedGiftAmount] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const plans = {
    snapwish: {
      name: "SnapWish",
      price: 3.99,
      details: [
        "Static digital card",
        "Personalized message",
        "Includes optional gift card",
      ],
    },
    wonderdream: {
      name: "WonderDream",
      price: 7.99,
      details: [
        "Premium animated card",
        "Personalized message",
        "Upload your photo",
        "Gift card (optional)",
        "Magic animations included",
      ],
    },
  };

  const giftCardAmounts = [5, 10, 15, 20, 25, 50, 100];

  const getTotal = () => {
    let t = plans[selectedPlan].price;
    if (selectedGiftAmount) t += selectedGiftAmount;
    return t;
  };

  // 🔍 Verificar si el email es admin
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email);
      const adminCheck = isAdminUser(user.email, user.phone);
      setIsAdminUser(adminCheck);
      
      if (adminCheck) {
        console.log("👑 Admin user detected:", user.email);
      }
    }
  }, []);

  const handleSuccess = (result) => {
    console.log("Payment/Send successful:", result);
    
    if (result.type === "payment") {
      alert("🎉 Payment successful! Card will be sent shortly.");
      // Redirigir a página de éxito
      window.location.href = "/success";
    } else {
      alert("✅ Card sent successfully!");
      onClose();
    }
  };

  const handleError = (error) => {
    console.error("Error:", error);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
          {isAdminUser ? "👑 Admin Checkout" : "Checkout"}
        </h2>

        {/* Plan Selector - Ocultar si es admin */}
        {!isAdminUser && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* SnapWish */}
            <div
              onClick={() => setSelectedPlan("snapwish")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === "snapwish"
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <p className="font-bold text-gray-800 text-center">SnapWish</p>
              <p className="text-2xl font-bold text-pink-500 text-center">$3.99</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "snapwish" ? null : "snapwish");
                }}
                className="mt-2 w-full text-xs text-pink-600 font-semibold flex items-center justify-center gap-1"
              >
                <Info className="w-4 h-4" />
                View details
              </button>
              {showDetails === "snapwish" && (
                <ul className="mt-2 text-xs text-gray-600 space-y-1">
                  {plans.snapwish.details.map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* WonderDream */}
            <div
              onClick={() => setSelectedPlan("wonderdream")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "wonderdream"
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="absolute -top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
                ⭐ Popular
              </span>
              <p className="font-bold text-gray-800 text-center">WonderDream</p>
              <p className="text-2xl font-bold text-purple-600 text-center">$7.99</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "wonderdream" ? null : "wonderdream");
                }}
                className="mt-2 w-full text-xs text-purple-700 font-semibold flex items-center justify-center gap-1"
              >
                <Info className="w-4 h-4" />
                View details
              </button>
              {showDetails === "wonderdream" && (
                <ul className="mt-2 text-xs text-gray-700 space-y-1">
                  {plans.wonderdream.details.map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Gift Card */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Gift Card (optional)
          </label>
          {selectedGiftAmount ? (
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-purple-700">
                  Gift Card: ${selectedGiftAmount}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-purple-600 text-sm font-bold"
                    onClick={() => setShowGiftModal(true)}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="text-pink-600 text-sm font-bold"
                    onClick={() => setSelectedGiftAmount(null)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGiftModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 font-semibold hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              + Add Gift Card
            </button>
          )}
        </div>

        {/* Total - Ocultar si es admin */}
        {!isAdminUser && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{plans[selectedPlan].name}</span>
              <span>${plans[selectedPlan].price.toFixed(2)}</span>
            </div>
            {selectedGiftAmount && (
              <div className="flex justify-between text-sm">
                <span>Gift Card</span>
                <span>${selectedGiftAmount}</span>
              </div>
            )}
            <div className="border-t mt-3 pt-2 flex justify-between">
              <span className="font-bold text-gray-800 text-lg">Total</span>
              <span className="font-bold text-purple-600 text-2xl">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Stripe Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            total={getTotal()}
            gift={selectedGiftAmount ? { amount: selectedGiftAmount } : null}
            onSuccess={handleSuccess}
            onError={handleError}
            isAdmin={isAdminUser}
            cardData={cardData}
          />
        </Elements>
      </div>

      {/* Gift Card Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[21000]">
          <div className="bg-white w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Gift Card Amount</h3>
            <div className="grid grid-cols-3 gap-3">
              {giftCardAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedGiftAmount(amount);
                    setShowGiftModal(false);
                  }}
                  className="p-3 border rounded-xl text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-200 transition"
                >
                  ${amount}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowGiftModal(false)}
              className="w-full mt-5 border py-2 text-sm rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
