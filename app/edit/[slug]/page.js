"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🎃 Mensaje por defecto
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
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);

  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        setTimeout(async () => {
          if (document.fullscreenElement) await document.exitFullscreen();
          setShowEdit(true);
        }, 3000);
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  // ✨ Animaciones visuales
  const renderEffect = () => {
    const symbol = anim === "sparkles" ? "✨" : anim === "hearts" ? "💖" : anim === "confetti" ? "•" : null;
    if (!symbol) return null;
    return Array.from({ length: 15 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-10"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -100],
          x: [0, Math.random() * 100 - 50],
          scale: [0.8, 1.3, 0],
        }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
        style={{
          color:
            anim === "confetti"
              ? ["#ff80b5", "#ffd700", "#4dd4ff", "#baffc9"][Math.floor(Math.random() * 4)]
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

  // 💌 Popup Gift Card
  const GiftCardPopup = () => {
    const TABS = ["Popular", "Lifestyle", "Digital"];
    const [activeTab, setActiveTab] = useState("Popular");
    const [expanded, setExpanded] = useState({ Popular: false, Lifestyle: false, Digital: false });
    const [tempBrand, setTempBrand] = useState(giftSelection.brand || "");
    const [amount, setAmount] = useState(giftSelection.amount || 0);
    const DATA = {
      Popular: {
        featured: ["Amazon", "Walmart", "Target"],
        more: ["Apple", "Best Buy", "Visa eGift", "Starbucks", "Sephora"],
      },
      Lifestyle: {
        featured: ["Nike", "H&M", "Zara"],
        more: ["Lululemon", "Bath & Body Works", "Etsy", "Shein", "Ulta"],
      },
      Digital: {
        featured: ["Google Play", "Spotify", "Netflix"],
        more: ["Xbox", "PlayStation", "Steam", "Apple Music", "Disney+"],
      },
    };
    const quickAmounts = [10, 25, 50, 100];
    const renderButtons = (arr) => (
      <div className="grid grid-cols-2 gap-3">
        {arr.map((b) => (
          <button
            key={b}
            onClick={() => setTempBrand(b)}
            className={`border rounded-xl py-2 px-3 text-sm font-medium transition ${
              tempBrand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    );
    const onDone = () => {
      setGiftSelection({ brand: tempBrand, amount: Number(amount) || 0 });
      setShowGiftPopup(false);
    };
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
        >
          <button onClick={() => setShowGiftPopup(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>
          <h3 className="text-xl font-bold text-center mb-4 text-pink-600">Choose a Gift Card 🎁</h3>
          <div className="flex justify-center gap-6 mb-4">
            {TABS.map((t) => (
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
          <div className="mb-3">{renderButtons(DATA[activeTab].featured)}</div>
          <div className="mb-3">
            <button
              onClick={() => setExpanded((e) => ({ ...e, [activeTab]: !e[activeTab] }))}
              className="text-sm text-gray-600 hover:text-pink-500"
            >
              {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
            </button>
            {expanded[activeTab] && <div className="mt-3">{renderButtons(DATA[activeTab].more)}</div>}
          </div>
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-600 text-center">Amount (USD)</h4>
            <div className="flex gap-2 justify-center mb-2">
              {quickAmounts.map((a) => (
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
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!tempBrand || !Number(amount)}
            onClick={onDone}
            className={`w-full rounded-full py-3 font-semibold transition ${
              !tempBrand || !Number(amount)
                ? "bg-pink-300 text-white cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // 💳 Popup Checkout info
  const CheckoutPopup = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6"
      >
        <button onClick={() => setShowCheckout(false)} className="absolute right-6 top-5 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Checkout 💜</h3>
        <p className="text-center text-gray-600 mb-3">
          Please enter sender and recipient details to complete your Everwish 💌
        </p>
        <div className="space-y-3">
          <input placeholder="Your name" className="w-full rounded-xl border p-3 text-center" />
          <input placeholder="Your email" className="w-full rounded-xl border p-3 text-center" />
          <input placeholder="Your phone" className="w-full rounded-xl border p-3 text-center" />
          <input placeholder="Recipient name" className="w-full rounded-xl border p-3 text-center" />
          <input placeholder="Recipient email" className="w-full rounded-xl border p-3 text-center" />
          <input placeholder="Recipient phone" className="w-full rounded-xl border p-3 text-center" />
        </div>
        <div className="mt-6 text-center text-gray-700 font-medium">
          Total: ${CARD_PRICE + (giftSelection.amount || 0)}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 transition"
          onClick={() => setShowCheckout(false)}
        >
          Confirm & Pay 💳
        </motion.button>
      </motion.div>
    </div>
  );

  // 🩷 Pantalla principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">{renderEffect()}</div>

      <div className="relative z-20">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
          <motion.h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</motion.h2>

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
            <option value="sparkles">✨ Sparkles</option>
            <option value="confetti">🎉 Confetti</option>
            <option value="hearts">💖 Hearts</option>
            <option value="none">❌ None</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowGiftPopup(true)}
              className="w-[48%] rounded-full py-3 font-semibold transition text-[#3b2b1f]"
              style={{ backgroundColor: "#FFD966" }}
            >
              🎁 Choose Gift Card
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-[48%] bg-[#a66eff] hover:bg-[#8e4eff] text-white font-semibold py-3 rounded-full transition"
            >
              Checkout 💜
            </button>
          </div>

          {giftSelection.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>
                Selected: <strong>{giftSelection.brand}</strong> — ${giftSelection.amount.toFixed(2)}
              </span>
              <button
                onClick={() => setGiftSelection({ brand: "", amount: 0 })}
                className="text-pink-400 hover:text-pink-600 transition"
                title="Remove Gift Card"
              >
                🗑️
              </button>
            </div>
          )}
        </section>
      </div>

      {showGiftPopup && <GiftCardPopup />}
      {showCheckout && <CheckoutPopup />}
    </main>
  );
    }
