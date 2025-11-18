
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

        {/* Close */}

        {/* Header */}

          Checkout

        {/* PLAN SELECTOR */}

          {/* SnapWish */}

 setSelectedPlan("snapwish")}
            className={p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPlan === "snapwish"
                ? "border-pink-500 bg-pink-50 shadow-md"
                : "border-gray-200 hover:border-pink-300"
            }}
          >

SnapWish

$3.99

            {/* View Details */}
             setShowDetails(showDetails === "snapwish" ? null : "snapwish")}
              className="mt-2 w-full text-xs text-pink-600 font-semibold flex items-center justify-center gap-1"
            >

              View details

            {showDetails === "snapwish" && (

                {plans.snapwish.details.map((d) => (

• {d}

                ))}

            )}

          {/* WonderDream */}

 setSelectedPlan("wonderdream")}
            className={p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
              selectedPlan === "wonderdream"
                ? "border-purple-600 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300"
            }}
          >

              ⭐ Popular

WonderDream

$7.99

            {/* View Details */}
             setShowDetails(showDetails === "wonderdream" ? null : "wonderdream")}
              className="mt-2 w-full text-xs text-purple-700 font-semibold flex items-center justify-center gap-1"
            >

              View details

            {showDetails === "wonderdream" && (

                {plans.wonderdream.details.map((d) => (

• {d}

                ))}

            )}

        {/* GIFT CARD */}

            Gift Card (optional)

          {selectedGiftAmount ? (

                  Gift Card: ${selectedGiftAmount}

                   setShowGiftModal(true)}
                  >
                    Change

                   setSelectedGiftAmount(null)}
                  >
                    Remove

          ) : (
             setShowGiftModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 font-semibold hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              + Add Gift Card

          )}

        {/* FORM */}

          {/* Sender */}

              Sender *

          {/* Recipient */}

              Recipient *

        {/* TOTAL */}

            {plans[selectedPlan].name}
            ${plans[selectedPlan].price.toFixed(2)}

          {selectedGiftAmount && (

              Gift Card
              ${selectedGiftAmount}

          )}

            Total
            ${getTotal()}

        {/* Pay Button */}

          Pay ${getTotal()} Now

      {/* GIFT CARD MODAL */}
      {showGiftModal && (

Select Gift Card Amount

              {giftCardAmounts.map((amount) => (
                 {
                    setSelectedGiftAmount(amount);
                    setShowGiftModal(false);
                  }}
                  className="p-3 border rounded-xl text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-200 transition"
                >
                  ${amount}

              ))}

             setShowGiftModal(false)}
              className="w-full mt-5 border py-2 text-sm rounded-xl"
            >
              Close

      )}

  );
                      } 
