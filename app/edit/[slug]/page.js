// app/edit/[slug]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ⬇️ OJO: libs en la RAÍZ del repo (no dentro de /app)
import { defaultMessageFromSlug } from "../../../lib/messages";
import { getAnimationsForSlug } from "../../../lib/animations";
import CropperModal from "../../../lib/croppermodal";

/* ========= Stripe ========= */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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

/* ========= Stripe inline form ========= */
function InlineStripeForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) throw new Error(error || "Missing client secret");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        alert(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("🎉 Payment successful!");
        onSuccess?.();
      }
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="border rounded-2xl p-4 bg-gray-50">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`mt-4 w-full rounded-full py-3 font-semibold text-white transition ${
          loading ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)} 💜`}
      </button>
    </form>
  );
}

/* ========= Gift Card Popup ========= */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [activeTab, setActiveTab] = useState("Popular");
  const [expanded, setExpanded] = useState({});
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);

  const cards = {
    Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
    Lifestyle: { featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
    Digital: { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
  };

  const quick = [5, 10, 25, 50, 100];

  const done = () => {
    if (!brand || !Number(amount)) return alert("Please select a brand and amount.");
    onSelect({ brand, amount: Number(amount) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close gift cards"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-1 ${
                activeTab === t ? "text-pink-500 border-b-2 border-pink-500 font-semibold" : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Featured */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {cards[activeTab].featured.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`border rounded-xl py-2 px-3 text-sm ${
                brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* More */}
        {expanded[activeTab] && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {cards[activeTab].more.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`border rounded-xl py-2 px-3 text-sm ${
                  brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded((p) => ({ ...p, [activeTab]: !p[activeTab] }))}
          className="text-sm text-gray-600 hover:text-pink-500 mb-3"
        >
          {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
        </button>

        {/* Amount */}
        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">Amount (USD)</h4>
        <div className="flex gap-2 justify-center mb-4">
          {quick.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-3 py-1 rounded-lg border transition ${
                Number(amount) === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>

        <button
          onClick={done}
          className="w-full rounded-full py-3 font-semibold text-white bg-pink-500 hover:bg-pink-600 transition"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

/* ========= Checkout popup (con planes Heartfelt / Signature) ========= */
function CheckoutPopup({
  total,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
  plan,
  setPlan,
}) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close checkout"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">
          Secure Checkout with Stripe 💜
        </h3>
        <p className="text-center text-sm text-gray-500 mb-4">
          Your information is encrypted and processed safely.
        </p>

        {/* Selector de plan */}
        <div className="rounded-2xl border p-3 mb-4 bg-gray-50">
          <p className="text-center font-semibold mb-2">
            Both include your personalized message and instant delivery 💖
          </p>
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="plan"
                className="mt-1"
                checked={plan === "signature"}
                onChange={() => setPlan("signature")}
              />
              <div>
                <p className="font-semibold">💎 Signature — $7.99</p>
                <p className="text-sm text-gray-600">
                  A dynamic animated experience with motion, photo, and effects that bring your message to life.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="plan"
                className="mt-1"
                checked={plan === "heartfelt"}
                onChange={() => setPlan("heartfelt")}
              />
              <div>
                <p className="font-semibold">💌 Heartfelt — $3.99</p>
                <p className="text-sm text-gray-600">
                  A calm, elegant design for sending warm and meaningful wishes.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Sender / Recipient */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Sender <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.name}
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={sender.email}
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={sender.phone}
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Recipient <span className="text-pink-500">*</span>
            </p>
            <input
              placeholder="Full name"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="w-full rounded-xl border p-3 mb-2"
              value={recipient.email}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="w-full rounded-xl border p-3"
              value={recipient.phone}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
          <p className="font-semibold mb-1">Order summary</p>

          <div className="flex justify-between">
            <span>{plan === "signature" ? "Signature Card" : "Heartfelt Card"}</span>
            <span>{plan === "signature" ? "$7.99" : "$3.99"}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span>
              Gift Card {gift?.brand ? `(${gift.brand} $${Number(gift.amount || 0)})` : "(none)"}
            </span>
            <div className="flex items-center gap-3">
              {gift?.brand ? (
                <>
                  <button onClick={onGiftChange} className="text-pink-600 hover:underline">Change</button>
                  <button onClick={onGiftRemove} className="text-gray-500 hover:text-red-500" title="Remove gift card">🗑️</button>
                </>
              ) : (
                <button onClick={onGiftChange} className="text-pink-600 hover:underline">Add</button>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe inline */}
        <Elements stripe={stripePromise}>
          <InlineStripeForm total={total} onSuccess={onClose} />
        </Elements>
      </motion.div>
    </div>
  );
}

/* ========= Página principal ========= */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // Intro (pantalla extendida)
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");

  // Imagen usuario
  const [showCrop, setShowCrop] = useState(false);
  const [userImage, setUserImage] = useState(null);

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Plan (💎 Signature = 7.99, 💌 Heartfelt = 3.99)
  const [plan, setPlan] = useState("signature");

  // Persistencia por slug
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyGift = `ew_gift_${slug}`;
  const keyPlan = `ew_plan_${slug}`;
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
      const p = sessionStorage.getItem(keyPlan);
      if (p) setPlan(p);
      const u = sessionStorage.getItem(keyImg);
      if (u) setUserImage(u);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Guardar persistencia
  useEffect(() => { try { sessionStorage.setItem(keyMsg, message); } catch {} }, [message, keyMsg]);
  useEffect(() => { try { sessionStorage.setItem(keyAnim, anim); } catch {} }, [anim, keyAnim]);
  useEffect(() => { try { sessionStorage.setItem(keyGift, JSON.stringify(gift)); } catch {} }, [gift, keyGift]);
  useEffect(() => { try { sessionStorage.setItem(keyPlan, plan); } catch {} }, [plan, keyPlan]);
  useEffect(() => { try { sessionStorage.setItem(keyImg, userImage || ""); } catch {} }, [userImage, keyImg]);

  // Cargar media + animaciones
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

  /* --- Pantalla extendida 3s --- */
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

      (async () => {
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        } catch {}
      })();

      timer = setTimeout(async () => {
        try {
          if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && document.webkitExitFullscreen) await document.webkitExitFullscreen();
        } catch {}
        setShowEdit(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  // Tap de seguridad para salir de fullscreen
  useEffect(() => {
    const handler = async () => {
      if (!showEdit) {
        try {
          if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
          // @ts-ignore
          if (!document.fullscreenElement && document.webkitExitFullscreen) await document.webkitExitFullscreen();
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

  // Render de animación flotante
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

  /* --- Intro (pantalla extendida) --- */
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

  // Altura y contenedor: sin márgenes laterales blancos, manteniendo proporción
  const mediaHeight = isMobile ? 360 : 420;

  // Total dinámico
  const basePrice = plan === "signature" ? 7.99 : 3.99;
  const total = basePrice + Number(gift?.amount || 0);

  /* --- Editor principal --- */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones al frente */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* Media (sin espacios laterales) */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
         
