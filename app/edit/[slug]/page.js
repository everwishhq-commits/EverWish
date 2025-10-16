"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutPopup from "@/lib/checkout";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [gift, setGift] = useState(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        if (found) {
          setItem(found);
          setMessage(defaultMessageFromSlug(slug));
          const anims = getAnimationsForSlug(slug);
          setAnimOptions(anims);
          setAnim(anims[0] || "❌ None");
        }
      } catch (e) {
        console.error("Error loading video:", e);
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (!item || showEdit) return;
    const duration = 3000;
    const start = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const timer = setTimeout(() => setShowEdit(true), duration);
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 16 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[30] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.8, 0],
          y: [0, -100],
          x: [0, Math.random() * 120 - 60],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.25,
        }}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {emoji}
      </motion.span>
    ));
  };

  if (!item) return null;

  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item?.src?.endsWith(".mp4") ? (
          <>
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <img
            src={item?.src || ""}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  const mediaHeight = isMobile ? 360 : 420;

  return (
    <main className="mx-auto max-w-3xl px-0 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-[10]">{renderEffect()}</div>

      <div className="relative z-[20]">
        {/* Imagen o video */}
        <div className="relative w-full overflow-hidden bg-white">
          {item?.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              style={{ height: mediaHeight }}
              className="w-full object-contain bg-[#fff8f5]"
            />
          ) : (
            <img
              src={item?.src || ""}
              alt={slug}
              style={{ height: mediaHeight }}
              className="w-full object-contain bg-[#fff8f5]"
            />
          )}
        </div>

        {/* Controles */}
        <section className="mt-4 bg-white rounded-3xl shadow-md p-6 mx-4 sm:mx-6">
          <h2 className="text-xl font-semibold text-center mb-3">
            ✨ Customize your message ✨
          </h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={isMobile ? 3 : 2}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
          />

          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
          >
            {animOptions.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
            <option value="❌ None">❌ None</option>
          </select>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowCrop(true)}
              className="flex-1 rounded-full py-3 font-semibold transition bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]"
            >
              📸 Add Image
            </button>
            <button
              onClick={() => setShowGiftPopup(true)}
              className="flex-1 rounded-full py-3 font-semibold transition bg-pink-100 hover:bg-pink-200 text-pink-700"
            >
              🎁 Gift Card
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="flex-1 rounded-full py-3 font-semibold transition bg-purple-500 hover:bg-purple-600 text-white"
            >
              💳 Checkout
            </button>
          </div>
        </section>
      </div>

      {/* === MODALES === */}
      {showCrop && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <CropperModal
            onClose={() => setShowCrop(false)}
            onSave={setUserImage}
          />
        </div>
      )}

      {showGiftPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <GiftCardPopup
            onClose={() => setShowGiftPopup(false)}
            onSelect={setGift}
            initial={gift}
          />
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <CheckoutPopup
            total={7.99 + (gift?.amount || 0)}
            gift={gift}
            onGiftChange={() => setShowGiftPopup(true)}
            onGiftRemove={() => setGift(null)}
            onClose={() => setShowCheckout(false)}
          />
        </div>
      )}
    </main>
  );
          }
