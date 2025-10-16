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
  const [stage, setStage] = useState("editor");
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("none");
  const [animations, setAnimations] = useState([]);
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [total, setTotal] = useState(5);

  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug);
    setAnimations(anims);
    setAnimation(anims[0] || "none");
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };

  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  const handleCardClick = () => {
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = `${slug}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#fff7f5] min-h-[100dvh] overflow-hidden relative">

      {/* 🔸 Animaciones flotantes por encima de todo */}
      {animation !== "none" && (
        <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.img
              key={i}
              src={`/animations/${animation}/${i + 1}.png`}
              className="absolute w-10 h-10 opacity-40"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 200,
                scale: 0.8 + Math.random() * 0.5,
                rotate: Math.random() * 360,
              }}
              animate={{
                y: [-100, window.innerHeight + 200],
                x: [
                  Math.random() * window.innerWidth * 0.8,
                  Math.random() * window.innerWidth * 1.2,
                ],
                rotate: 360,
              }}
              transition={{
                duration: 25 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 6,
              }}
            />
          ))}
        </div>
      )}

      {/* 🟢 Contenedor principal */}
      <motion.div
        key="editor"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
      >
        <div
          className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50"
          onClick={handleCardClick}
        >
          <video
            src={videoSrc}
            className="w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
          ✨ Customize your message ✨
        </h3>

        <textarea
          className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Dropdown de animaciones */}
        <div className="my-3">
          <select
            className="w-full rounded-xl border p-3 text-center font-medium text-gray-600 focus:border-pink-400 focus:ring-pink-400"
            value={animation}
            onChange={(e) => setAnimation(e.target.value)}
          >
            <option value="none">🌙 No animation</option>
            {animations.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

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

        {showDownload && (
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            onClick={handleDownload}
            className="fixed bottom-10 right-6 z-[400] rounded-full bg-[#ff7b00] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#ff9f33]"
          >
            ⬇️ Download
          </motion.button>
        )}
      </motion.div>

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
          onDone={() => setShowCrop(false)}
        />
      )}
    </div>
  );
}
