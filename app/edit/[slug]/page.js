"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* ===== lib (en la raíz, fuera de /app) ===== */
import { defaultMessageFromSlug } from "../../lib/messages";
import { getAnimationsForSlug } from "../../lib/animations";
import CropperModal from "../../lib/croppermodal";
import GiftCardPopup from "../../lib/giftcard";
import CheckoutPopup from "../../lib/checkout";

/* ===== helpers ===== */
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

/* ===== página ===== */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // Intro extendida (3s)
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");

  // Imagen del usuario
  const fileRef = useRef(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState(null);      // archivo original para el cropper
  const [userImage, setUserImage] = useState(null);    // base64 final

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Plan y precios
  const HEARTFELT_PRICE = 3.99;
  const SIGNATURE_PRICE = 7.99;
  const [plan, setPlan] = useState("signature"); // "heartfelt" | "signature"

  // Persistencia por slug
  const keyMsg  = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyPlan = `ew_plan_${slug}`;
  const keyGift = `ew_gift_${slug}`;
  const keyPImg = `ew_userimg_${slug}`;

  /* === cargar datos === */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        // mensaje automático si no existe
        const m = sessionStorage.getItem(keyMsg);
        setMessage(m || defaultMessageFromSlug(slug));

        // animaciones por categoría
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        const a = sessionStorage.getItem(keyAnim);
        setAnim(a || (opts[0] || "❌ None"));

        // plan
        const p = sessionStorage.getItem(keyPlan);
        setPlan(p || "signature");

        // gift
        const g = sessionStorage.getItem(keyGift);
        if (g) setGift(JSON.parse(g));

        // imagen usuario (base64)
        const u = sessionStorage.getItem(keyPImg);
        if (u) setUserImage(u);
      } catch (e) {
        console.error("load /api/videos failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* === guardar cambios === */
  useEffect(() => { try { sessionStorage.setItem(keyMsg, message); } catch {} }, [message, keyMsg]);
  useEffect(() => { try { sessionStorage.setItem(keyAnim, anim); } catch {} }, [anim, keyAnim]);
  useEffect(() => { try { sessionStorage.setItem(keyPlan, plan); } catch {} }, [plan, keyPlan]);
  useEffect(() => { try { sessionStorage.setItem(keyGift, JSON.stringify(gift)); } catch {} }, [gift, keyGift]);
  useEffect(() => { try { userImage ? sessionStorage.setItem(keyPImg, userImage) : sessionStorage.removeItem(keyPImg); } catch {} }, [userImage, keyPImg]);

  /* === intro fullscreen 3s con barra === */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      // progress animado
      const start = performance.now();
      const dur = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / dur);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // intentar entrar a fullscreen
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

  // Tap de seguridad
  useEffect(() => {
    const go = async () => {
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
    window.addEventListener("click", go);
    window.addEventListener("touchstart", go);
    return () => {
      window.removeEventListener("click", go);
      window.removeEventListener("touchstart", go);
    };
  }, [showEdit]);

  /* === efectos flotantes (frente, no bloquea inputs) === */
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

  if (!item) return null;

  /* === totales === */
  const basePrice = plan === "signature" ? SIGNATURE_PRICE : HEARTFELT_PRICE;
  const total = basePrice + (Number(gift?.amount) || 0);

  /* === ui === */
  const mediaHeight = isMobile ? 360 : 420;

  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result); // base64 para el cropper
      setShowCrop(true);
    };
    reader.readAsDataURL(f);
    // reset input para permitir misma imagen de nuevo
    e.target.value = "";
  };

  /* ============ RENDER ============ */

  // Intro extendida
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* efectos flotantes */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* MEDIA - sin bordes laterales y sin deformar */}
        <div className="mx-auto w-full max-w-[560px]">
          <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
            {item.src?.endsWith(".mp4") ? (
              <video
                src={item.src}
                muted
                loop
                autoPlay
                playsInline
                className="w-full"
                style={{ height: mediaHeight, objectFit: "contain", background: "rgba(0,0,0,.04)" }}
              />
            ) : (
              <img
                src={item.src}
                alt={slug}
                className="w-full"
                style={{ height: mediaHeight, objectFit: "contain", background: "rgba(0,0,0,.04)" }}
              />
            )}
          </div>
        </div>

        {/* user photo preview (si existe) */}
        {userImage && (
          <div className="mx-auto w-full max-w-[560px]">
            <div className="mt-3 rounded-2xl overflow-hidden border bg-white">
              <img src={userImage} alt="user" className="w-full h-[200px] object-cover" />
            </div>
          </div>
        )}

        {/* PANEL */}
        <section className="mt-4 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-3">✨ Customize your message ✨</h2>

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
              <option key={i} value={a}>{a}</option>
            ))}
            <option value="❌ None">❌ None</option>
          </select>

          {/* Plan selector compacto */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlan("signature")}
              className={`rounded-2xl py-2 border ${
                plan === "signature" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-300"
              }`}
            >
              💎 Signature — ${SIGNATURE_PRICE.toFixed(2)}
            </button>
            <button
              onClick={() => setPlan("heartfelt")}
              className={`rounded-2xl py-2 border ${
                plan === "heartfelt" ? "border-pink-500 bg-pink-50 text-pink-700" : "border-gray-300"
              }`}
            >
              💌 Heartfelt — ${HEARTFELT_PRICE.toFixed(2)}
            </button>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 rounded-full py-3 font-semibold transition bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]"
            >
              📸 Add Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              onChange={onPickImage}
            />
            <button
              onClick={() => setShowGift(true)}
              className="flex-1 rounded-full py-3 font-semibold transition bg-pink-100 hover:bg-pink-200 text-pink-700"
            >
              🎁 Gift Card
            </button>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            className="mt-4 w-full rounded-full py-3 font-semibold text-white bg-purple-500 hover:bg-purple-600"
          >
            Proceed to Checkout 💳
          </button>

          <p className="mt-3 text-center text-sm text-gray-500">
            Total (actual): <strong>${total.toFixed(2)}</strong>
          </p>
        </section>
      </div>

      {/* ===== MODALES (siempre por encima del media) ===== */}

      {/* Cropper */}
      {showCrop && rawImage && (
        <div className="fixed inset-0 z-[80]">
          <CropperModal
            open={showCrop}
            image={rawImage}
            onClose={() => { setShowCrop(false); setRawImage(null); }}
            onApply={(b64) => { setUserImage(b64); setShowCrop(false); setRawImage(null); }}
          />
        </div>
      )}

      {/* GiftCard */}
      {showGift && (
        <div className="fixed inset-0 z-[80]">
          <GiftCardPopup
            initial={gift?.brand ? gift : null}
            onSelect={(g) => setGift(g)}
            onClose={() => setShowGift(false)}
          />
        </div>
      )}

      {/* Checkout */}
      {showCheckout && (
        <div className="fixed inset-0 z-[80]">
          <CheckoutPopup
            total={total}
            plan={plan}                 // por si tu lib lo muestra
            gift={gift}
            onGiftChange={() => { setShowGift(true); }}
            onGiftRemove={() => setGift({ brand: "", amount: 0 })}
            onClose={() => setShowCheckout(false)}
          />
        </div>
      )}
    </main>
  );
              }
