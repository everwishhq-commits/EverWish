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
  const [stage, setStage] = useState("expanded");
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [total, setTotal] = useState(5);

  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug);
    setAnimation(anims[0] || "none"); // 👈 animación predeterminada según la tarjeta
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

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
    <div className="flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden min-h-[100dvh]">
      {stage === "expanded" && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-[#fff7f5] overflow-hidden"
        >
          <div className="relative w-full h-full">
            <video
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </motion.div>
      )}

      {stage === "editor" && (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
        >
          {/* 🟣 Video principal con animación superpuesta */}
          <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
            <video
              src={videoSrc}
              className="w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* si hay animación activa, se superpone aquí */}
            {animation !== "none" && (
              <video
                src={animation}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
                style={{ opacity: 0.7 }}
              />
            )}
          </div>

          {/* texto personalizado */}
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
            ✨ Customize your message ✨
          </h3>
          <textarea
            className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* selector de animación */}
          <div className="my-3">
            <select
              className="w-full rounded-xl border p-3 text-center font-medium text-gray-600 focus:border-pink-400 focus:ring-pink-400"
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
            >
              <option value="none">🌙 No animation</option>
              {getAnimationsForSlug(slug).map((a) => (
                <option key={a} value={a}>
                  {a.split("/").pop()}
                </option>
              ))}
            </select>
          </div>

          {/* botones */}
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

      {/* popups */}
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
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
    }
