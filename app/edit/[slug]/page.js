"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🎁 Mensaje automático según slug
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/christmas|navidad/.test(s))
    return "May your days be merry, bright, and filled with love. 🎄✨";
  if (/halloween/.test(s) && /love/.test(s))
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s))
    return "Wishing you a spook-tacular night full of magic and candy! 👻🍬";
  if (/thanksgiving/.test(s))
    return "Grateful for every blessing and every smile. 🦃🍁";
  if (/birthday/.test(s))
    return "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂";
  if (/love|valentine/.test(s))
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/condolence|loss|memory|funeral/.test(s))
    return "May peace and love comfort your heart today and always. 🕊️🤍";
  if (/independence|july|usa/.test(s))
    return "Celebrate freedom and unity. Happy Independence Day! 🇺🇸🎆";
  if (/easter|bunny/.test(s))
    return "Let joy and renewal bloom within you. 🐰🌸";
  if (/newyear|year/.test(s))
    return "A fresh start, new dreams, and endless joy. ✨🎆";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

// 🎇 10 animaciones por categoría
function getAnimationsForSlug(slug) {
  const s = slug.toLowerCase();
  if (/christmas|navidad/.test(s))
    return ["🎄 Snow Glow","🎁 Santa Spark","✨ Twinkle Lights","❄️ Snowfall","🕯️ Candle Light","🎅 Gift Pop","🌟 Star Shine","💫 Magic Dust","🧦 Cozy Socks","🔔 Jingle Bells"];
  if (/halloween/.test(s))
    return ["🎃 Pumpkin Glow","👻 Ghost Drift","🕸️ Web Fall","🧙‍♀️ Witch Dust","🦇 Bat Flight","🪄 Spark Potion","💀 Skull Flicker","🕯️ Candle Mist","🌕 Moonlight Fade","🍬 Candy Rain"];
  if (/thanksgiving/.test(s))
    return ["🦃 Turkey Glow","🍂 Leaf Drift","🍁 Fall Wind","🕯️ Warm Light","🥧 Pie Puff","🌻 Harvest Bloom","🍗 Feast Fade","🌾 Grain Wave","🍃 Gentle Breeze","🔥 Hearth Flicker"];
  if (/birthday/.test(s))
    return ["🎉 Confetti Burst","🎂 Cake Spark","🎈 Balloon Rise","✨ Glitter Pop","🎊 Party Stream","💝 Ribbon Glow","🌈 Color Rain","🎁 Gift Slide","🪩 Disco Spin","🥳 Smile Twirl"];
  if (/love|valentine/.test(s))
    return ["💖 Floating Hearts","💘 Cupid Spark","💞 Pink Glow","🌹 Rose Fall","💋 Kiss Burst","✨ Soft Sparkle","🌸 Bloom Fade","💕 Heart Trail","💫 Romantic Dust","🕯️ Candle Flicker"];
  if (/condolence|loss|memory|funeral/.test(s))
    return ["🕊️ Dove Flight","🌿 Leaf Drift","🌧️ Soft Rain","💫 Gentle Light","🌸 Petal Fall","✨ Peace Glow","🌙 Moon Fade","🪶 Feather Drift","🕯️ Candle Calm","🌾 Serenity Wave"];
  if (/independence|july|usa/.test(s))
    return ["🇺🇸 Flag Wave","🎆 Firework Burst","✨ Star Spark","🗽 Liberty Glow","🎇 Light Rain","🔥 Spark Trail","💫 Freedom Beam","🎉 RedWhiteBlue","🌟 Sky Flash","🦅 Eagle Sweep"];
  if (/easter|bunny/.test(s))
    return ["🐰 Hop Trail","🌸 Flower Bloom","🌼 Petal Pop","🥚 Egg Jump","🌷 Spring Glow","✨ Gentle Sparkle","☀️ Morning Shine","🕊️ Dove Peace","💐 Joy Spread","🍃 Fresh Air"];
  if (/newyear|year/.test(s))
    return ["🎆 Fireworks","✨ Glitter Burst","🎇 Star Rain","🌟 Spark Trail","🎉 Pop Stream","🍾 Champagne Rise","💫 Midnight Glow","🕛 Clock Flash","🎊 Joy Burst","🌈 New Dawn"];
  return ["✨ Sparkles","🎉 Confetti","💖 Hearts","🌸 Bloom","🌟 Shine","🕊️ Peace","🌈 Glow","💫 Dust","🎇 Light","❌ None"];
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);

  const CARD_PRICE = 5;

  // 🟣 Carga de datos y configuración
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
        setAnim(opts[0] || "❌ None");
      } catch (e) {
        console.error("Error loading videos:", e);
      }
    })();
  }, [slug]);

  // 🟡 Control del fullscreen con seguridad
  const startFullscreenAndProgress = async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
    } catch {}

    const start = performance.now();
    const duration = 3000;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // 🔹 Salida forzada del fullscreen
    setTimeout(async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
      } catch {}
      setShowEdit(true);
    }, 3000);
  };

  // 🔸 Si se queda trabado en fullscreen, permite avanzar con tap
  useEffect(() => {
    const handleTap = async () => {
      if (!showEdit && startedRef.current) {
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
        } catch {}
        setShowEdit(true);
      }
    };
    window.addEventListener("click", handleTap);
    window.addEventListener("touchstart", handleTap);
    return () => {
      window.removeEventListener("click", handleTap);
      window.removeEventListener("touchstart", handleTap);
    };
  }, [showEdit]);

  // ✨ Render de efecto visual
  const renderEffect = () => {
    if (!anim || anim.includes("None")) return null;
    const emoji = anim.split(" ")[0];
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
        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
      >
        {emoji}
      </motion.span>
    ));
  };

  // 🎁 Gift Card Popup
  const GiftCardPopup = () => {
    const tabs = ["Popular", "Lifestyle", "Digital"];
    const [activeTab, setActiveTab] = useState("Popular");
    const [expanded, setExpanded] = useState({});
    const [tempBrand, setTempBrand] = useState(giftSelection.brand || "");
    const [amount, setAmount] = useState(giftSelection.amount || 0);
    const quick = [5, 10, 25, 50, 100];

    const cards = {
      Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
      Lifestyle:{ featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
      Digital:  { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
    };

    const onDone = () => {
      setGiftSelection({ brand: tempBrand, amount: Number(amount) || 0 });
      setShowGiftPopup(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
          <button onClick={() => setShowGiftPopup(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
          <h3 className="text-xl font-bold text-center mb-4 text-pink-600">Choose a Gift Card 🎁</h3>
          <div className="flex justify-center gap-6 mb-4">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`pb-1 ${activeTab === t ? "text-pink-500 border-b-2 border-pink-500 font-semibold" : "text-gray-400"}`}>{t}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {cards[activeTab].featured.map((b) => (
              <button key={b} onClick={() => setTempBrand(b)} className={`border rounded-xl py-2 px-3 text-sm ${tempBrand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}>{b}</button>
            ))}
          </div>

          {expanded[activeTab] && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {cards[activeTab].more.map((b) => (
                <button key={b} onClick={() => setTempBrand(b)} className={`border rounded-xl py-2 px-3 text-sm ${tempBrand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}>{b}</button>
              ))}
            </div>
          )}

          <button onClick={() => setExpanded((p) => ({ ...p, [activeTab]: !p[activeTab] }))} className="text-sm text-gray-600 hover:text-pink-500 mb-3">
            {expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}
          </button>

          <h4 className="text-sm font-semibold mb-2 text-gray-600 text-center">Amount (USD)</h4>
          <div className="flex gap-2 justify-center mb-4">
            {quick.map((a) => (
              <button key={a} onClick={() => setAmount(a)} className={`px-3 py-1 rounded-lg border transition ${Number(amount) === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"}`}>${a}</button>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.97 }} disabled={!tempBrand || !Number(amount)} onClick={onDone}
            className={`w-full rounded-full py-3 font-semibold transition ${!tempBrand || !Number(amount) ? "bg-pink-300 text-white cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600 text-white"}`}>
            Done
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // 🪄 Intro pantalla completa
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black" onClick={startFullscreenAndProgress}>
        {item?.src?.endsWith(".mp4") ? (
          <>
            <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <img src={item?.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  // 🌸 Página principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">{renderEffect()}</div>

      <div className="relative z-20">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item?.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item?.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</h2>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400" />

          <select value={anim} onChange={(e) => setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400">
            {animOptions.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
            <option value="❌ None">❌ None</option>
          </select>

          <div className="flex justify-between mt-4">
            <button onClick={() => setShowGiftPopup(true)} className="w-[48%] rounded-full py-3 font-semibold transition text-[#3b2b1f]" style={{ backgroundColor: "#FFD966" }}>
              🎁 Choose Gift Card
            </button>
            <button onClick={() => setShowCheckout(true)} className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition">
              Checkout 💜
            </button>
          </div>

          {giftSelection.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>Selected: <strong>{giftSelection.brand}</strong> — ${giftSelection.amount.toFixed(2)}</span>
              <button onClick={() => setGiftSelection({ brand: "", amount: 0 })} className="text-pink-400 hover:text-pink-600 transition" title="Remove gift card">🗑️</button>
            </div>
          )}
        </section>
      </div>

      {showGiftPopup && <GiftCardPopup />}
    </main>
  );
            }
