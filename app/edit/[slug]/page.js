// /app/edit/[slug]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// libs en RAÍZ (fuera de /app)
import { defaultMessageFromSlug } from "../../../lib/messages";
import { getAnimationsForSlug } from "../../../lib/animations";
import CropperModal from "../../../lib/croppermodal";
import GiftCardPopup from "../../../lib/giftcard";
import CheckoutPopup from "../../../lib/checkout";

/* ========= Helpers ========= */
const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const f = () => setM(window.innerWidth < 640);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return m;
};

export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // Intro (fullscreen 3s)
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [planId, setPlanId] = useState("signature"); // default premium
  const CARD_SIGNATURE = PLANS.find(p=>p.id==="signature")?.price || 7.99;

  // User Image
  const [showCrop, setShowCrop] = useState(false);
  const [userImage, setUserImage] = useState(null);

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Persistencia por slug
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyGift = `ew_gift_${slug}`;
  const keyPlan = `ew_plan_${slug}`;
  const keyUserImage = `ew_img_${slug}`;

  // Cargar persistencia
  useEffect(() => {
    try {
      const m = sessionStorage.getItem(keyMsg);
      if (m) setMessage(m);
      const a = sessionStorage.getItem(keyAnim);
      if (a) setAnim(a);
      const g = sessionStorage.getItem(keyGift);
      if (g) setGift(JSON.parse(g));
      const p = sessionStorage.getItem(keyPlan);
      if (p) setPlanId(p);
      const ui = sessionStorage.getItem(keyUserImage);
      if (ui) setUserImage(ui);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Guardar persistencia
  useEffect(() => { try { sessionStorage.setItem(keyMsg, message); } catch {} }, [message, keyMsg]);
  useEffect(() => { try { sessionStorage.setItem(keyAnim, anim); } catch {} }, [anim, keyAnim]);
  useEffect(() => { try { sessionStorage.setItem(keyGift, JSON.stringify(gift)); } catch {} }, [gift, keyGift]);
  useEffect(() => { try { sessionStorage.setItem(keyPlan, planId); } catch {} }, [planId, keyPlan]);
  useEffect(() => { try { userImage ? sessionStorage.setItem(keyUserImage, userImage) : sessionStorage.removeItem(keyUserImage); } catch {} }, [userImage, keyUserImage]);

  // Cargar video + animaciones
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        if (!sessionStorage.getItem(keyMsg)) setMessage(defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        if (!sessionStorage.getItem(keyAnim)) setAnim(opts[0] || "❌ None");
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* --- Pantalla extendida con barra + autoavance a edición (3s) --- */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      // Barra
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // Fullscreen best-effort
      (async () => {
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && el.webkitRequestFullscreen)
            // @ts-ignore
            await el.webkitRequestFullscreen();
        } catch {}
      })();

      // Salir y pasar al editor
      timer = setTimeout(async () => {
        try {
          if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && document.webkitExitFullscreen)
            // @ts-ignore
            await document.webkitExitFullscreen();
        } catch {}
        setShowEdit(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  // Tap de seguridad: si queda atascado en fullscreen, toca para continuar
  useEffect(() => {
    const handler = async () => {
      if (!showEdit) {
        try {
          if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && document.webkitExitFullscreen)
            // @ts-ignore
            await document.webkitExitFullscreen();
        } catch {}
        setShowEdit(true);
      }
    };
    window.addEventListener("click", handler);
    window.addEventListener("touchstart", handler);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [showEdit]);

  // Animación flotante (deshabilitada si plan = heartfelt)
  const renderEffect = () => {
    if (planId === "heartfelt") return null;
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

  if (!item) return null;

  /* --- Intro (pantalla extendida con barra) --- */
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
          <>
            <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div className="h-full bg-white transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  // Medidas de la tarjeta (sin bordes laterales: object-cover)
  const mediaHeight = isMobile ? 360 : 440;

  const signaturePrice = PLANS.find(p=>p.id==="signature")?.price ?? 7.99;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones al frente */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* Media principal (SIN bordes laterales) */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              style={{ height: mediaHeight }}
              className="w-full object-cover"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              style={{ height: mediaHeight }}
              className="w-full object-cover"
            />
          )}
        </div>

        {/* Texto + Animación selector */}
        <section className="mt-4 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-3">✨ Customize your message ✨</h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={isMobile ? 3 : 2}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
          />

          {/* Dropdown dinámico por categoría */}
          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            disabled={planId === "heartfelt"} // sin animaciones en Heartfelt
            className={`w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400 ${planId==="heartfelt"?"bg-gray-100 text-gray-400":""}`}
          >
            {animOptions.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
            <option value="❌ None">❌ None</option>
          </select>

          {/* Acciones */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowCrop(true)}
              disabled={planId === "heartfelt"} // foto opcional sólo en Signature
              className={`flex-1 rounded-full py-3 font-semibold transition ${planId==="heartfelt"
                ? "bg-gray-200 text-gray-500"
                : "bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]"}`}
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
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition"
            >
              Checkout 💳
            </button>
          </div>

          {/* Estado seleccionado GiftCard */}
          {gift.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>Selected: <strong>{gift.brand}</strong> — ${Number(gift.amount || 0).toFixed(2)}</span>
              <button onClick={() => setGift({ brand: "", amount: 0 })} className="text-pink-400 hover:text-pink-600 transition" title="Remove gift card">🗑️</button>
            </div>
          )}

          {/* Preview imagen del usuario (si existe) */}
          {userImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 text-center">Your photo preview</p>
              <div className="w-full rounded-2xl overflow-hidden shadow">
                <img src={userImage} alt="Your uploaded" className="w-full h-[220px] object-cover bg-white" />
              </div>
            </div>
          )}

          {/* Nota de plan */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Current plan: <b>{planId === "heartfelt" ? "Heartfelt" : "Signature"}</b> — Default price ${planId==="heartfelt" ? (PLANS.find(p=>p.id==="heartfelt")?.price ?? 3.99).toFixed(2) : signaturePrice.toFixed(2)}
          </div>
        </section>
      </div>

      {/* POPUPS (z altos para quedar SIEMPRE encima) */}
      <CropperModal
        open={showCrop}
        onClose={() => setShowCrop(false)}
        onSave={(base64) => { setUserImage(base64); setShowCrop(false); }}
        initialImage={userImage}
      />

      <GiftCardPopup
        open={showGiftPopup}
        initial={gift}
        onSelect={(g) => { setGift(g); setShowGiftPopup(false); }}
        onClose={() => setShowGiftPopup(false)}
      />

      <CheckoutPopup
        open={showCheckout}
        planId={planId}
        setPlanId={setPlanId}
        gift={gift}
        onGiftChange={() => { setShowCheckout(false); setShowGiftPopup(true); }}
        onGiftRemove={() => setGift({ brand: "", amount: 0 })}
        onClose={() => setShowCheckout(false)}
      />
    </main>
  );
          }
