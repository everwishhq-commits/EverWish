// app/edit/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { defaultMessageFromSlug } from "@/lib/messages";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;

  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);

  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);

  const [videoSrc, setVideoSrc] = useState("");
  const [showDownload, setShowDownload] = useState(false);

  /* Inicial: mensaje, opciones, video */
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts[0] || "Stars ✨"); // arranca activo
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  /* Splash extendida 3s */
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const handleCardClick = () => {
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3500);
  };

  const onSelectGift = (data) => {
    setGift(data);
    setShowGift(false);
  };
  const onRemoveGift = () => setGift(null);

  const onChangeAnim = (e) => setAnimation(e.target.value); // cambio inmediato

  return (
    <div className="flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden min-h-[100dvh] relative">

      {/* Overlay SIEMPRE arriba */}
      {stage === "editor" && animation && (
        <AnimationOverlay slug={slug} animation={animation} />
      )}

      {/* Splash */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
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
          transition={{ duration: 0.5 }}
          className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
        >
          {/* Tarjeta */}
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

          {/* Imagen (si el usuario sube, va DEBAJO del mensaje) */}
          {image && (
            <div className="mt-3 mb-1 flex justify-center">
              <img
                src={image}
                alt="user"
                className="max-h-44 rounded-xl object-cover"
              />
            </div>
          )}

          {/* Dropdown animaciones */}
          <div className="my-3">
            <select
              className="w-full rounded-xl border p-3 text-center font-medium text-gray-600 focus:border-pink-400 focus:ring-pink-400"
              value={animation}
              onChange={onChangeAnim}
            >
              {animationOptions.map((a) => (
                <option key={a}>{a}</option>
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

          {/* Botón de descarga opcional */}
          {showDownload && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
              onClick={() => {}}
              className="fixed bottom-10 right-6 z-[400] rounded-full bg-[#ff7b00] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#ff9f33]"
            >
              ⬇️ Download
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Modales (siempre por encima) */}
      {showGift && (
        <GiftCardPopup
          initial={gift}
          onSelect={onSelectGift}
          onClose={() => setShowGift(false)}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          total={0}
          gift={gift}
          onGiftChange={() => setShowGift(true)}
          onGiftRemove={onRemoveGift}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {showCrop && (
        <CropperModal
          open={showCrop}
          onClose={() => setShowCrop(false)}
          onDone={(file) => {
            // usar dataUrl/Blob en memoria (no se guarda en tu servidor)
            setImage(file?.dataUrl || null);
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
                }
