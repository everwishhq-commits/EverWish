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
    <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
          Checkout
        </h2>

        {/* PLAN SELECTOR */}
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

            {/* View Details */}
            <button
              onClick={() => setShowDetails(showDetails === "snapwish" ? null : "snapwish")}
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

            {/* View Details */}
            <button
              onClick={() => setShowDetails(showDetails === "wonderdream" ? null : "wonderdream")}
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

        {/* GIFT CARD */}
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
                    className="text-purple-600 text-sm font-bold"
                    onClick={() => setShowGiftModal(true)}
                  >
                    Change
                  </button>
                  <button
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
              onClick={() => setShowGiftModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 font-semibold hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              + Add Gift Card
            </button>
          )}
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Sender */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">
              Sender *
            </label>
            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-1" placeholder="Name" />
            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-1" placeholder="Email" />
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Phone" />
          </div>

          {/* Recipient */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">
              Recipient *
            </label>
            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-1" placeholder="Name" />
            <input className="w-full border rounded-xl px-3 py-2 text-sm mb-1" placeholder="Email" />
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Phone" />
          </div>
        </div>

        {/* TOTAL */}
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
            <span className="font-bold text-purple-600 text-2xl">${getTotal()}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-xl text-lg">
          Pay ${getTotal()} Now
        </button>
      </div>

      {/* GIFT CARD MODAL */}
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
