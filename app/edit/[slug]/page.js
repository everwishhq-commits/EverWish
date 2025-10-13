"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🔹 Detectar categoría según slug
function detectCategory(slug = "") {
  const s = slug.toLowerCase();
  if (/christmas|xmas|santa|navidad|tree|gift/.test(s)) return "christmas";
  if (/thanksgiving|turkey|harvest/.test(s)) return "thanksgiving";
  if (/halloween|pumpkin|ghost|zombie/.test(s)) return "halloween";
  if (/love|valentine|heart/.test(s)) return "love";
  if (/birthday|cake|bday/.test(s)) return "birthday";
  if (/baby|newborn|shower/.test(s)) return "baby";
  if (/graduation|diploma|grad/.test(s)) return "graduation";
  if (/wedding|engagement|marriage/.test(s)) return "wedding";
  if (/independence|usa|july|america/.test(s)) return "independence";
  if (/condolence|funeral|sympathy/.test(s)) return "condolence";
  if (/easter|bunny|egg/.test(s)) return "easter";
  return "general";
}

// 🔸 Animaciones por categoría
function getAnimations(category) {
  const animations = {
    christmas: ["snowflake", "gift", "sparkle", "bell", "tree", "star", "glow", "santa", "bow", "candy"],
    thanksgiving: ["leaf", "corn", "pumpkin", "sparkle", "turkey", "wheat", "feather", "glow", "acorn", "harvest"],
    halloween: ["ghost", "bat", "pumpkin", "candy", "sparkle", "web", "skull", "zombie", "hat", "moon"],
    love: ["heart", "petal", "sparkle", "rose", "kiss", "ring", "envelope", "chocolate", "wing", "glow"],
    birthday: ["balloon", "confetti", "sparkle", "cake", "gift", "ribbon", "partyhat", "cupcake", "streamer", "glow"],
    baby: ["cloud", "star", "heart", "sparkle", "teddy", "rattle", "moon", "bootie", "pacifier", "rainbow"],
    graduation: ["cap", "scroll", "confetti", "sparkle", "star", "book", "light", "ribbon", "flag", "trophy"],
    wedding: ["ring", "petal", "sparkle", "heart", "dove", "flower", "champagne", "bell", "veil", "glow"],
    independence: ["firework", "flag", "star", "sparkle", "confetti", "balloon", "shield", "glow", "burst", "heart"],
    condolence: ["dove", "leaf", "sparkle", "light", "cloud", "feather", "candle", "star", "petal", "glow"],
    easter: ["bunny", "egg", "flower", "sparkle", "basket", "chick", "grass", "sun", "butterfly", "cloud"],
    general: ["sparkle", "confetti", "heart", "star", "light", "balloon", "petal", "ribbon", "glow", "wave"]
  };
  return animations[category] || animations.general;
}

