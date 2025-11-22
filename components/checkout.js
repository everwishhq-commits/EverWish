"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, Loader2 } from "lucide-react";
import { isAdminUser, getCurrentUser } from "@/lib/admin-config";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey) 
  : Promise.resolve(null);

function CheckoutForm({ total, onSuccess, onError, isAdmin, cardData }) {
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
    
    if (!formData.senderName?.trim()) errors.push("Sender name is required");
    if (!formData.senderEmail?.trim()) errors.push("Sender email is required");
    if (!formData.recipientName?.trim()) errors.push("Recipient name is required");
    if (!formData.recipientEmail?.trim()) errors.push("Recipient email is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.senderEmail && !emailRegex.test(formData.senderEmail)) {
      errors.push("Sender email format is invalid");
    }
    if (formData.recipientEmail && !emailRegex.test(formData.recipientEmail)) {
      errors.push("Recipient email format is invalid");
    }
    
    if (errors.length > 0) {
      setError(errors.join(". "));
      return false;
    }
    
    return true;
  };

  const handleAdminSend = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);
    setError(null);

    try {
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

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded. Please refresh the page.");
      return;
    }

    if (!validateForm()) return;

    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
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
          cardSlug: cardData?.slug || "custom-card",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error creating payment");
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error("No client secret received from server");
      }

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

      // 🔗 Guardar tarjeta y obtener link
      try {
        const saveRes = await fetch("/api/save-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            sender: {
              name: formData.senderName,
              email: formData.senderEmail,
              phone: formData.senderPhone || "",
            },
            recipient: {
              name: formData.recipientName,
              email: formData.recipientEmail,
              phone: formData.recipientPhone || "",
            },
            cardData: {
              slug: cardData?.slug || "custom-card",
              message: cardData?.message || "",
              animation: cardData?.animation || "",
            },
            amount: Math.round(total * 100),
          }),
        });

        const saveData = await saveRes.json();

        if (saveRes.ok && saveData.success) {
          // 💾 Guardar usuario en localStorage
          localStorage.setItem("everwishUser", JSON.stringify({
            email: formData.senderEmail,
            phone: formData.senderPhone || "",
            name: formData.senderName,
            everwishId: saveData.everwishId,
          }));
          
          console.log('✅ Card saved successfully!');
          console.log('🔗 Card link:', saveData.cardLink);
          
          // 🎉 Mostrar link al usuario
          alert(`✅ Card created!\n\n🔗 Share this link:\n${saveData.cardLink}`);
        } else {
          console.error("Error saving to Drive:", saveData.error);
        }
      } catch (saveError) {
        console.error("Error saving card:", saveError);
      }

      onSuccess({
        type: "payment",
        paymentIntent,
      });

    } catch (err) {
      setError(err.message);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={isAdmin ? handleAdminSend : handlePayment} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Sender *</label>
        <input
          name="senderName"
          value={formData.senderName}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="Full Name"
          required
        />
        <input
          name="senderEmail"
          type="email"
          value={formData.senderEmail}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="email@example.com"
          required
        />
        <input
          name="senderPhone"
          type="tel"
          value={formData.senderPhone}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="+1 (555) 123-4567 (optional)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-600">Recipient *</label>
        <input
          name="recipientName"
          value={formData.recipientName}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="Full Name"
          required
        />
        <input
          name="recipientEmail"
          type="email"
          value={formData.recipientEmail}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="email@example.com"
          required
        />
        <input
          name="recipientPhone"
          type="tel"
          value={formData.recipientPhone}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-3 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="+1 (555) 123-4567 (optional)"
        />
      </div>

      {!isAdmin && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600">
            💳 Payment Method *
          </label>
          <div className="border-2 border-gray-300 rounded-xl p-4 bg-white hover:border-pink-400 transition">
            {stripe && elements ? (
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "'Poppins', sans-serif",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading Stripe...</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isAdmin && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-700 flex items-center gap-2">
          <span className="text-xl">👑</span>
          <span className="font-semibold">Admin Mode: Sending FREE</span>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || (!stripe && !isAdmin)}
        className={`w-full rounded-xl py-4 font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : isAdmin
            ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
            : "bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl hover:scale-105"
        }`}
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isAdmin ? "Sending..." : "Processing Payment..."}
          </>
        ) : isAdmin ? (
          <>
            <span>👑</span>
            Send FREE (Admin)
          </>
        ) : (
          <>
            💳 Pay ${total.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}

export default function CheckoutModal({ total, onClose, cardData }) {
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");
  const [showDetails, setShowDetails] = useState(null);
  const [isAdminUserState, setIsAdminUserState] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);

  const plans = {
    snapwish: {
      name: "SnapWish",
      price: 3.99,
      details: [
        "Static digital card",
        "Personalized message",
        "Instant delivery",
      ],
    },
    wonderdream: {
      name: "WonderDream",
      price: 7.99,
      details: [
        "Premium animated card",
        "Personalized message",
        "Upload your photo",
        "Magic animations included",
      ],
    },
  };

  const getTotal = () => {
    return plans[selectedPlan].price;
  };

  useEffect(() => {
    if (stripePromise) {
      stripePromise.then((stripe) => {
        setStripeReady(!!stripe);
      }).catch(() => {
        setStripeReady(false);
      });
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const adminCheck = isAdminUser(user.email, user.phone);
      setIsAdminUserState(adminCheck);
    }
  }, []);

  const handleSuccess = (result) => {
    if (result.type === "payment") {
      window.location.href = "/success";
    } else {
      alert("✅ Card sent successfully!");
      onClose();
    }
  };

  const handleError = (error) => {
    console.error("❌ Error:", error);
  };

  if (!stripeReady && !isAdminUserState) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-500" />
          <h3 className="text-xl font-bold mb-2">Loading Payment System...</h3>
          <p className="text-gray-600 text-sm mb-4">
            Initializing secure payment with Stripe
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
          {isAdminUserState ? "👑 Admin Checkout" : "Checkout"}
        </h2>

        {!isAdminUserState && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
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
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "snapwish" ? null : "snapwish");
                }}
                className="mt-2 w-full text-xs text-pink-600 font-semibold"
              >
                View details
              </button>
              {showDetails === "snapwish" && (
                <ul className="mt-2 text-xs text-gray-600 space-y-1">
                  {plans.snapwish.details.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              )}
            </button>

            <button
              type="button"
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
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "wonderdream" ? null : "wonderdream");
                }}
                className="mt-2 w-full text-xs text-purple-700 font-semibold"
              >
                View details
              </button>
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

        {!isAdminUserState && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border border-pink-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-lg">Total</span>
              <span className="font-bold text-purple-600 text-3xl">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              total={getTotal()}
              onSuccess={handleSuccess}
              onError={handleError}
              isAdmin={isAdminUserState}
              cardData={cardData}
            />
          </Elements>
        ) : (
          <div className="text-center py-8 text-red-600">
            <strong>Error:</strong> Stripe is not configured properly.
          </div>
        )}
      </div>
    </div>
  );
}
