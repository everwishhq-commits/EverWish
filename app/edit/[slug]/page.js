"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [showEditor, setShowEditor] = useState(false);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [image, setImage] = useState(null);
  const [total, setTotal] = useState(5);

  // iniciar mensaje y animaciones base
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug);
    setAnimation(anims[0]);
  }, [slug]);

  // transición pantalla completa → editor
  useEffect(() => {
    const timer = setTimeout(() => setShowEditor(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };

  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  return (
    <div className="min-h-screen bg-[#fff7f5] flex flex-col items-center justify-center py-10">
      {!showEditor ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex h-[80vh] w-full items-center justify-center"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
            <Image
              src={`/cards/${slug}.png`}
              alt="Card preview"
              width={600}
              height={600}
              className="h-auto w-full object-cover"
            />
            <p className="absolute bottom-6 w-full text-center text-gray-500">
              Card preview
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl"
        >
          {/* Imagen principal */}
          <div className="mb-4 overflow-hidden rounded-2xl border bg-gray-50">
            {image ? (
              <img
                src={image}
                alt="uploaded"
                className="w-full object-cover"
              />
            ) : (
              <Image
                src={`/cards/${slug}.png`}
                alt="Card"
                width={600}
                height={600}
                className="w-full object-cover"
              />
            )}
          </div>

          {/* Mensaje */}
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
            ✨ Customize your message ✨
          </h3>
          <textarea
            className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Selector animación */}
          <div className="my-3">
            <select
              className="w-full rounded-xl border p-3 text-center font-medium text-gray-600 focus:border-pink-400 focus:ring-pink-400"
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
            >
              {getAnimationsForSlug(slug).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Botones inferiores */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowCrop(true)}
              className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-[#3b2b1f] shadow-sm hover:bg-yellow-300"
            >
              📸 Add Image
            </button>
            <button
              onClick={() => setShowGift(true)}
              className="flex items-center gap-2 rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 shadow-sm hover:bg-pink-300"
            >
              🎁 Gift Card
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-purple-600"
            >
              💳 Checkout
            </button>
          </div>
        </motion.div>
      )}

      {/* Modales */}
      {showGift && (
        <GiftCardPopup
          initial={gift}
          onSelect={updateGift}
          onClose={() => setShowGift(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          total={total}
          gift={gift}
          onGiftChange={() => setShowGift(true)}
          onGiftRemove={removeGift}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {showCrop && (
        <CropperModal
          open={showCrop}
          onClose={() => setShowCrop(false)}
          onDone={(url) => {
            setImage(url);
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
            }
