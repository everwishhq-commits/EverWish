"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { animationoverlay, getanimationoptionsforslug } from "@/lib/animations";
import { defaultMessageFromSlug, getMessagesForSlug } from "@/lib/messages";
import CheckoutModal from "@/lib/checkout";
import GiftCardModal from "@/lib/giftcard";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [animation, setAnimation] = useState("ninguna animación");
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [cropped, setCropped] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [gift, setGift] = useState(null);

  const animationOptions = getanimationoptionsforslug();

  // ✅ Inicialización automática
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    setSuggestions(getMessagesForSlug(slug));
    setAnimation("ninguna animación");
  }, [slug]);

  // ✅ Al cambiar animación, activar transición inmediata
  useEffect(() => {
    if (animation && animation !== "ninguna animación") {
      // Pequeña animación de entrada
      document.body.classList.add("transition-all");
    }
  }, [animation]);

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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 p-6">
      {/* 🔹 Animación flotante (detrás de los modales, encima del contenedor principal) */}
      <div className="absolute inset-0 z-[400] pointer-events-none">
        <animationoverlay animation={animation} />
      </div>

      {/* 🔸 Tarjeta principal */}
      <motion.div
        className="relative z-[500] w-full max-w-md rounded-3xl bg-white shadow-xl p-4 text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Imagen de tarjeta */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-tr from-white to-pink-50">
          <Image
            src={`/${slug}.jpg`}
            alt="Card"
            fill
            className="object-cover rounded-2xl"
            priority
          />
        </div>

        {/* Mensaje editable */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            ✨ Customize your message ✨
          </h3>
          <textarea
            className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* 💡 Sugerencias */}
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {suggestions.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(m)}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown de animaciones */}
        <div className="mt-4">
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value)}
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
            onClick={() => setIsGiftModalOpen(true)}
            className="bg-pink-300 text-white font-semibold px-4 py-2 rounded-full hover:bg-pink-400"
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

      {/* 🪞 Modal Cropper */}
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
                  onClick={() => {
                    setCropped(imageSrc);
                    setIsCropOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-pink-500 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 Checkout Modal */}
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

      {/* 🎁 GiftCard Modal */}
      <AnimatePresence>
        {isGiftModalOpen && (
          <GiftCardModal
            onclose={() => setIsGiftModalOpen(false)}
            onselect={(g) => {
              setGift(g);
              setIsGiftModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
