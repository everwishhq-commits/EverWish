"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* === Librerías globales desde /lib === */
import { defaultMessageFromSlug } from "../../lib/messages";
import { getAnimationsForSlug } from "../../lib/animations";
import CropperModal from "../../lib/croppermodal";
import GiftCardPopup from "../../lib/giftcard";
import CheckoutPopup from "../../lib/checkout";

/* === Hook para detectar móvil === */
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

  /* ===== Estados principales ===== */
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Texto, animación, plan
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [plan, setPlan] = useState("signature");

  // Imagen
  const fileRef = useRef(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Precios
  const HEARTFELT_PRICE = 3.99;
  const SIGNATURE_PRICE = 7.99;

  /* ===== Keys de sessionStorage ===== */
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyPlan = `ew_plan_${slug}`;
  const keyGift = `ew_gift_${slug}`;
  const keyPImg = `ew_userimg_${slug}`;

  /* ===== Carga inicial ===== */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        setMessage(sessionStorage.getItem(keyMsg) || defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        setAnim(sessionStorage.getItem(keyAnim) || opts[0] || "❌ None");
        setPlan(sessionStorage.getItem(keyPlan) || "signature");

        const g = sessionStorage.getItem(keyGift);
        if (g) setGift(JSON.parse(g));

        const u = sessionStorage.getItem(keyPImg);
        if (u) setUserImage(u);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    })();
  }, [slug]);

  /* ===== Guardado ===== */
  useEffect(() => { sessionStorage.setItem(keyMsg, message); }, [message]);
  useEffect(() => { sessionStorage.setItem(keyAnim, anim); }, [anim]);
  useEffect(() => { sessionStorage.setItem(keyPlan, plan); }, [plan]);
  useEffect(() => { sessionStorage.setItem(keyGift, JSON.stringify(gift)); }, [gift]);
  useEffect(() => {
    if (userImage) sessionStorage.setItem(keyPImg, userImage);
    else sessionStorage.removeItem(keyPImg);
  }, [userImage]);

  /* ===== Intro fullscreen con barra ===== */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      const start = performance.now();
      const dur = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / dur);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // fullscreen
      (async () => {
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
        } catch {}
      })();

      timer = setTimeout(async () => {
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
        } catch {}
        setShowEdit(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  /* ===== Efecto flotante ===== */
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -90],
          x: [0, Math.random() * 100 - 50],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4.8 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      >
        {emoji}
      </motion.span>
    ));
  };

  /* ===== Cálculo de precios ===== */
  const basePrice = plan === "signature" ? SIGNATURE_PRICE : HEARTFELT_PRICE;
  const total = basePrice + (Number(gift?.amount) || 0);

  /* ===== Imagen (cropper) ===== */
  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  if (!item) return null;

  /* ===== Render principal ===== */
  const mediaHeight = isMobile ? 360 : 420;

  // Intro
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
        {/* Imagen principal */}
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

        {/* Imagen del usuario */}
        {userImage && (
          <div className="mx-auto w-full max-w-[560px]">
            <div className="mt-3 rounded-2xl overflow-hidden border bg-white">
              <img src={userImage} alt="user" className="w-full h-[200px] object-cover" />
            </div>
          </div>
        )}

        {/* Panel de edición */}
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

          {/* Plan selector */}
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

          {/* Botones */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 rounded-full py-3 font-semibold transition bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]"
            >
              📸 Add Image
            </button>
            <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={onPickImage} />
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

      {/* ===== MODALES ===== */}
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

      {showGift && (
        <div className="fixed inset-0 z-[80]">
          <GiftCardPopup
            initial={gift?.brand ? gift : null}
            onSelect={(g) => setGift(g)}
            onClose={() => setShowGift(false)}
          />
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[80]">
          <CheckoutPopup
            total={total}
            plan={plan}
            gift={gift}
            onGiftChange={() => setShowGift(true)}
            onGiftRemove={() => setGift({ brand: "", amount: 0 })}
            onClose={() => setShowCheckout(false)}
          />
        </div>
      )}
    </main>
  );
    }
