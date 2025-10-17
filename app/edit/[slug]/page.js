// /app/edit/[slug]/page.js
"use client";
import { useState, useEffect } from "react";
import AnimatedOverlay from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";
import GiftCardModal from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import messages from "@/lib/messages";

export default function EditCardPage() {
  const [category, setCategory] = useState("paws");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [giftCards, setGiftCards] = useState([]);

  useEffect(() => {
    const categoryMessages = messages[category] || [];
    if (categoryMessages.length > 0) setMessage(categoryMessages[0]);
  }, [category]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
    setShowCropper(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-pink-50 py-6">
      <div className="relative w-80 bg-white rounded-3xl p-4 shadow-xl text-center overflow-hidden">
        <AnimatedOverlay category={category} active />
        <img
          src={`/cards/${category}.jpg`}
          className="rounded-2xl mb-3"
          alt="Card"
        />

        <textarea
          className="w-full text-center border rounded-xl p-2 text-sm mb-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {photo && (
          <img
            src={photo}
            className="rounded-xl mb-2 mx-auto"
            style={{ maxHeight: "150px", objectFit: "cover" }}
            alt="User upload"
          />
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-xl py-2 mb-3 text-center"
        >
          <option value="paws">Paws 🐾</option>
          <option value="pumpkins">Pumpkins 🎃</option>
          <option value="ghosts">Ghosts 👻</option>
          <option value="hearts">Hearts 💖</option>
        </select>

        <div className="flex justify-center gap-3">
          <label className="bg-yellow-400 text-black font-medium rounded-xl px-3 py-1 cursor-pointer">
            📸 Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>

          <button
            className="bg-pink-200 text-black font-medium rounded-xl px-3 py-1"
            onClick={() => setShowGift(true)}
          >
            🎁 Gift Card
          </button>

          <button
            className="bg-purple-600 text-white font-medium rounded-xl px-3 py-1"
            onClick={() => setShowCheckout(true)}
          >
            💳 Checkout
          </button>
        </div>
      </div>

      {showCropper && (
        <CropperModal
          imageSrc={photo}
          onSave={(url) => {
            setPhoto(url);
            setShowCropper(false);
          }}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {showGift && (
        <GiftCardModal
          onClose={() => setShowGift(false)}
          onSelect={(cards) => {
            setGiftCards(cards.map((name) => ({ name, amount: 50 })));
            setShowGift(false);
          }}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          giftCards={giftCards}
          onClose={() => setShowCheckout(false)}
          onConfirm={(plan) => {
            console.log("Plan:", plan);
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
            }
