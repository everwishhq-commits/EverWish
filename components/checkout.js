"use client";
import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Send } from "lucide-react";

export default function CheckoutModal({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");
  const [showDetailsSnap, setShowDetailsSnap] = useState(false);
  const [showDetailsWonder, setShowDetailsWonder] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [receiver, setReceiver] = useState({ name: "", email: "", phone: "" });

  const [selectedGiftAmount, setSelectedGiftAmount] = useState(null);

  const plans = {
    snapwish: {
      name: "SnapWish",
      price: 3.99,
      details: [
        "Static digital card",
        "Personalized message",
        "Optional gift card",
      ],
    },
    wonderdream: {
      name: "WonderDream",
      price: 7.99,
      details: [
        "Premium animated card",
        "Personalized message",
        "Upload your photo",
        "Optional gift card",
        "Magic animations included",
      ],
    },
  };

  const giftAmounts = [5, 10, 25, 50, 100];

  const getTotalPrice = () => {
    let base = plans[selectedPlan].price;
    if (selectedGiftAmount) base += selectedGiftAmount;
    return base.toFixed(2);
  };

  const handleCheckout = () => {
    alert(`Processing Stripe payment: $${getTotalPrice()}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-[99999]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        
        {/* ─── HEADER ─────────────────────────────────────────────── */}
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-5 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
          Checkout
        </h2>

        {/* ─── PLAN SELECTOR ─────────────────────────────────────── */}
        <div className="space-y-3 mb-6">
          {/* WonderDream */}
          <div
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlan === "wonderdream"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedPlan("wonderdream")}
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">WonderDream • ${plans.wonderdream.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsWonder(!showDetailsWonder);
                }}
                className="text-purple-600 text-sm flex items-center gap-1"
              >
                {showDetailsWonder ? "Hide details" : "See details"}
                {showDetailsWonder ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showDetailsWonder && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {plans.wonderdream.details.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            )}
          </div>

          {/* SnapWish */}
          <div
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPlan === "snapwish"
                ? "border-pink-400 bg-pink-50 shadow-md"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedPlan("snapwish")}
          >
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">SnapWish • ${plans.snapwish.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsSnap(!showDetailsSnap);
                }}
                className="text-pink-600 text-sm flex items-center gap-1"
              >
                {showDetailsSnap ? "Hide details" : "See details"}
                {showDetailsSnap ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showDetailsSnap && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {plans.snapwish.details.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ─── GIFT CARD (ONLY AMOUNT) ───────────────────────────── */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700 text-sm mb-2">Add Gift Card (optional)</p>

          {/* Selected gift */}
          {selectedGiftAmount ? (
            <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="font-medium text-gray-800">Gift Card: ${selectedGiftAmount}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGiftModal(true)}
                  className="text-purple-600 text-sm font-semibold"
                >
                  Change
                </button>
                <button
                  onClick={() => setSelectedGiftAmount(null)}
                  className="text-red-500 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowGiftModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 text-gray-600 text-sm font-semibold"
            >
              + Add Gift Card
            </button>
          )}
        </div>

        {/* ─── SENDER / RECEIVER ────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Sender</p>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded-lg text-sm mb-2"
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-lg text-sm mb-2"
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-2 border rounded-lg text-sm"
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Recipient</p>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded-lg text-sm mb-2"
              onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-lg text-sm mb-2"
              onChange={(e) => setReceiver({ ...receiver, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-2 border rounded-lg text-sm"
              onChange={(e) => setReceiver({ ...receiver, phone: e.target.value })}
            />
          </div>
        </div>

        {/* ─── TOTAL ────────────────────────────────────────────── */}
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-4">
          <div className="flex justify-between text-gray-700 text-sm">
            <span>{plans[selectedPlan].name} Card</span>
            <span>${plans[selectedPlan].price}</span>
          </div>

          {selectedGiftAmount && (
            <div className="flex justify-between text-gray-700 text-sm mt-2">
              <span>Gift Card</span>
              <span>${selectedGiftAmount}</span>
            </div>
          )}

          <div className="border-t border-purple-200 mt-3 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-purple-600">${getTotalPrice()}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Send className="w-5 h-5" />
          Pay ${getTotalPrice()}
        </button>
      </div>

      {/* ─── GIFT CARD MODAL ───────────────────────────────────── */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-[99999]">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Select Gift Card Amount</h3>

            <div className="grid grid-cols-3 gap-3">
              {giftAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedGiftAmount(amount);
                    setShowGiftModal(false);
                  }}
                  className="py-2 bg-purple-100 hover:bg-purple-600 hover:text-white rounded-lg font-semibold text-sm"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGiftModal(false)}
              className="w-full border mt-4 py-2 rounded-lg text-gray-600 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
