"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 💬 Mensaje automático según el slug
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/halloween/.test(s) && /love/.test(s))
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s) && /birthday/.test(s))
    return "May your day rise again with pumpkin magic and sweet joy! 🎃🎂";
  if (/zombie/.test(s) && /birthday/.test(s))
    return "Wishing you laughs, brains, and cake on your special day! 🧟‍♂️🎂";
  if (/ghost/.test(s) && /love/.test(s))
    return "Sending ghostly hugs and endless love from the beyond. 👻💞";
  if (/pumpkin/.test(s) && /halloween/.test(s))
    return "May your night glow with magic and endless treats. ✨🍬";
  if (/love/.test(s))
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/birthday/.test(s))
    return "Happy Birthday! Wishing you a day full of joy and surprises. 🎉";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("sparkles");
  const [showEdit, setShowEdit] = useState(false);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftCard, setGiftCard] = useState(null);
  const [giftAmount, setGiftAmount] = useState(0);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // 💾 Cargar video/imágen
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found || null);
      setMessage(defaultMessageFromSlug(slug));

      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } catch {}
      setTimeout(async () => {
        if (document.fullscreenElement) await document.exitFullscreen();
        setShowEdit(true);
      }, 3000);
    })();
  }, [slug]);

  // ✨ Animaciones decorativas
  const renderEffect = () => {
    const effects = {
      sparkles: "✨",
      hearts: "💖",
      confetti: "•",
    };
    const symbol = effects[anim] || null;
    if (!symbol) return null;

    return Array.from({ length: 20 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -100],
          x: [0, Math.random() * 100 - 50],
          scale: [0.8, 1.2, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
        style={{
          color:
            anim === "confetti"
              ? ["#ff80b5", "#ffd700", "#4dd4ff", "#baffc9"][
                  Math.floor(Math.random() * 4)
                ]
              : anim === "hearts"
              ? "#ff70a6"
              : "#ffd700",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {symbol}
      </motion.span>
    ));
  };

  if (!item) return null;

  // 🎬 Paso 1: pantalla completa
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.toLowerCase().endsWith(".mp4") ? (
          <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  // 🎁 Popup Gift Cards
  const GiftCardPopup = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
        <h3 className="text-2xl font-bold text-center mb-4 text-pink-600">Select Your Gift Card 🎁</h3>
        <select
          onChange={(e) => setGiftCard(e.target.value)}
          className="w-full border rounded-2xl p-3 text-center focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Choose category</option>
          <optgroup label="Popular">
            <option value="Amazon">Amazon</option>
            <option value="Walmart">Walmart</option>
            <option value="Target">Target</option>
          </optgroup>
          <optgroup label="Tech & Games">
            <option value="Apple">Apple</option>
            <option value="Google Play">Google Play</option>
            <option value="Steam">Steam</option>
          </optgroup>
          <optgroup label="Style & Fun">
            <option value="Sephora">Sephora</option>
            <option value="Starbucks">Starbucks</option>
            <option value="Uber Eats">Uber Eats</option>
          </optgroup>
        </select>

        <input
          type="number"
          min="5"
          step="5"
          placeholder="Amount (USD)"
          className="w-full border rounded-2xl p-3 mt-4 text-center focus:ring-2 focus:ring-pink-400"
          onChange={(e) => setGiftAmount(Number(e.target.value))}
        />

        <div className="flex justify-between mt-6">
          <button
            className="px-5 py-3 bg-gray-300 rounded-2xl font-semibold"
            onClick={() => setShowGiftPopup(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-semibold"
            onClick={() => setShowGiftPopup(false)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  // 🧾 Popup Checkout (emisor/receptor)
  const CheckoutPopup = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
        <h3 className="text-2xl font-bold text-center mb-6 text-purple-600">Checkout 🧾</h3>

        <div className="grid grid-cols-1 gap-4">
          <h4 className="font-semibold text-gray-600">Sender information</h4>
          <input placeholder="Your Name" className="border rounded-2xl p-3" />
          <input placeholder="Your Email" className="border rounded-2xl p-3" />
          <input placeholder="Your Phone" className="border rounded-2xl p-3" />

          <h4 className="font-semibold mt-4 text-gray-600">Recipient information</h4>
          <input placeholder="Recipient Name" className="border rounded-2xl p-3" />
          <input placeholder="Recipient Email" className="border rounded-2xl p-3" />
          <input placeholder="Recipient Phone" className="border rounded-2xl p-3" />
        </div>

        <div className="mt-6 text-center font-semibold text-lg">
          Total: ${(10 + (giftAmount || 0)).toFixed(2)}
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-5 py-3 bg-gray-300 rounded-2xl font-semibold"
            onClick={() => setShowCheckout(false)}
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-[#b89cff] text-white rounded-2xl font-semibold">
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );

  // 🎨 Render principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">{renderEffect()}</div>

      <div className="relative z-10">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.toLowerCase().endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl font-semibold text-center mb-4 relative z-10"
          >
            Customize your message ✨
          </motion.h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400 relative z-10"
          />

          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400 relative z-10"
          >
            <option value="sparkles">✨ Sparkles</option>
            <option value="confetti">🎉 Confetti</option>
            <option value="hearts">💖 Hearts</option>
            <option value="none">❌ None</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowGiftPopup(true)}
              className="w-[48%] bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition relative z-10"
            >
              + Gift Card
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition relative z-10"
            >
              Checkout 💜
            </button>
          </div>
        </section>
      </div>

      {showGiftPopup && <GiftCardPopup />}
      {showCheckout && <CheckoutPopup />}
    </main>
  );
    }
