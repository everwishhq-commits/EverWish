"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* ========= Librerías externas ========= */
import { defaultMessageFromSlug } from "../../../lib/messages";
import { getAnimationsForSlug } from "../../../lib/animations";
import CropperModal from "../../../lib/croppermodal";
import { GiftCardPopup, CheckoutPopup } from "../../../lib/everwish_checkout";

/* ========= Config ========= */
const CARD_PRICE_SIGNATURE = 7.99;
const CARD_PRICE_HEARTFELT = 3.99;

/* ========= Helper: detectar móvil ========= */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    check();
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

/* ========= Página principal ========= */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // Estados principales
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");

  const [showCrop, setShowCrop] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const [gift, setGift] = useState(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [plan, setPlan] = useState("signature");

  // Persistencia local
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem(`ew_msg_${slug}`);
      const ani = sessionStorage.getItem(`ew_anim_${slug}`);
      const giftStr = sessionStorage.getItem(`ew_gift_${slug}`);
      const planStr = sessionStorage.getItem(`ew_plan_${slug}`);
      if (msg) setMessage(msg);
      if (ani) setAnim(ani);
      if (giftStr) setGift(JSON.parse(giftStr));
      if (planStr) setPlan(planStr);
    } catch {}
  }, [slug]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`ew_msg_${slug}`, message);
      sessionStorage.setItem(`ew_anim_${slug}`, anim);
      sessionStorage.setItem(`ew_gift_${slug}`, JSON.stringify(gift));
      sessionStorage.setItem(`ew_plan_${slug}`, plan);
    } catch {}
  }, [message, anim, gift, plan, slug]);

  // Cargar video / animaciones
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        if (!sessionStorage.getItem(`ew_msg_${slug}`))
          setMessage(defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        if (!sessionStorage.getItem(`ew_anim_${slug}`)) setAnim(opts[0] || "❌ None");
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  /* --- Pantalla extendida de introducción (3s) --- */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      timer = setTimeout(() => setShowEdit(true), 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  /* --- Efectos flotantes animados --- */
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.9, 0],
          y: [0, -90],
          x: [0, Math.random() * 100 - 50],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.25,
        }}
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      >
        {emoji}
      </motion.span>
    ));
  };

  if (!item) return null;

  /* --- Intro (pantalla extendida) --- */
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

  const mediaHeight = isMobile ? 360 : 440;
  const total =
    plan === "signature"
      ? CARD_PRICE_SIGNATURE + (gift?.amount || 0)
      : CARD_PRICE_HEARTFELT + (gift?.amount || 0);

  /* --- Render principal --- */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones flotantes */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* Tarjeta principal */}
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

        {/* Edición */}
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

          {/* Animación */}
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

          {/* Botones */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowCrop(true)}
              className="flex-1 rounded-full py-3 font-semibold bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]"
            >
              📸 Add Image
            </button>
            <button
              onClick={() => setShowGiftPopup(true)}
              className="flex-1 rounded-full py-3 font-semibold bg-pink-100 hover:bg-pink-200 text-pink-700"
            >
              🎁 Gift Card
            </button>
          </div>

          {userImage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Your photo preview</p>
              <img
                src={userImage}
                alt="user"
                className="mx-auto rounded-2xl border object-cover"
                style={{ width: 160, height: 160 }}
              />
            </div>
          )}

          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-6 rounded-full py-3 font-semibold text-white bg-purple-500 hover:bg-purple-600 transition"
          >
            Proceed to Checkout 💳
          </button>
        </section>
      </div>

      {/* Popups */}
      {showCrop && (
        <CropperModal
          onClose={() => setShowCrop(false)}
          onSave={(img) => {
            setUserImage(img);
            setShowCrop(false);
          }}
        />
      )}
      {showGiftPopup && (
        <GiftCardPopup
          onSelect={(g) => {
            setGift(g);
            setShowGiftPopup(false);
          }}
          onClose={() => setShowGiftPopup(false)}
        />
      )}
      {showCheckout && (
        <CheckoutPopup
          total={total}
          plan={plan}
          setPlan={setPlan}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
            }
