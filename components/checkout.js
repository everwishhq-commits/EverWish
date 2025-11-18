"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send, Gift } from "lucide-react";

export default function CheckoutModal({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [expandedPlan, setExpandedPlan] = useState("wonderdream");
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");

  const [showGift, setShowGift] = useState(false);
  const [selectedGiftAmount, setSelectedGiftAmount] = useState(null);

  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [receiver, setReceiver] = useState({ name: "", email: "", phone: "" });

  const amounts = [5, 10, 15, 20, 25, 50, 100];

  const plans = {
    snapwish: {
      name: "SnapWish",
      price: 3.99,
      features: [
        "Static card",
        "Personalized message",
        "Optional gift card",
      ],
    },
    wonderdream: {
      name: "WonderDream",
      price: 7.99,
      recommended: true,
      features: [
        "Premium animated card",
        "Photo included",
        "Personalized message",
        "Optional gift card",
        "Magic animations",
      ],
    }
  };

  const toggleExpand = (plan) => {
    setExpandedPlan(expandedPlan === plan ? null : plan);
    setSelectedPlan(plan);
  };

  const totalPrice = (plans[selectedPlan].price + (selectedGiftAmount || 0)).toFixed(2);

  const handleCheckout = () => {
    alert(`Processing $${totalPrice} via Stripe...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 overflow-hidden">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
          Choose Your Everwish Experience
        </h2>

        {/*  PLAN SELECTION  */}
        <div className="space-y-4 mb-6">
          {Object.entries(plans).map(([key, plan]) => {
            const isOpen = expandedPlan === key;
            return (
              <div
                key={key}
                onClick={() => toggleExpand(key)}
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                  isOpen ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{plan.name}</p>
                    <p className="text-purple-600 font-bold text-xl">${plan.price}</p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="text-purple-600" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>

                {isOpen && (
                  <div className="mt-3 pl-1">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* GIFT CARD SECTION */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-800 mb-2">
            Add Gift Card <span className="text-pink-500">*</span>
          </label>

          <div
            onClick={() => setShowGift(!showGift)}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              showGift ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700 flex items-center gap-2">
                <Gift size={20} className="text-purple-600" />
                {selectedGiftAmount ? `Gift Card: $${selectedGiftAmount}` : "Add Gift Card Amount"}
              </p>

              {showGift ? (
                <ChevronUp className="text-purple-600" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </div>

            {showGift && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGiftAmount(amount);
                    }}
                    className={`py-2 rounded-xl font-semibold border transition-all ${
                      selectedGiftAmount === amount
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-purple-600 border-purple-300 hover:bg-purple-100"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SENDER / RECEIVER */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Sender Information <span className="text-pink-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-xl p-3 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-xl p-3 w-full"
              />
              <input
                type="tel"
                placeholder="+1 (Phone)"
                className="border rounded-xl p-3 w-full"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Recipient Information <span className="text-pink-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-xl p-3 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-xl p-3 w-full"
              />
              <input
                type="tel"
                placeholder="+1 (Phone)"
                className="border rounded-xl p-3 w-full"
              />
            </div>
          </div>
        </div>

        {/* TOTAL SUMMARY */}
        <div className="bg-pink-50 rounded-2xl p-4 mb-4">
          <div className="flex justify-between text-gray-700 mb-1">
            <span>{plans[selectedPlan].name} Plan</span>
            <span>${plans[selectedPlan].price.toFixed(2)}</span>
          </div>

          {selectedGiftAmount && (
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Gift Card</span>
              <span>${selectedGiftAmount}</span>
            </div>
          )}

          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-xl text-purple-700">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* CHECKOUT BUTTON */}
        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Send size={22} />
          Pay ${totalPrice}
        </button>
      </div>
    </div>
  );
}
