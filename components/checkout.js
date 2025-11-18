"use client";
import React, { useState } from "react";
import { X, Info } from "lucide-react";

export default function CheckoutModal({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGiftAmount, setSelectedGiftAmount] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

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
        "Gift card ready",
        "Magic animations included",
      ],
    },
  };

  const giftCardAmounts = [5, 10, 15, 20, 25, 50, 100];

  const getTotal = () => {
    let t = plans[selectedPlan].price;
    if (selectedGiftAmount) t += selectedGiftAmount;
    return t.toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col overflow-hidden">
        {/* Close */}
        <div className="flex justify-end p-3">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Checkout
            </h2>
          </div>

          {/* PLAN SELECTOR */}
          <div className="space-y-2.5 mb-4">
            {/* SnapWish */}
            <div
              onClick={() => setSelectedPlan("snapwish")}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === "snapwish"
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">SnapWish</span>
                <span className="text-pink-600 font-bold text-sm">$3.99</span>
              </div>

              {/* View Details */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "snapwish" ? null : "snapwish");
                }}
                className="mt-1.5 w-full text-xs text-pink-600 font-semibold flex items-center justify-center gap-1"
              >
                <Info size={12} />
                View details
              </button>

              {showDetails === "snapwish" && (
                <div className="mt-2 pt-2 border-t border-pink-200">
                  <ul className="space-y-0.5 text-xs text-gray-600">
                    {plans.snapwish.details.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* WonderDream */}
            <div
              onClick={() => setSelectedPlan("wonderdream")}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "wonderdream"
                  ? "border-purple-600 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="absolute -top-2 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                ⭐ Popular
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">WonderDream</span>
                <span className="text-purple-700 font-bold text-sm">$7.99</span>
              </div>

              {/* View Details */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(showDetails === "wonderdream" ? null : "wonderdream");
                }}
                className="mt-1.5 w-full text-xs text-purple-700 font-semibold flex items-center justify-center gap-1"
              >
                <Info size={12} />
                View details
              </button>

              {showDetails === "wonderdream" && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <ul className="space-y-0.5 text-xs text-gray-600">
                    {plans.wonderdream.details.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* GIFT CARD */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-semibold text-gray-700">
              Gift Card (optional)
            </label>

            {selectedGiftAmount ? (
              <div className="border-2 border-purple-200 bg-purple-50 rounded-xl p-2.5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-purple-700">
                      Gift Card: ${selectedGiftAmount}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowGiftModal(true)}
                      className="flex-1 bg-white border border-purple-300 text-purple-700 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-50 transition"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => setSelectedGiftAmount(null)}
                      className="flex-1 bg-white border border-gray-300 text-gray-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowGiftModal(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 text-gray-600 text-xs font-semibold hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition"
              >
                + Add Gift Card
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="space-y-2.5 mb-4">
            {/* Sender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Sender *
              </label>
              <input className="w-full border rounded-lg px-3 py-1.5 text-xs" placeholder="Your name" />
              <input className="w-full border rounded-lg px-3 py-1.5 text-xs" placeholder="Your email" />
              <div className="flex gap-1.5">
                <input className="w-20 border rounded-lg px-2 py-1.5 text-xs" placeholder="+1" />
                <input className="flex-1 border rounded-lg px-3 py-1.5 text-xs" placeholder="Phone number" />
              </div>
            </div>

            {/* Recipient */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Recipient *
              </label>
              <input className="w-full border rounded-lg px-3 py-1.5 text-xs" placeholder="Recipient name" />
              <input className="w-full border rounded-lg px-3 py-1.5 text-xs" placeholder="Recipient email" />
              <div className="flex gap-1.5">
                <input className="w-20 border rounded-lg px-2 py-1.5 text-xs" placeholder="+1" />
                <input className="flex-1 border rounded-lg px-3 py-1.5 text-xs" placeholder="Phone number" />
              </div>
            </div>
          </div>

          {/* TOTAL */}
          <div className="bg-gray-50 rounded-xl p-2.5 space-y-1.5 text-xs mb-4">
            <div className="flex justify-between cursor-pointer hover:text-purple-600 transition">
              <span>{plans[selectedPlan].name}</span>
              <span>${plans[selectedPlan].price.toFixed(2)}</span>
            </div>

            {selectedGiftAmount && (
              <div className="flex justify-between cursor-pointer hover:text-purple-600 transition">
                <span>Gift Card</span>
                <span>${selectedGiftAmount}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-sm border-t pt-1.5">
              <span>Total</span>
              <span>${getTotal()}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
            Pay ${getTotal()} Now
          </button>
        </div>
      </div>

      {/* GIFT CARD MODAL */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Select Gift Card Amount
            </h3>

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
              className="w-full mt-5 border py-2 text-sm rounded-xl hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
                        }
