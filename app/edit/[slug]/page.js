// app/edit/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

/** Devuelve el emoji principal según el slug (animación automática) */
function emojiForSlug(slug) {
  const map = {
    "ghost-halloween": "👻",
    "pumpkin-halloween": "🎃",
    "bunny-easter": "🐰",
    "usa-4th-july": "🇺🇸",
    "pets-day": "🐾",
    "valentines-love": "❤️",
    "birthday-celebration": "🎉",
    "graduation-day": "🎓",
    "newyear-celebration": "✨",
    "christmas-day": "🎄",
  };
  return map[slug] || "✨";
}

/** Capa de animación con emojis flotando */
function AnimationOverlay({ emoji }) {
  const items = 14;
  return (
    <div className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
      {Array.from({ length: items }).map((_, i) => {
        const delay = i * 0.3;
        const duration = 5 + (i % 3);
        const startX = Math.random() * 100;
        const driftX = (Math.random() - 0.5) * 40;
        const size = 18 + Math.random() * 10;

        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${startX}%`,
              bottom: "-10%",
              fontSize: `${size}px`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ["0%", "-120%"],
              x: [`0%`, `${driftX}%`],
              rotate: [0, (Math.random() - 0.5) * 40],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function EditPage({ params }) {
  const slug = params.slug;
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("none");
  const [animations, setAnimations] = useState([]);
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [total, setTotal] = useState(5);
  const emoji = emojiForSlug(slug);

  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug) || [];
    setAnimations(anims);
    setAnimation(anims[0] || "none");
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  // Progreso de 3 segundos y cambio de etapa
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setStage("editor");
      }
    }, 30); // 30 ms * 100 = 3 segundos
    return () => clearInterval(interval);
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
      {/* Pantalla extendida con barra de carga */}
      {stage === "expanded" && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-[#fff7f5] flex flex-col items-center justify-center"
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
            <AnimationOverlay emoji={emoji} />
          </div>

          {/* Barra de progreso */}
          <div className="absolute bottom-8 w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.03, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {/* Editor */}
      {stage === "editor" && (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
        >
          {/* Video principal + animación */}
          <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
            <video
              src={videoSrc}
              className="w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {animation !== "none" && <AnimationOverlay emoji={emoji} />}
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

          {/* Selector de animación */}
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

          {/* Botones */}
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

      {/* Popups */}
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
