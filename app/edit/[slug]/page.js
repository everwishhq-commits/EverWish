"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// 🔗 Importaciones desde /lib
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";

// 💳 Stripe setup
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// ====== FORMULARIO DE STRIPE INLINE ======
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

      if (result.error) alert(result.error.message || "Payment failed");
      else if (result.paymentIntent?.status === "succeeded") {
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
        {loading ? "Processing..." : `Confirm & Pay`}
      </button>
    </form>
  );
}

// ====== PÁGINA PRINCIPAL ======
export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const CARD_PRICE = 5;

  // ==== Cargar datos y animaciones ====
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        setMessage(defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        setAnim(opts[0] || "✨ Sparkles");
      } catch (e) {
        console.error("Error loading data", e);
      }
    })();
  }, [slug]);

  // ==== Render de animación flotante ====
  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 15 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[35] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -90],
          x: [0, Math.random() * 100 - 50],
        }}
        transition={{
          duration: 5 + Math.random() * 2,
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

  // ==== Pantalla extendida con transición automática (3s) ====
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
          if (!document.fullscreenElement && el.webkitRequestFullscreen)
            el.webkitRequestFullscreen();
        } catch {}
      })();

      timer = setTimeout(async () => {
        try {
          if (document.fullscreenElement && document.exitFullscreen)
            await document.exitFullscreen();
          if (!document.fullscreenElement && document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        } catch {}
        setShowEdit(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  // ==== Tap de seguridad (por si se queda en fullscreen) ====
  useEffect(() => {
    const handler = async () => {
      if (!showEdit) {
        try {
          if (document.fullscreenElement && document.exitFullscreen)
            await document.exitFullscreen();
          if (!document.fullscreenElement && document.webkitExitFullscreen)
            document.webkitExitFullscreen();
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

  // ==== Loading ====
  if (!item)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );

  // ==== Pantalla extendida ====
  if (!showEdit)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
          <>
            <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
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

  // ==== Editor principal ====
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {item.src?.endsWith(".mp4") ? (
          <video
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-64 object-cover"
          />
        ) : (
          <img src={item.src} alt="card" className="w-full h-64 object-cover" />
        )}
        {renderEffect()}
      </div>

      {/* Mensaje */}
      <textarea
        className="w-full max-w-md mt-4 p-3 rounded-xl border focus:ring-2 focus:ring-pink-400"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Dropdown animaciones */}
      <select
        className="mt-3 p-2 rounded-lg border bg-white"
        value={anim}
        onChange={(e) => setAnim(e.target.value)}
      >
        {animOptions.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      {/* Botón agregar imagen */}
      <button
        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
        onClick={() => setShowCropper(true)}
      >
        📸 Add Image
      </button>

      {/* Imagen del usuario */}
      {userImage && (
        <div className="mt-3">
          <img
            src={userImage}
            alt="user upload"
            className="w-40 h-40 rounded-xl object-cover mx-auto border"
          />
        </div>
      )}

      {/* Botón checkout */}
      <button
        onClick={() => setShowCheckout(true)}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700"
      >
        Proceed to Checkout 💳
      </button>

      {/* Cropper */}
      {showCropper && (
        <CropperModal
          onClose={() => setShowCropper(false)}
          onSave={(img) => setUserImage(img)}
        />
      )}

      {/* Checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 w-11/12 max-w-lg"
          >
            <h3 className="text-xl font-bold text-purple-600 mb-3 text-center">
              Checkout 💜
            </h3>
            <Elements stripe={stripePromise}>
              <InlineStripeForm
                total={CARD_PRICE + (gift.amount || 0)}
                onSuccess={() => setShowCheckout(false)}
              />
            </Elements>
            <button
              className="mt-4 w-full rounded-full py-3 text-gray-600 border hover:bg-gray-100"
              onClick={() => setShowCheckout(false)}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
        }
