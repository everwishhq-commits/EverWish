"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 💌 Mensaje automático por tipo
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/ghost/.test(s)) return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/zombie/.test(s)) return "Wishing you laughs, brains, and cake on your special day! 🧟‍♂️🎂";
  if (/pumpkin/.test(s)) return "May your night glow with pumpkin magic and endless treats. ✨🍬";
  if (/love/.test(s)) return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/birthday/.test(s)) return "Happy Birthday! Wishing you joy and surprises. 🎉";
  return "Celebrate this moment with a smile. ✨";
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("hearts");
  const [showEdit, setShowEdit] = useState(false);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });

  const CARD_PRICE = 5;

  // Pantalla inicial fullscreen
  useEffect(() => {
    (async () => {
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
    })();
  }, [slug]);

  // ✨ Animaciones globales (frente)
  const renderEffect = () => {
    const symbol =
      anim === "sparkles" ? "✨" : anim === "hearts" ? "💖" : anim === "confetti" ? "•" : null;
    if (!symbol) return null;
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="fixed text-xl z-[9999] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -120],
          x: [0, Math.random() * 150 - 75],
          scale: [0.8, 1.2, 0],
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

  // 🎁 Gift Card popup
  const GiftCardPopup = ({ onDone }) => {
    const tabs = ["Popular", "Lifestyle", "Digital"];
    const [active, setActive] = useState("Popular");
    const [tempBrand, setTempBrand] = useState("");
    const [amount, setAmount] = useState(0);
    const data = {
      Popular: ["Amazon", "Walmart", "Target", "Apple"],
      Lifestyle: ["Nike", "H&M", "Zara", "Shein"],
      Digital: ["Google Play", "Spotify", "Netflix", "Xbox"],
    };
    const quick = [10, 25, 50, 100];
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9998]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md shadow-2xl relative"
        >
          <button
            onClick={() => onDone(null)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>
          <div className="flex justify-center gap-6 mb-4">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`pb-1 ${
                  active === t
                    ? "text-pink-500 border-b-2 border-pink-500 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {data[active].map((b) => (
              <button
                key={b}
                onClick={() => setTempBrand(b)}
                className={`border rounded-xl py-2 px-3 text-sm ${
                  tempBrand === b
                    ? "bg-pink-100 border-pink-400 text-pink-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <h4 className="text-sm font-semibold mb-2 text-gray-600 text-center">Amount (USD)</h4>
          <div className="flex gap-2 justify-center mb-2">
            {quick.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`px-3 py-1 rounded-lg border transition ${
                  Number(amount) === a
                    ? "bg-pink-100 border-pink-500 text-pink-600"
                    : "hover:bg-gray-100"
                }`}
              >
                ${a}
              </button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!tempBrand || !Number(amount)}
            onClick={() => onDone({ brand: tempBrand, amount })}
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

  // 💳 Checkout popup
  const CheckoutPopup = () => {
    const [localGift, setLocalGift] = useState(giftSelection);
    const [showInnerGift, setShowInnerGift] = useState(false);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9997]">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
        >
          <button
            onClick={() => setShowCheckout(false)}
            className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h3 className="text-xl font-bold text-center text-pink-600 mb-3">
            Checkout 💜
          </h3>
          <p className="text-center text-gray-500 mb-5">
            Please fill out the <strong>sender</strong> and <strong>recipient</strong> information below ✨
          </p>

          <div className="space-y-3">
            <input placeholder="Your name *" required className="w-full rounded-xl border p-3 text-center" />
            <input placeholder="Your email *" required className="w-full rounded-xl border p-3 text-center" />
            <input placeholder="Your phone" className="w-full rounded-xl border p-3 text-center" />
            <input placeholder="Recipient name *" required className="w-full rounded-xl border p-3 text-center" />
            <input placeholder="Recipient email *" required className="w-full rounded-xl border p-3 text-center" />
            <input placeholder="Recipient phone" className="w-full rounded-xl border p-3 text-center" />
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-gray-50 text-center border border-gray-200">
            <p className="font-medium text-gray-700 mb-2">Purchase Summary</p>
            <p className="text-sm text-gray-600">
              💌 Everwish eCard — ${CARD_PRICE.toFixed(2)}
            </p>

            {localGift.brand ? (
              <>
                <p className="text-sm text-gray-600">
                  🎁 Gift Card: <strong>{localGift.brand}</strong> — ${localGift.amount}
                </p>
                <button
                  onClick={() => setLocalGift({ brand: "", amount: 0 })}
                  className="text-xs text-pink-500 mt-1 hover:underline"
                >
                  🗑️ Remove Gift Card
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowInnerGift(true)}
                className="text-xs text-pink-500 mt-1 hover:underline"
              >
                ➕ Add Gift Card
              </button>
            )}

            <p className="mt-3 text-gray-700 font-semibold">
              Total: ${(CARD_PRICE + (localGift.amount || 0)).toFixed(2)}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full mt-5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 transition"
          >
            Confirm & Pay 💳
          </motion.button>
        </motion.div>

        {showInnerGift && (
          <GiftCardPopup
            onDone={(gift) => {
              setShowInnerGift(false);
              if (gift) setLocalGift(gift);
            }}
          />
        )}
      </div>
    );
  };

  // 🌸 Vista principal
  if (!showEdit)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black relative">
        {item.src?.endsWith(".mp4") ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <img
            src={item.src}
            alt={slug}
            className="w-full h-full object-cover absolute inset-0"
          />
        )}

        {/* 🌈 Barra de progreso */}
        <div className="absolute bottom-10 w-3/4 h-2 rounded-full overflow-hidden bg-white/20 backdrop-blur-md">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300"
          />
        </div>

        {/* Texto elegante */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3 }}
          className="absolute bottom-16 text-white text-sm font-light tracking-wide"
        >
          Previewing your card... ✨
        </motion.p>
      </div>
    );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {renderEffect()}
      <div className="relative z-20">
        <div className="w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</h2>
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
              className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition"
            >
              Checkout 💜
            </button>
          </div>

          {giftSelection.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>
                Selected: <strong>{giftSelection.brand}</strong> — ${giftSelection.amount}
              </span>
              <button
                onClick={() => setGiftSelection({ brand: "", amount: 0 })}
                className="text-pink-400 hover:text-pink-600 transition"
              >
                🗑️
              </button>
            </div>
          )}
        </section>
      </div>

      {showGiftPopup && (
        <GiftCardPopup
          onDone={(gift) => {
            setShowGiftPopup(false);
            if (gift) setGiftSelection(gift);
          }}
        />
      )}
      {showCheckout && <CheckoutPopup />}
    </main>
  );
              }
