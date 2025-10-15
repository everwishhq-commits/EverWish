"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CropperModal from "@/lib/croppermodal";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug } from "@/lib/animations";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

/* ===================== Stripe Checkout Modal ===================== */
function StripeCheckoutModal({ total, gift, onClose }) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      alert("🎉 Payment processed successfully!");
      onClose();
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex justify-center items-center px-2">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-purple-600 mb-2">
            Checkout seguro con Stripe 💜
          </h2>
          <p className="text-center text-gray-500 text-sm mb-4">
            Tus datos se procesan de forma segura por Stripe.
          </p>

          <form onSubmit={handlePay} className="space-y-4">
            <h3 className="text-md font-semibold text-pink-600 mt-2">Sender *</h3>
            <input
              type="text"
              placeholder="Full name"
              value={sender.name}
              onChange={(e) => setSender({ ...sender, name: e.target.value })}
              className="w-full border rounded-2xl p-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={sender.email}
              onChange={(e) => setSender({ ...sender, email: e.target.value })}
              className="w-full border rounded-2xl p-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={sender.phone}
              onChange={(e) => setSender({ ...sender, phone: e.target.value })}
              className="w-full border rounded-2xl p-3"
            />

            <h3 className="text-md font-semibold text-pink-600 mt-4">Recipient *</h3>
            <input
              type="text"
              placeholder="Full name"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
              className="w-full border rounded-2xl p-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={recipient.email}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
              className="w-full border rounded-2xl p-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={recipient.phone}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
              className="w-full border rounded-2xl p-3"
            />

            {/* Resumen */}
            <div className="mt-4 border-t pt-3 text-gray-700 text-sm">
              <h4 className="font-semibold mb-2">Order summary</h4>
              <div className="flex justify-between mb-1">
                <span>Everwish Card</span>
                <span>$5.00</span>
              </div>
              {gift?.amount > 0 && (
                <div className="flex justify-between mb-1">
                  <span>Gift Card ({gift.brand})</span>
                  <span>${gift.amount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t mt-2 pt-2">
                <span>Total</span>
                <span>${(5 + (gift?.amount || 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Card input simulado */}
            <div className="mt-4 border rounded-2xl p-3 bg-gray-50 text-gray-400">
              💳 Card number — MM/YY — CVC
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-5 w-full py-3 rounded-full text-white font-semibold ${
                loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? "Processing..." : `Confirm & Pay $${(5 + (gift?.amount || 0)).toFixed(2)} 💜`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===================== Gift Card Popup ===================== */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [activeTab, setActiveTab] = useState("Popular");
  const [expanded, setExpanded] = useState({});
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const quick = [5, 10, 25, 50, 100];

  const cards = {
    Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
    Lifestyle: { featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
    Digital: { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
  };

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
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>

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

/* ===================== Página principal ===================== */
export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));
        setAnimOptions(getAnimationsForSlug(slug));
        setAnim(getAnimationsForSlug(slug)[0] || "✨ Sparkles");
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  if (!item) return null;

  /* ===================== Interfaz principal ===================== */
  return (
    <main className="mx-auto max-w-3xl px-3 pt-5 pb-10 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
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
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>

      {/* Tarjeta */}
      <div className="relative z-[30] flex flex-col items-center">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-auto aspect-[3/4] object-cover" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-auto aspect-[3/4] object-cover" />
          )}
        </div>

        <section className="mt-4 bg-white rounded-3xl shadow-md p-5 w-full">
          <h2 className="text-xl font-semibold text-center mb-3">✨ Customize your message ✨</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
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
          </select>

          {userImage && (
            <div className="mt-4">
              <img
                src={userImage}
                alt="user"
                className="mx-auto w-full max-w-sm rounded-2xl shadow object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={() => setCropOpen(true)}
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

          <button
            onClick={() => setShowCheckout(true)}
            className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition"
          >
            Proceed to Checkout 💳
          </button>
        </section>
      </div>

      {/* Modales */}
      {cropOpen && (
        <CropperModal
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          onDone={(dataUrl) => {
            setUserImage(dataUrl);
            setCropOpen(false);
          }}
          aspect={4 / 3}
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
        />
      )}
      {showCheckout && <StripeCheckoutModal total={CARD_PRICE} gift={gift} onClose={() => setShowCheckout(false)} />}
    </main>
  );
                }
