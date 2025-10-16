"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* === Librerías en la RAÍZ (fuera de /app) === */
import { defaultMessageFromSlug } from "../../../lib/messages";
import { getAnimationsForSlug } from "../../../lib/animations";
import CropperModal from "../../../lib/croppermodal";
import GiftCardPopup from "../../../lib/giftcard";
import CheckoutPopup from "../../../lib/checkout";

/* ========= Helpers ========= */
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

  // Intro (pantalla extendida 3s)
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [userImage, setUserImage] = useState(null);

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Crop
  const [showCrop, setShowCrop] = useState(false);

  // Persistencia por slug
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyGift = `ew_gift_${slug}`;
  const keyImg = `ew_img_${slug}`;

  // Cargar persistencia
  useEffect(() => {
    try {
      const m = sessionStorage.getItem(keyMsg);
      if (m) setMessage(m);
      const a = sessionStorage.getItem(keyAnim);
      if (a) setAnim(a);
      const g = sessionStorage.getItem(keyGift);
      if (g) setGift(JSON.parse(g));
      const img = sessionStorage.getItem(keyImg);
      if (img) setUserImage(img);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Guardar persistencia
  useEffect(() => {
    try { sessionStorage.setItem(keyMsg, message); } catch {}
  }, [message, keyMsg]);

  useEffect(() => {
    try { sessionStorage.setItem(keyAnim, anim); } catch {}
  }, [anim, keyAnim]);

  useEffect(() => {
    try { sessionStorage.setItem(keyGift, JSON.stringify(gift)); } catch {}
  }, [gift, keyGift]);

  useEffect(() => {
    try {
      if (userImage) sessionStorage.setItem(keyImg, userImage);
      else sessionStorage.removeItem(keyImg);
    } catch {}
  }, [userImage, keyImg]);

  // Cargar media + animaciones
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        if (!sessionStorage.getItem(keyMsg)) {
          setMessage(defaultMessageFromSlug(slug));
        }
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        if (!sessionStorage.getItem(keyAnim)) {
          setAnim(opts[0] || "❌ None");
        }
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
      // Barra de progreso
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
          if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
          }
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

  // Render de animación (suave y por delante, sin bloquear inputs)
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[40] pointer-events-none"
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
            {/* Barra de progreso */}
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

  // Alturas + contenedor para evitar “bordes blancos”
  // - Usamos aspect-[9/16] en móviles, y contenedor "media-fit" con object-contain
  // - El fondo NO es blanco, así no se ven laterales; y el wrapper no tiene padding
  const mediaHeight = isMobile ? 360 : 440;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones al frente */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[10]">
        {/* Media (evitar bordes blancos ajustando el wrapper al contenido) */}
        <div
          className="relative w-full overflow-hidden rounded-3xl shadow-md"
          style={{
            height: mediaHeight,
            backgroundColor: "transparent",
          }}
        >
          {item.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              className="w-full h-full object-contain"
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

          {/* Dropdown dinámico por categoría */}
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

          {/* Acciones */}
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
              className="flex-1 rounded-full py-3 font-semibold transition text-white bg-pink-500 hover:bg-pink-600"
            >
              Checkout 💳
            </button>
          </div>

          {/* Estado seleccionado GiftCard */}
          {gift.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>
                Selected: <strong>{gift.brand}</strong> — ${Number(gift.amount || 0).toFixed(2)}
              </span>
              <button
                onClick={() => setGift({ brand: "", amount: 0 })}
                className="text-pink-400 hover:text-pink-600 transition"
                title="Remove gift card"
              >
                🗑️
              </button>
            </div>
          )}

          {/* Preview de imagen del usuario (si existe) */}
          {userImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 text-center">Your photo preview</p>
              <div className="w-full rounded-2xl border overflow-hidden bg-gray-50">
                <img
                  src={userImage}
                  alt="User photo"
                  className="w-full h-[220px] object-contain"
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODALES (z-index MUY ALTO) */}
      {showCrop && (
        <CropperModal
          onClose={() => setShowCrop(false)}
          onSave={(dataUrl) => {
            setUserImage(dataUrl);
            setShowCrop(false);
          }}
          zIndexClass="z-[9998]"
        />
      )}

      {showGiftPopup && (
        <GiftCardPopup
          initial={gift}
          onSelect={(g) => {
            setGift(g);
            setShowGiftPopup(false);
          }}
          onClose={() => setShowGiftPopup(false)}
          zIndexClass="z-[9998]"
        />
      )}

      {showCheckout && (
        <CheckoutPopup
          totalBase={7.99} // Signature base; el usuario puede cambiar a Heartfelt en el modal
          gift={gift}
          onGiftChange={() => {
            setShowCheckout(false);
            setShowGiftPopup(true);
          }}
          onGiftRemove={() => setGift({ brand: "", amount: 0 })}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
}
