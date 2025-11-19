"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, Info, Loader2 } from "lucide-react";
import { isAdminUser, getCurrentUser } from "@/lib/admin-config";

// Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const hasValidStripeKey = /^pk_(test|live)_/.test(stripeKey || "");
const stripePromise = hasValidStripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ total, gift, onSuccess, onError, isAdmin, cardData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

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

  const validateForm = () => {
    const errors = [];
    if (!formData.senderName.trim()) errors.push("Sender name is required");
    if (!formData.senderEmail.trim()) errors.push("Sender email is required");
    if (!formData.recipientName.trim()) errors.push("Recipient name is required");
@@ -126,70 +127,108 @@ function CheckoutForm({ total, gift, onSuccess, onError, isAdmin, cardData }) {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.senderName,
              email: formData.senderEmail,
            },
          },
        });

      if (stripeError) throw new Error(stripeError.message);

      onSuccess({ type: "payment", paymentIntent });

    } catch (err) {
      setError(err.message);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={isAdmin ? handleAdminSend : handlePayment} className="space-y-4">

      {/* Sender */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Sender *</label>
        <input name="senderName" value={formData.senderName} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200" placeholder="Full Name" required/>
        <input name="senderEmail" type="email" value={formData.senderEmail} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400" placeholder="email@example.com" required/>
        <input name="senderPhone" type="tel" value={formData.senderPhone} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="+1 (555) 123-4567 (optional)"/>
      </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">Sender *</label>
          <input
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            placeholder="Full Name"
            required
          />
          <input
            name="senderEmail"
            type="email"
            value={formData.senderEmail}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400"
            placeholder="email@example.com"
            required
          />
          <input
            name="senderPhone"
            type="tel"
            value={formData.senderPhone}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            placeholder="+1 (555) 123-4567 (optional)"
          />
        </div>

      {/* Recipient */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Recipient *</label>
        <input name="recipientName" value={formData.recipientName} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Full Name" required/>
        <input name="recipientEmail" type="email" value={formData.recipientEmail} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="email@example.com" required/>
        <input name="recipientPhone" type="tel" value={formData.recipientPhone} onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="+1 (555) 123-4567 (optional)"/>
      </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">Recipient *</label>
          <input
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            placeholder="Full Name"
            required
          />
          <input
            name="recipientEmail"
            type="email"
            value={formData.recipientEmail}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            placeholder="email@example.com"
            required
          />
          <input
            name="recipientPhone"
            type="tel"
            value={formData.recipientPhone}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            placeholder="+1 (555) 123-4567 (optional)"
          />
        </div>

      {!isAdmin && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">💳 Payment Method *</label>
          <div className="border-2 border-gray-300 rounded-xl p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    fontFamily: "'Poppins', sans-serif",
                    color: "#424770",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-sm text-red-700 p-3 rounded-xl">
          <strong>Error:</strong> {error}
        </div>
      )}
@@ -213,197 +252,246 @@ function CheckoutForm({ total, gift, onSuccess, onError, isAdmin, cardData }) {
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isAdmin ? "Sending..." : "Processing Payment..."}
          </>
        ) : isAdmin ? (
          <>
            👑 Send FREE (Admin)
          </>
        ) : (
          <>💳 Pay ${total.toFixed(2)}</>
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
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeLoadError, setStripeLoadError] = useState("");

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

  useEffect(() => {
    if (!stripeKey) {
      setStripeLoadError(
        "Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en el entorno (.env.local)."
      );
      return;
    }

    if (!hasValidStripeKey) {
      setStripeLoadError(
        "La clave de Stripe debe empezar con pk_test_ o pk_live_. Revisa el valor configurado."
      );
      return;
    }

    if (stripePromise) {
      stripePromise.then((stripe) => setStripeReady(!!stripe)).catch(() => setStripeReady(false));
      stripePromise
        .then((stripe) => {
          setStripeReady(!!stripe);
          setStripeLoadError("");
        })
        .catch(() => {
          setStripeReady(false);
          setStripeLoadError(
            "No se pudo inicializar Stripe. Verifica la clave NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
          );
        });
    } else {
      setStripeLoadError(
        "No se pudo cargar Stripe en el navegador. Intenta recargar la página."
      );
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAdminUser(isAdminUser(user.email, user.phone));
    }
  }, []);

  const handleSuccess = (result) => {
    if (result.type === "payment") {
      alert("🎉 Payment successful! Your card will be sent shortly.");
      window.location.href = "/success";
    } else {
      alert("✅ Card sent successfully!");
      onClose();
    }
  };

  const handleError = (error) => console.error("❌ Error:", error);

  if (!stripeReady && !isAdminUser) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-500" />
          <h3 className="text-xl font-bold mb-2">Loading Payment System...</h3>
          <p className="text-gray-600 text-sm mb-4">Initializing secure payment with Stripe</p>

          {!stripeKey && (
          {stripeLoadError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
              <strong>Configuration Error:</strong> Stripe key is missing.
              <strong>Configuration Error:</strong> {stripeLoadError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
          {isAdminUser ? "👑 Admin Checkout" : "Checkout"}
        </h2>

        {!isAdminUser && (
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* SNAPWISH */}
            <button
              type="button"
              onClick={() => setSelectedPlan("snapwish")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === "snapwish"
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <p className="font-bold text-center text-gray-800">SnapWish</p>
              <p className="text-2xl font-bold text-pink-500 text-center">$3.99</p>

              <button
                type="button"
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "snapwish" ? null : "snapwish");
                }}
                className="mt-2 w-full text-xs text-pink-600 font-semibold flex items-center justify-center gap-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDetails(showDetails === "snapwish" ? null : "snapwish");
                  }
                }}
                className="mt-2 w-full text-xs text-pink-600 font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Info className="w-4 h-4" /> View details
              </button>
              </div>

              {showDetails === "snapwish" && (
                <ul className="mt-2 text-xs text-gray-600 space-y-1">
                  {plans.snapwish.details.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              )}
            </button>

            {/* WONDERDREAM */}
            <button
              type="button"
              onClick={() => setSelectedPlan("wonderdream")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "wonderdream"
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <span className="absolute -top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">⭐ Popular</span>
              <p className="font-bold text-gray-800 text-center">WonderDream</p>
              <p className="text-2xl font-bold text-purple-600 text-center">$7.99</p>

              <button
                type="button"
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "wonderdream" ? null : "wonderdream");
                  setShowDetails(
                    showDetails === "wonderdream" ? null : "wonderdream"
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDetails(
                      showDetails === "wonderdream" ? null : "wonderdream"
                    );
                  }
                }}
                className="mt-2 w-full text-xs text-purple-700 font-semibold flex items-center justify-center gap-1"
                className="mt-2 w-full text-xs text-purple-700 font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Info className="w-4 h-4" /> View details
              </button>
              </div>

              {showDetails === "wonderdream" && (
                <ul className="mt-2 text-xs text-gray-700 space-y-1">
                  {plans.wonderdream.details.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              )}
            </button>

          </div>
        )}

        {/* Gift Card */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">🎁 Gift Card (optional)</label>

          {selectedGiftAmount ? (
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-purple-700">Gift Card: ${selectedGiftAmount}</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowGiftModal(true)} className="text-purple-600 text-sm font-bold hover:underline">Change</button>
                  <button onClick={() => setSelectedGiftAmount(null)} className="text-pink-600 text-sm font-bold hover:underline">Remove</button>
                </div>
@@ -471,26 +559,26 @@ export default function CheckoutModal({ total, gift, onClose, cardData }) {
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedGiftAmount(amount);
                    setShowGiftModal(false);
                  }}
                  className="p-3 border-2 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-200 border-purple-300 hover:border-purple-500 transition"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGiftModal(false)}
              className="w-full mt-5 border-2 py-3 text-sm rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
  }
}
