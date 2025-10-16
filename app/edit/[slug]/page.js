"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CropperModal from "@/lib/croppermodal";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import { 
  defaultMessageFromSlug, 
  getAnimationsForSlug 
} from "@/lib";

export default function EditCardPage({ params }) {
  const { slug } = params;
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [gift, setGift] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [image, setImage] = useState(null);
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    // Mensaje y animaciones automáticas según slug
    setMessage(defaultMessageFromSlug(slug));
    setAnimations(getAnimationsForSlug(slug));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-start pt-10 pb-20 relative overflow-hidden">
      {/* 🌟 Animaciones flotantes */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-start mt-8 z-10 text-3xl opacity-80 animate-pulse select-none">
        {animation || animations[0]}
      </div>

      {/* 💌 Tarjeta centrada */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-3xl shadow-xl w-[90%] max-w-md overflow-hidden z-20"
      >
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#fefefe] flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt="Card preview"
                width={400}
                height={400}
                className="object-cover rounded-2xl"
              />
            ) : (
              <span className="text-gray-400 text-sm">🖼️ Card preview</span>
            )}
          </div>

          {/* ✨ Customize section */}
          <div className="mt-6 w-full text-center">
            <p className="font-semibold text-gray-800 text-lg mb-2">
              ✨ Customize your message ✨
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-2xl p-3 text-gray-700 focus:outline-none resize-none text-center"
              rows={2}
            />
          </div>

          {/* 🌈 Selector de animaciones */}
          <div className="mt-4 w-full">
            <select
              className="w-full border rounded-xl p-3 text-center text-gray-700"
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
            >
              {animations.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* 🖼️ Imagen */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setShowCrop(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full px-6 py-2 shadow-md"
            >
              Add Image
            </button>
          </div>

          {/* 🎁 Gift Card + 💳 Checkout */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowGift(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full px-6 py-2 shadow-md"
            >
              Gift Card
            </button>

            <button
              onClick={() => setShowCheckout(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full px-6 py-2 shadow-md"
            >
              Checkout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modales */}
      {showCrop && (
        <CropperModal
          onClose={() => setShowCrop(false)}
          onSave={(url) => setImage(url)}
        />
      )}

      {showGift && (
        <GiftCardPopup
          open={showGift}
          onClose={() => setShowGift(false)}
          onSelect={(data) => setGift(data)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
          gift={gift}
          slug={slug}
          animation={animation}
          message={message}
        />
      )}
    </div>
  );
                         }
