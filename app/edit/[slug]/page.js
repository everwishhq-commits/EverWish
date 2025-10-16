"use client";
import React, { useState } from "react";
import Image from "next/image";
import { defaultMessageFromSlug } from "../../../lib/messages";
import { CropperModal } from "../../../lib/croppermodal";
import { GiftCardPopup } from "../../../lib/giftcard";
import { CheckoutPopup } from "../../../lib/checkout";

export default function EditCardPage({ params }) {
  const { slug } = params;
  const [message, setMessage] = useState(defaultMessageFromSlug(slug));
  const [selectedAnimation, setSelectedAnimation] = useState("✨ Sparkles");
  const [selectedImage, setSelectedImage] = useState(null);
  const [giftCard, setGiftCard] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cardImage = `/cards/${slug}.png`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fdf6f6] py-6">
      {/* Card container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative">
        <div className="w-full aspect-square bg-[#fefaf9] flex justify-center items-center">
          <Image
            src={selectedImage || cardImage}
            alt="Card preview"
            width={800}
            height={800}
            className="object-contain w-full h-full"
          />
          {selectedImage && (
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-white/80 hover:bg-red-100 text-gray-700 rounded-full w-8 h-8 flex justify-center items-center shadow-md"
            >
              ✕
            </button>
          )}
        </div>

        {/* Message area */}
        <div className="p-4 bg-white rounded-t-3xl mt-[-1rem] shadow-inner">
          <p className="text-center text-gray-800 font-semibold mb-2">
            ✨ Customize your message ✨
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl p-3 text-center resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <div className="mt-2 flex justify-center">
            <select
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value)}
              className="border border-gray-200 rounded-xl p-2 text-center bg-gray-50"
            >
              <option>✨ Sparkles</option>
              <option>💖 Hearts</option>
              <option>🎉 Confetti</option>
              <option>🎈 Balloons</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-4 mb-2">
            <button
              onClick={() => setIsCropperOpen(true)}
              className="bg-[#ff6687] hover:bg-[#ff4e72] text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm"
            >
              Add Image
            </button>

            <button
              onClick={() => setIsGiftCardOpen(true)}
              className="bg-[#ffd24c] hover:bg-[#ffca2c] text-gray-800 text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm"
            >
              Gift Card
            </button>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-[#9b5de5] hover:bg-[#8740e1] text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isCropperOpen && (
        <CropperModal
          image={cardImage}
          onCropComplete={(img) => setSelectedImage(img)}
          onClose={() => setIsCropperOpen(false)}
        />
      )}
      {isGiftCardOpen && (
        <GiftCardPopup
          selected={giftCard}
          onSelect={(c) => setGiftCard(c)}
          onClose={() => setIsGiftCardOpen(false)}
        />
      )}
      {isCheckoutOpen && (
        <CheckoutPopup
          selectedGift={giftCard}
          plan="Heartfelt"
          price={giftCard ? 5 + giftCard.amount : 5}
          onPlanChange={() => {}}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
              }
