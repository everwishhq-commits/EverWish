"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAnimationsForSlug,
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
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [photo, setPhoto] = useState(null);

  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [total, setTotal] = useState(5);

  /* 🔹 Inicialización */
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts[0] || "Stars ✨");
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  /* 🔹 Pantalla extendida */
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

  /* 🎁 Gift */
  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  /* 📸 Foto */
  const handlePhotoDone = (blob) => {
    setPhoto(blob);
    setShowCrop(false);
  };

  /* ⚡ Animación instantánea */
  const onChangeAnim = (e) => setAnimation(e.target.value);

  return (
    <div className="flex flex-col items-center justify-start bg-[#fff7f5] overflow-hidden min-h-[100dvh] relative px-3">
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay loop muted playsInline
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

      {stage === "editor" && (
        <>
          {animation && <AnimationOverlay slug={slug} animation={animation} />}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-4 mb-6"
          >
            {/* 🎞️ Tarjeta */}
            <div className="relative mb-3 overflow-hidden rounded-2xl border bg-gray-50">
              <video
                src={videoSrc}
                className="w-full object-cover"
                autoPlay loop muted playsInline
              />
            </div>

            {/* 📝 Mensaje */}
            <textarea
              className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* 📸 Imagen personalizada */}
            {photo && (
              <div className="my-3 w-full flex justify-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="user upload"
                  className="rounded-xl w-[80%] shadow-md"
                />
              </div>
            )}

            {/* 🔽 Selector de animación */}
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

            {/* 🧭 Botones */}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
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
        </>
      )}

      {/* 🔸 Modales */}
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
          slug={slug}
          planOptions={[
            { id: "heartfelt", title: "💌 Heartfelt", price: 3.99, description: "A calm, beautiful card to share your feelings with sincerity." },
            { id: "signature", title: "💎 Signature", price: 7.99, description: "A dynamic animated experience with motion, photo, and effects that bring your message to life." },
          ]}
          onGiftChange={() => setShowGift(true)}
          onGiftRemove={removeGift}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {showCrop && (
        <CropperModal
          open={showCrop}
          onClose={() => setShowCrop(false)}
          onDone={handlePhotoDone}
        />
      )}
    </div>
  );
}
