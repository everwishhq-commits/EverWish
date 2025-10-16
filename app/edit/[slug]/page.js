"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [stage, setStage] = useState("expanded"); // expanded -> pantalla completa / editor -> edición
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [total, setTotal] = useState(5);

  // 🔹 Configura el video y datos del slug
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug);
    setAnimation(anims[0]);
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  // 🔹 Transición automática (pantalla completa → edición)
  useEffect(() => {
    const timer = setTimeout(() => setStage("editor"), 3000);
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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#fff7f5] overflow-hidden">
      {/* 🖥️ Pantalla extendida */}
      {stage === "expanded" && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff7f5]"
          style={{ overscrollBehavior: "none" }}
        >
          <video
            src={videoSrc}
            className="w-full h-full object-contain"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>
      )}

      {/* ✏️ Pantalla de edición */}
      {stage === "editor" && (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
        >
          {/* Video principal */}
          <div className="mb-4 overflow-hidden rounded-2xl border bg-gray-50">
            <video
              key={slug}
              src={videoSrc}
              className="w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          {/* Texto */}
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
            ✨ Customize your message ✨
          </h3>
          <textarea
            className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Animaciones */}
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
              className="flex items-center gap-2 rounded-full bg-green-400 px-5 py-3 font-semibold text-[#103b1f] shadow-sm hover:bg-green-300"
            >
              💳 Checkout
            </button>
          </div>

          {/* Totales */}
          <div className="mt-5 text-center text-sm text-gray-600">
            Total: ${total.toFixed(2)}
          </div>
        </motion.div>
      )}

      {/* 🔹 Modales */}
      {showGift && (
        <GiftCardPopup
          onClose={() => setShowGift(false)}
          onSelect={updateGift}
          current={gift}
          onRemove={removeGift}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          total={total}
          gift={gift}
          message={message}
        />
      )}
      {showCrop && (
        <CropperModal
          onClose={() => setShowCrop(false)}
          onSave={(img) => console.log("Saved image:", img)}
        />
      )}
    </div>
  );
                }
