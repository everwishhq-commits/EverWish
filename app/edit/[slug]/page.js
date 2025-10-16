"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* === Librerías desde la raíz (gracias a jsconfig.json) === */
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutPopup from "@/lib/checkout";

/* === Hook para detectar si es móvil === */
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

/* === Página principal === */
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

  // --- Cargar datos de la tarjeta ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        setMessage(defaultMessageFromSlug(slug));
        const anims = getAnimationsForSlug(slug);
        setAnimOptions(anims);
        setAnim(anims[0] || "❌ None");
      } catch (e) {
        console.error("Error loading video:", e);
      }
    })();
  }, [slug]);

  // --- Intro fullscreen (3 segundos) ---
  useEffect(() => {
    if (!item || showEdit) return;
    let timer;
    const start = performance.now();
    const duration = 3000;

    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    timer = setTimeout(() => setShowEdit(true), duration);
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  // --- Efectos flotantes (animaciones emoji) ---
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.85, 0],
          y: [0, -90],
          x: [0, Math.random() * 100 - 50],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4.8 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.22,
        }}
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      >
        {emoji}
      </motion.span>
    ));
  };

  // --- Si no hay tarjeta cargada ---
  if (!item) return null;

  // --- Pantalla de intro ---
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
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
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  // --- Altura adaptable (imagen + texto + botones visibles) ---
  const mediaHeight = isMobile ? 360 : 420;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones por delante */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* Imagen o video principal */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              style={{ height: mediaHeight }}
              className="w-full object-contain"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              style={{ height: mediaHeight }}
              className="w-full object-contain"
            />
          )}
        </div>

        {/* Controles */}
        <section className="mt-4 bg-white rounded-3xl shadow-md p-6">
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

      {/* Modales */}
      {showCrop && <CropperModal onClose={() => setShowCrop(false)} onSave={setUserImage} />}
      {showGiftPopup && (
        <GiftCardPopup
          onClose={() => setShowGiftPopup(false)}
          onSelect={setGift}
          initial={gift}
        />
      )}
      {showCheckout && (
        <CheckoutPopup
          total={7.99 + (gift?.amount || 0)}
          gift={gift}
          onGiftChange={() => setShowGiftPopup(true)}
          onGiftRemove={() => setGift(null)}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
      }
