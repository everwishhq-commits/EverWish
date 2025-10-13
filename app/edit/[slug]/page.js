"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 💌 Mensaje automático según slug
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/halloween/.test(s) && /love/.test(s))
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/zombie/.test(s) && /birthday/.test(s))
    return "Wishing you laughs, brains, and cake on your special day! 🧟‍♂️🎂";
  if (/ghost/.test(s) && /love/.test(s))
    return "Sending ghostly hugs and endless love from the beyond. 👻💞";
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
  const [progress, setProgress] = useState(0);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);

  const CARD_PRICE = 5;

  // 🕒 Pantalla inicial con barra de progreso
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        const start = performance.now();
        const duration = 3000;
        const tick = () => {
          const p = Math.min(1, (performance.now() - start) / duration);
          setProgress(Math.round(p * 100));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        setTimeout(async () => {
          if (document.fullscreenElement) await document.exitFullscreen();
          setShowEdit(true);
        }, 3000);
      } catch {
        setShowEdit(true);
      }
    })();
  }, [slug]);

  // ✨ Animaciones frontales
  const renderEffect = () => {
    const symbol =
      anim === "sparkles"
        ? "✨"
        : anim === "hearts"
        ? "💖"
        : anim === "confetti"
        ? "•"
        : null;
    if (!symbol) return null;
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute text-xl z-[40]"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -120],
          x: [0, Math.random() * 120 - 60],
          scale: [0.8, 1.2, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.25,
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

  // 💝 Popup Gift Card
  const GiftCardPopup = () => {
    const tabs = ["Popular", "Lifestyle", "Digital"];
    const [activeTab, setActiveTab] = useState("Popular");
    const [expanded, setExpanded] = useState({});
    const [tempBrand, setTempBrand] = useState(giftSelection.brand || "");
    const [amount, setAmount] = useState(giftSelection.amount || 0);
    const cards = {
      Popular: {
        featured: ["Amazon", "Walmart", "Target"],
        more: ["Apple", "Best Buy", "Starbucks"],
      },
      Lifestyle: {
        featured: ["Nike", "H&M", "Zara"],
        more: ["Shein", "Etsy", "Bath & Body Works"],
      },
      Digital: {
        featured: ["Google Play", "Spotify", "Netflix"],
        more: ["Xbox", "PlayStation", "Disney+"],
      },
    };
    const quickAmounts = [10, 25, 50, 100];
    const onDone = () => {
      setGiftSelection({ brand: tempBrand, amount: Number(amount) || 0 });
      setShowGiftPopup(false);
    };
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative"
        >
          <button
            onClick={() => setShowGiftPopup(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-center mb-4 text-pink-600">
            Choose a Gift Card 🎁
          </h3>

          <div className="flex justify-center gap-6 mb-4">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-1 ${
                  activeTab === t
                    ? "text-pink-500 border-b-2 border-pink-500 font-semibold"
                    : "text-gray-400"
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

          <button
            onClick={() =>
              setExpanded((e) => ({ ...e, [activeTab]: !e[activeTab] }))
            }
            className="text-sm text-gray-600 hover:text-pink-500 mb-3"
          >
            {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
          </button>

          {expanded[activeTab] && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {cards[activeTab].more.map((b) => (
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
          )}

          <h4 className="text-sm font-semibold mb-2 text-gray-600 text-center">
            Amount (USD)
          </h4>
          <div className="flex gap-2 justify-center mb-4">
            {quickAmounts.map((a) => (
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

  // 💳 Checkout con resumen, datos y totales
  const CheckoutPopup = () => {
    const [sender, setSender] = useState({ name: "", email: "", phone: "" });
    const [recipient, setRecipient] = useState({
      name: "",
      email: "",
      phone: "",
    });
    const total = CARD_PRICE + (giftSelection.amount || 0);
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative"
        >
          <button
            onClick={() => setShowCheckout(false)}
            className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-center text-pink-600 mb-4">
            Checkout 💜
          </h3>

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
                onChange={(e) =>
                  setRecipient({ ...recipient, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full rounded-xl border p-3 mb-2"
                value={recipient.email}
                onChange={(e) =>
                  setRecipient({ ...recipient, email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="w-full rounded-xl border p-3"
                value={recipient.phone}
                onChange={(e) =>
                  setRecipient({ ...recipient, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
            <p className="font-semibold mb-1">Order summary</p>
            <div className="flex justify-between">
              <span>Card</span>
              <span>${CARD_PRICE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>
                Gift Card{" "}
                {giftSelection.brand
                  ? `(${giftSelection.brand} $${giftSelection.amount})`
                  : "(none)"}
              </span>
              {giftSelection.brand && (
                <button
                  onClick={() => setGiftSelection({ brand: "", amount: 0 })}
                  className="text-gray-500 hover:text-red-500"
                >
                  🗑️
                </button>
              )}
            </div>
            {!giftSelection.brand && (
              <button
                onClick={() => setShowGiftPopup(true)}
                className="mt-2 text-pink-600 hover:underline text-sm"
              >
                Add a Gift Card
              </button>
            )}
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3"
          >
            Confirm & Pay ${total.toFixed(2)}
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // 🖼️ Pantalla de carga
  if (!showEdit)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {item?.src?.endsWith(".mp4") ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.src}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );

  // 🌸 Vista principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">{renderEffect()}</div>

      <div className="relative z-20">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item?.src?.endsWith(".mp4") ? (
            <video
              src={item.src}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-[420px] object-contain"
            />
          ) : (
            <img
              src={item.src}
              alt={slug}
              className="w-full h-[420px] object-contain"
            />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            Customize your message ✨
          </h2>

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
                Selected: <strong>{giftSelection.brand}</strong> — $
                {giftSelection.amount.toFixed(2)}
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

      {showGiftPopup && <GiftCardPopup />}
      {showCheckout && <CheckoutPopup />}
    </main>
  );
                        }
