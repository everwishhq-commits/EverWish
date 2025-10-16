// ✅ /app/edit/[slug]/page.js
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { defaultMessageFromSlug } from "../../../lib/messages";
import { getAnimationsForSlug } from "../../../lib/animations";
import { CropperModal } from "../../../lib/croppermodal";
import { GiftCardPopup } from "../../../lib/giftcard";
import { CheckoutPopup } from "../../../lib/checkout";

export default function EditPage({ params }) {
  const { slug } = params;
  const [message, setMessage] = useState(defaultMessageFromSlug(slug));
  const [userImage, setUserImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [plan, setPlan] = useState("Signature");
  const [price, setPrice] = useState(7.99);

  const animations = getAnimationsForSlug(slug);

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUserImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped) => {
    setUserImage(cropped);
    setShowCropper(false);
  };

  const handleGiftSelect = (gift) => {
    setSelectedGift(gift);
    setShowGift(false);
  };

  const handleCheckout = () => setShowCheckout(true);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-50 to-white text-gray-800">
      {/* CARD PREVIEW */}
      <div className="w-full max-w-sm mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {animations?.video ? (
            <video
              src={animations.video}
              autoPlay
              loop
              muted
              playsInline
              className="object-contain w-full h-full"
            />
          ) : (
            <Image
              src={animations.image || "/placeholder.png"}
              alt="Card preview"
              fill
              className="object-contain"
            />
          )}
          {userImage && (
            <div className="absolute inset-0 flex justify-center items-center bg-white/10">
              <Image
                src={userImage}
                alt="User uploaded"
                width={300}
                height={300}
                className="rounded-lg object-contain"
              />
              <button
                onClick={() => setUserImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* MESSAGE */}
        <div className="p-4 text-center">
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-around px-4 pb-5 gap-3">
          <button
            onClick={() => document.getElementById("imageInput").click()}
            className="bg-rose-400 hover:bg-rose-500 text-white rounded-full py-2 px-4 font-semibold text-sm"
          >
            Add Image
          </button>
          <button
            onClick={() => setShowGift(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full py-2 px-4 font-semibold text-sm"
          >
            Gift Card
          </button>
          <button
            onClick={handleCheckout}
            className="bg-green-400 hover:bg-green-500 text-gray-900 rounded-full py-2 px-4 font-semibold text-sm"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* HIDDEN INPUT */}
      <input
        type="file"
        accept="image/*"
        id="imageInput"
        onChange={(e) => handleImageUpload(e.target.files[0])}
        className="hidden"
      />

      {/* MODALS */}
      {showCropper && (
        <CropperModal
          image={userImage}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {showGift && (
        <GiftCardPopup
          selected={selectedGift}
          onClose={() => setShowGift(false)}
          onSelect={handleGiftSelect}
        />
      )}

      {showCheckout && (
        <CheckoutPopup
          selectedGift={selectedGift}
          plan={plan}
          price={price}
          onPlanChange={(p) => {
            setPlan(p);
            setPrice(p === "Signature" ? 7.99 : 3.99);
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