// 🌟 Render visual animado
function renderAnimation(type, index) {
  const styles = {
    sparkle: { symbol: "✨", color: "#FFD700" },
    heart: { symbol: "💖", color: "#ff5fa2" },
    confetti: { symbol: "🎉", color: "#ff80b5" },
    balloon: { symbol: "🎈", color: "#ff6f61" },
    dove: { symbol: "🕊️", color: "#dfe7fd" },
    snowflake: { symbol: "❄️", color: "#b3e5fc" },
    gift: { symbol: "🎁", color: "#ff1744" },
    star: { symbol: "⭐", color: "#ffd54f" },
    petal: { symbol: "🌸", color: "#f48fb1" },
    firework: { symbol: "🎆", color: "#f50057" },
    leaf: { symbol: "🍂", color: "#ffb74d" },
    bunny: { symbol: "🐰", color: "#d7ccc8" },
    egg: { symbol: "🥚", color: "#fff9c4" },
    light: { symbol: "💡", color: "#fff59d" },
    candle: { symbol: "🕯️", color: "#ffe082" },
    moon: { symbol: "🌙", color: "#c5cae9" },
    flower: { symbol: "🌹", color: "#e57373" },
    cap: { symbol: "🎓", color: "#455a64" },
    ring: { symbol: "💍", color: "#e0e0e0" },
    glow: { symbol: "✨", color: "#fff8e1" }
  };
  const { symbol, color } = styles[type] || { symbol: "✨", color: "#FFD700" };
  const randomPos = { top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` };
  return (
    <motion.span
      key={index}
      className="absolute text-2xl select-none"
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 100 - 50],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: index * 0.3 }}
      style={{ color, ...randomPos }}
    >
      {symbol}
    </motion.span>
  );
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState("general");
  const [animations, setAnimations] = useState([]);
  const [message, setMessage] = useState("");
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found);
      const cat = detectCategory(slug);
      setCategory(cat);
      setAnimations(getAnimations(cat));

      // Pantalla completa + barra de progreso
      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } catch {}

      let p = 0;
      const interval = setInterval(() => {
        p += 1;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          document.exitFullscreen?.();
          setShowEdit(true);
        }
      }, 30); // ~3 s
    })();
  }, [slug]);

  if (!item) return null;

  // 💝 Popup Gift Card
  const GiftPopup = () => {
    const cards = ["Amazon", "Walmart", "Target", "Apple", "Best Buy", "Netflix", "Spotify", "Google Play"];
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
          <button onClick={() => setShowGift(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
          <h3 className="text-xl font-bold text-center mb-4 text-pink-600">Choose Gift Card 🎁</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {cards.map((c) => (
              <button key={c} onClick={() => setGift({ name: c, price: 10 })}
                className="border rounded-xl py-3 text-center hover:bg-pink-100 text-gray-700 font-medium">
                {c}
              </button>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.95 }} disabled={!gift} onClick={() => setShowGift(false)}
            className={`w-full rounded-full py-3 font-semibold ${gift ? "bg-pink-500 hover:bg-pink-600 text-white" : "bg-pink-300 text-white"}`}>
            Done
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // 💳 Checkout
  const Checkout = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
        <button onClick={() => setShowCheckout(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="text-xl font-bold text-center mb-4 text-pink-600">Checkout 💜</h3>
        <div className="space-y-3">
          <input placeholder="Your name *" className="w-full rounded-xl border p-3 text-center" required />
          <input placeholder="Your email *" className="w-full rounded-xl border p-3 text-center" required />
          <input placeholder="Recipient name *" className="w-full rounded-xl border p-3 text-center" required />
          <input placeholder="Recipient email *" className="w-full rounded-xl border p-3 text-center" required />
        </div>
        <div className="mt-5 text-center text-gray-700 font-medium">
          Total: ${CARD_PRICE + (gift?.price || 0)}
        </div>
        <motion.button whileTap={{ scale: 0.95 }}
          className="w-full mt-4 rounded-full bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 transition">
          Confirm & Pay 💜
        </motion.button>
      </motion.div>
    </div>
  );

  // 🟣 Pantalla 1: vista completa con barra
  if (!showEdit)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black overflow-hidden">
        {item.src?.endsWith(".mp4") ? (
          <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
        {animations.map((a, i) => renderAnimation(a, i))}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-700/40">
          <motion.div className="h-full bg-gradient-to-r from-pink-400 via-amber-300 to-yellow-300"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.03 }} />
        </div>
      </div>
    );

  // 🟢 Pantalla 2: Editor
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-10">{animations.map((a, i) => renderAnimation(a, i))}</div>
      <div className="relative z-20">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative z-30">
          <motion.h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</motion.h2>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400" />
          <div className="flex justify-between mt-4">
            <button onClick={() => setShowGift(true)}
              className="w-[48%] rounded-full py-3 font-semibold transition text-[#3b2b1f]"
              style={{ backgroundColor: "#FFD966" }}>🎁 Gift Card</button>
            <button onClick={() => setShowCheckout(true)}
              className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition">
              Checkout 💜
            </button>
          </div>
          {gift && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>Selected: <strong>{gift.name}</strong> — ${gift.price}</span>
              <button onClick={() => setGift(null)} className="text-pink-400 hover:text-pink-600 transition">🗑️</button>
            </div>
          )}
        </section>
      </div>
      {showGift && <GiftPopup />}
      {showCheckout && <Checkout />}
    </main>
  );
                  }
