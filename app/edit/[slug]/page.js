"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";

/* ========= Stripe (publishable) ========= */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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
    } catch (err) {
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

/* ========= Página principal ========= */
export default function EditPage() {
  const { slug } = useParams();

  // Estado principal
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Checkout
  const [showCheckout, setShowCheckout] = useState(false);
  const CARD_PRICE = 5;

  // Persistencia
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyImg = `ew_img_${slug}`;

  // Cargar datos guardados
  useEffect(() => {
    try {
      const m = sessionStorage.getItem(keyMsg);
      if (m) setMessage(m);
      const a = sessionStorage.getItem(keyAnim);
      if (a) setAnim(a);
      const i = sessionStorage.getItem(keyImg);
      if (i) setUserImage(i);
    } catch {}
  }, [slug]);

  // Guardar cambios
  useEffect(() => {
    try {
      sessionStorage.setItem(keyMsg, message);
      sessionStorage.setItem(keyAnim, anim);
      sessionStorage.setItem(keyImg, userImage);
    } catch {}
  }, [message, anim, userImage, keyMsg, keyAnim, keyImg]);

  // Cargar video + animaciones
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
          setAnim(opts[0] || "✨ Sparkles");
        }
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  // Intro con barra de progreso
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

  // Imagen subida por el usuario (crop)
  const handleCropped = (dataUrl) => {
    setUserImage(dataUrl);
    setShowCropper(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4">
      {!showEdit ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-700"
        >
          <p className="mb-4 text-lg font-medium">Loading your Everwish...</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto">
            <div
              className="h-2 bg-pink-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white shadow-lg rounded-3xl p-6 relative"
        >
          <h1 className="text-center text-2xl font-bold text-pink-600 mb-2">
            Your Everwish ✨
          </h1>
          {item && (
            <div className="relative overflow-hidden rounded-2xl mb-3">
              <video
                src={item.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-2xl"
              />
            </div>
          )}

          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full mb-3 p-3 rounded-xl border"
          >
            {animOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-xl p-3 h-28 text-gray-700"
            placeholder="Write your personal message..."
          />

          {/* Imagen del usuario */}
          {userImage ? (
            <div className="mt-3">
              <img
                src={userImage}
                alt="Uploaded"
                className="rounded-xl w-full object-cover max-h-64"
              />
              <button
                onClick={() => setShowCropper(true)}
                className="mt-2 text-pink-600 text-sm hover:underline"
              >
                Change Image
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCropper(true)}
              className="w-full mt-3 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Add a personal image 📷
            </button>
          )}

          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-5 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
          >
            Send Everwish 💌
          </button>

          {showCropper && (
            <CropperModal
              onCancel={() => setShowCropper(false)}
              onCropped={handleCropped}
            />
          )}

          {showCheckout && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
              >
                <button
                  onClick={() => setShowCheckout(false)}
                  className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold text-center text-purple-600 mb-1">
                  Secure Checkout 💜
                </h3>
                <p className="text-center text-sm text-gray-500 mb-4">
                  Your information is encrypted and processed safely.
                </p>
                <Elements stripe={stripePromise}>
                  <InlineStripeForm
                    total={CARD_PRICE}
                    onSuccess={() => setShowCheckout(false)}
                  />
                </Elements>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
    }
