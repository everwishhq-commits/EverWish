// app/edit/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

/** Util: extrae el primer emoji/ícono de una etiqueta como "🎃 Pumpkin Glow" */
function pickEmoji(label) {
  if (!label || label.toLowerCase() === "none") return null;
  // toma el primer símbolo gráfico (emoji + ZWJ si existiera)
  const m = [...label.trim()][0];
  return m || null;
}

/** Capa de animación con emoji flotando (no muy rápido, no muy lento) */
function AnimationOverlay({ label }) {
  const emoji = pickEmoji(label);
  if (!emoji) return null;

  const ITEMS = 16; // cantidad de sprites flotando

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[35] overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: ITEMS }).map((_, i) => {
        const delay = i * 0.25;
        const duration = 6 + (i % 5) * 0.3;
        const startX = Math.random() * 100;
        const driftX = (Math.random() - 0.5) * 40; // -20% a 20%
        const startY = 110; // arranca fuera por abajo
        const endY = -15; // termina fuera por arriba
        const size = 18 + Math.floor(Math.random() * 10); // 18px–28px

        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              fontSize: `${size}px`,
              filter: "drop-shadow(0 2px 2px rgba(0,0,0,.15))",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              x: [`0%`, `${driftX}%`],
              y: [`0%`, `${endY - startY}%`],
              scale: [0.95, 1.05, 1],
              rotate: [0, (Math.random() - 0.5) * 20],
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

  // Etapas: pantalla extendida inicial → editor
  const [stage, setStage] = useState("expanded");

  // Estado principal
  const [message, setMessage] = useState("");
  const [animations, setAnimations] = useState([]); // lista (10) desde lib/animations
  const [animation, setAnimation] = useState("none"); // etiqueta activa (o "none")
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [total, setTotal] = useState(5);

  // Carga inicial: mensaje, animaciones, video
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug) || [];
    setAnimations(anims);
    setAnimation(anims[0] || "none"); // activa 1ra animación por defecto
    setVideoSrc(`/videos/${slug}.mp4`); // tu archivo está en public/videos
  }, [slug]);

  // Transición de expandida → editor (3s)
  useEffect(() => {
    const timer = setTimeout(() => setStage("editor"), 3000);
    return () => clearTimeout(timer);
  }, []);

  // GiftCard
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
      {/* Pantalla extendida: ocupa todo, sin barras visibles */}
      {stage === "expanded" && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          <video
            src={videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>
      )}

      {/* Editor */}
      {stage === "editor" && (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
        >
          {/* Media + Animación encima */}
          <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
            <video
              src={videoSrc}
              className="w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Capa de animación (encima del video, no tapa clicks) */}
            {animation && animation.toLowerCase() !== "none" && (
              <AnimationOverlay label={animation} />
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

          {/* Selector de animación (manual) */}
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

          {/* Botones principales */}
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
