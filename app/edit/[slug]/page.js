"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { defaultMessageFromSlug } from "../../lib/messages";
import { getAnimationsForSlug } from "../../lib/animations";
import CropperModal from "../../lib/croppermodal";
import GiftCardPopup from "../../lib/giftcard";
import CheckoutModal from "../../lib/checkout";

/* ========= Stripe ========= */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

/* ========= Mobile helper ========= */
const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
};

/* ========= Página principal ========= */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // Estados principales
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [progress, setProgress] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  // Modales
  const [showCrop, setShowCrop] = useState(false);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Datos de usuario y compra
  const [userImage, setUserImage] = useState(null);
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [plan, setPlan] = useState("Signature"); // Default Signature
  const PRICES = { Heartfelt: 3.99, Signature: 7.99 };

  // Persistencia por slug
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyGift = `ew_gift_${slug}`;

  /* --- Cargar persistencia --- */
  useEffect(() => {
    try {
      const m = sessionStorage.getItem(keyMsg);
      if (m) setMessage(m);
      const a = sessionStorage.getItem(keyAnim);
      if (a) setAnim(a);
      const g = sessionStorage.getItem(keyGift);
      if (g) setGift(JSON.parse(g));
    } catch {}
  }, [slug]);

  /* --- Guardar persistencia --- */
  useEffect(() => {
    try {
      sessionStorage.setItem(keyMsg, message);
      sessionStorage.setItem(keyAnim, anim);
      sessionStorage.setItem(keyGift, JSON.stringify(gift));
    } catch {}
  }, [message, anim, gift, keyMsg, keyAnim, keyGift]);

  /* --- Cargar video + animaciones --- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        if (!sessionStorage.getItem(keyMsg))
          setMessage(defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        if (!sessionStorage.getItem(keyAnim))
          setAnim(opts[0] || "❌ None");
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  /* --- Pantalla extendida inicial (3s) --- */
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

      timer = setTimeout(() => setShowEdit(true), duration);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  /* --- Render de animaciones --- */
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 14 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.85, 0],
          y: [0, -100],
          x: [0, Math.random() * 100 - 50],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 5 + Math.random() * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.3,
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

  /* --- Si no hay item --- */
  if (!item) return null;

  /* --- Si aún está en pantalla inicial --- */
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
          <img
            src={item.src}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  /* --- Altura del media principal --- */
  const mediaHeight = isMobile ? 360 : 440;

  /* --- Cálculo total --- */
  const total = PRICES[plan] + (Number(gift.amount) || 0);

  /* --- Render principal --- */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones flotantes */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* Imagen principal */}
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

          {/* Animaciones */}
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
          </div>

          {/* Checkout */}
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-4 w-full rounded-full py-3 font-semibold text-white transition bg-purple-500 hover:bg-purple-600"
          >
            💳 Checkout
          </button>
        </section>
      </div>

      {/* Modales */}
      {showCrop && (
        <CropperModal
          onClose={() => setShowCrop(false)}
          onSave={setUserImage}
          blur="rgba(0,0,0,0.5)"
        />
      )}

      {showGiftPopup && (
        <GiftCardPopup
          onClose={() => setShowGiftPopup(false)}
          onSelect={(g) => setGift(g)}
          blur="rgba(0,0,0,0.5)"
        />
      )}

      {showCheckout && (
        <Elements stripe={stripePromise}>
          <CheckoutModal
            onClose={() => setShowCheckout(false)}
            total={total}
            gift={gift}
            plan={plan}
            setPlan={setPlan}
            blur="rgba(0,0,0,0.5)"
          />
        </Elements>
      )}
    </main>
  );
}
