"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import {
  defaultMessageFromSlug,
  getMessagesForSlug,
} from "@/lib/messages";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;

  // UI stages
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);

  // content
  const [message, setMessage] = useState("");
  const [messageSet, setMessageSet] = useState([]);
  const [photo, setPhoto] = useState(null); // dataURL (client-side)
  const [videoSrc, setVideoSrc] = useState("");

  // animations
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);

  // modals / totals
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [total, setTotal] = useState(5);

  // ---------- init ----------
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    setMessageSet(getMessagesForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts[0] || "Stars ✨"); // arranca activo
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  // pantalla extendida 3s
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

  // gift & total
  const updateGift = (data) => {
    setGift(data);
    setTotal(5 + (data?.amount || 0));
    setShowGift(false);
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  // change animation -> instant remount (sin delay)
  const onChangeAnim = (e) => setAnimation(e.target.value);

  // pick quick message
  const onPickQuick = (txt) => setMessage(txt);

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-start bg-[#fff7f5] overflow-hidden">
      {/* Expanded */}
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

      {/* Editor */}
      {stage === "editor" && (
        <>
          {/* Overlay SIEMPRE arriba de la tarjeta, debajo de modales */}
          {animation && (
            <AnimationOverlay key={animation} slug={slug} animation={animation} />
          )}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-16"
          >
            {/* Card video */}
            <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
              <video src={videoSrc} className="w-full object-cover" autoPlay loop muted playsInline />
            </div>

            {/* Quick messages (3) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
              {messageSet.slice(0, 3).map((m, i) => (
                <button
                  key={i}
                  onClick={() => onPickQuick(m)}
                  className="shrink-0 rounded-full border px-3 py-1 text-sm text-gray-600 hover:border-pink-400"
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Message */}
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">✨ Customize your message ✨</h3>
            <textarea
              className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Photo preview (si existe) */}
            {photo && (
              <div className="mt-3 flex flex-col items-center gap-2">
                <img src={photo} alt="" className="w-full rounded-xl border object-cover" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCrop(true)}
                    className="rounded-full px-4 py-1 text-sm border hover:bg-gray-50"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => setPhoto(null)}
                    className="rounded-full px-4 py-1 text-sm border hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Dropdown */}
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

            {/* Actions */}
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
        </>
      )}

      {/* Modals (z > overlay) */}
      {showGift && (
        <GiftCardPopup
          initial={gift}
          onSelect={updateGift}
          onClose={() => setShowGift(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          totalBase={5}
          gift={gift}
          photo={photo}
          onPhotoAllowedChange={(allow) => {
            // no-op here; Checkout se encarga de deshabilitar si es Heartfelt
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {showCrop && (
        <CropperModal
          open={showCrop}
          onClose={() => setShowCrop(false)}
          onDone={(dataUrl) => {
            setPhoto(dataUrl);
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
        }
