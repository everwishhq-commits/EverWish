"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { AnimationOverlay, getAnimationOptionsForSlug } from "@/lib/animations";
import { defaultMessageFromSlug } from "@/lib/messages";
import GiftCardModal from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [gift, setGift] = useState(null);

  const animationOptions = getAnimationOptionsForSlug(slug);

  // ✅ Inicialización automática
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    setAnimation(animationOptions[0]); // primera animación activa de inmediato
  }, [slug]);

  // ✅ Cambio instantáneo de animación
  const handleAnimationChange = (value) => {
    setAnimation(value);
  };

  // ✅ Subida de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 p-6 overflow-hidden">
      {/* 🔹 Animación activa encima del contenedor */}
      <div className="absolute inset-0 z-[400] pointer-events-none">
        <AnimationOverlay animation={animation} />
      </div>

      {/* 🔸 Tarjeta principal */}
      <motion.div
        className="relative z-[500] w-full max-w-md rounded-3xl bg-white shadow-xl p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Imagen principal */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={`/${slug}.jpg`}
            alt="Card"
            fill
            className="object-cover rounded-2xl"
            priority
          />
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="User upload"
              fill
              className="object-contain p-6"
            />
          )}
        </div>

        {/* Mensaje */}
        <div className="mt-4">
          <textarea
            className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Dropdown de animaciones */}
        <div className="mt-4">
          <select
            value={animation}
            onChange={(e) => handleAnimationChange(e.target.value)}
            className="w-full rounded-xl border p-2 text-center text-gray-700 shadow-sm"
          >
            {animationOptions.map((a, i) => (
              <option key={i} value={a}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botones principales */}
        <div className="flex justify-center gap-3 mt-5">
          <label className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-yellow-500">
            📸 Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsGiftOpen(true)}
            className="bg-pink-400 text-white font-semibold px-4 py-2 rounded-full hover:bg-pink-500"
          >
            🎁 Gift Card
          </button>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-600"
          >
            💳 Checkout
          </button>
        </div>
      </motion.div>

      {/* ✂️ Crop Modal */}
      <AnimatePresence>
        {isCropOpen && (
          <motion.div
            className="fixed inset-0 z-[900] flex items-center justify-center bg-black/30 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-3xl p-4 w-full max-w-sm shadow-xl text-center">
              <h3 className="text-lg font-semibold mb-3">✂️ Edit and Center Your Image</h3>
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                <Cropper image={imageSrc} zoom={zoom} aspect={1} onZoomChange={setZoom} />
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full mt-2"
              />
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setIsCropOpen(false)}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsCropOpen(false)}
                  className="px-4 py-2 rounded-full bg-pink-500 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎁 Gift Modal */}
      <AnimatePresence>
        {isGiftOpen && (
          <GiftCardModal
            onclose={() => setIsGiftOpen(false)}
            onselect={(g) => {
              setGift(g);
              setIsGiftOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* 💳 Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            total={0}
            gift={gift}
            onclose={() => setIsCheckoutOpen(false)}
            ongiftremove={() => setGift(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
