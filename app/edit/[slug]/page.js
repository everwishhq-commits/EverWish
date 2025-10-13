"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* ---------- Mensaje automático ---------- */
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/christmas|navidad/.test(s)) return "May your days be merry, bright, and filled with love. 🎄✨";
  if (/halloween/.test(s) && /love/.test(s)) return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s) && /birthday|cumple/.test(s)) return "Wishing you laughs, scares and sweet cake! 🎃🎂";
  if (/halloween/.test(s)) return "Wishing you a spook-tacular night full of magic and candy! 👻🍬";
  if (/thanksgiving/.test(s)) return "Grateful for every blessing and every smile. 🦃🍁";
  if (/birthday|cumple/.test(s)) return "Happy Birthday! Wishing you joy, laughter, and sweet surprises. 🎉🎂";
  if (/love|valentine/.test(s)) return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/condolence|loss|memory|funeral/.test(s)) return "May peace and love comfort your heart today and always. 🕊️🤍";
  if (/independence|july|usa/.test(s)) return "Celebrate freedom and unity. Happy Independence Day! 🇺🇸🎆";
  if (/easter|bunny/.test(s)) return "Let joy and renewal bloom within you. 🐰🌸";
  if (/newyear|year/.test(s)) return "A fresh start, new dreams, and endless joy. ✨🎆";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

/* ---------- Catálogo de animaciones (10 por categoría) ---------- */
const ANIMS = {
  christmas: ["🎄 Snow Glow","🎁 Santa Spark","✨ Twinkle Lights","❄️ Snowfall","🕯️ Candle Light","🎅 Gift Pop","🌟 Star Shine","💫 Magic Dust","🧦 Cozy Socks","🔔 Jingle Bells"],
  halloween: ["🎃 Pumpkin Glow","👻 Ghost Drift","🕸️ Web Fall","🧙‍♀️ Witch Dust","🦇 Bat Flight","🪄 Spark Potion","💀 Skull Flicker","🕯️ Candle Mist","🌕 Moonlight Fade","🍬 Candy Rain"],
  thanksgiving: ["🦃 Turkey Glow","🍂 Leaf Drift","🍁 Fall Wind","🕯️ Warm Light","🥧 Pie Puff","🌻 Harvest Bloom","🍗 Feast Fade","🌾 Grain Wave","🍃 Gentle Breeze","🔥 Hearth Flicker"],
  birthday: ["🎉 Confetti Burst","🎂 Cake Spark","🎈 Balloon Rise","✨ Glitter Pop","🎊 Party Stream","💝 Ribbon Glow","🌈 Color Rain","🎁 Gift Slide","🪩 Disco Spin","🥳 Smile Twirl"],
  love: ["💖 Floating Hearts","💘 Cupid Spark","💞 Pink Glow","🌹 Rose Fall","💋 Kiss Burst","✨ Soft Sparkle","🌸 Bloom Fade","💕 Heart Trail","💫 Romantic Dust","🕯️ Candle Flicker"],
  condolence: ["🕊️ Dove Flight","🌿 Leaf Drift","🌧️ Soft Rain","💫 Gentle Light","🌸 Petal Fall","✨ Peace Glow","🌙 Moon Fade","🪶 Feather Drift","🕯️ Candle Calm","🌾 Serenity Wave"],
  independence: ["🇺🇸 Flag Wave","🎆 Firework Burst","✨ Star Spark","🗽 Liberty Glow","🎇 Light Rain","🔥 Spark Trail","💫 Freedom Beam","🎉 RedWhiteBlue","🌟 Sky Flash","🦅 Eagle Sweep"],
  easter: ["🐰 Hop Trail","🌸 Flower Bloom","🌼 Petal Pop","🥚 Egg Jump","🌷 Spring Glow","✨ Gentle Sparkle","☀️ Morning Shine","🕊️ Dove Peace","💐 Joy Spread","🍃 Fresh Air"],
  newyear: ["🎆 Fireworks","✨ Glitter Burst","🎇 Star Rain","🌟 Spark Trail","🎉 Pop Stream","🍾 Champagne Rise","💫 Midnight Glow","🕛 Clock Flash","🎊 Joy Burst","🌈 New Dawn"],
};

function parseCategories(slug) {
  const s = (slug || "").toLowerCase();
  const cats = [];
  if (/christmas|navidad/.test(s)) cats.push("christmas");
  if (/halloween/.test(s)) cats.push("halloween");
  if (/thanksgiving/.test(s)) cats.push("thanksgiving");
  if (/birthday|cumple/.test(s)) cats.push("birthday");
  if (/love|valentine/.test(s)) cats.push("love");
  if (/condolence|loss|memory|funeral/.test(s)) cats.push("condolence");
  if (/independence|july|usa/.test(s)) cats.push("independence");
  if (/easter|bunny/.test(s)) cats.push("easter");
  if (/newyear|year/.test(s)) cats.push("newyear");
  return Array.from(new Set(cats));
}

function getAnimationsForSlug(slug) {
  const cats = parseCategories(slug);
  if (cats.length === 0) return ["✨ Sparkles","🎉 Confetti","💖 Hearts","🌸 Bloom","🌟 Shine","🕊️ Peace","🌈 Glow","💫 Dust","🎇 Light","❌ None"];
  const bag = [];
  for (const c of cats) bag.push(...(ANIMS[c] || []));
  return Array.from(new Set(bag)).slice(0, 10);
}

export default function EditPage() {
  const { slug } = useParams();

  // Intro
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Editor
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const CARD_PRICE = 5;

  // GiftCard / Checkout
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });

  // ------- Persistencia ligera (por slug) -------
  const keyMsg = `ew_msg_${slug}`;
  const keyAnim = `ew_anim_${slug}`;
  const keyGift = `ew_gift_${slug}`;

  useEffect(() => {
    try {
      const m = sessionStorage.getItem(keyMsg);
      if (m) setMessage(m);
      const a = sessionStorage.getItem(keyAnim);
      if (a) setAnim(a);
      const g = sessionStorage.getItem(keyGift);
      if (g) setGiftSelection(JSON.parse(g));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    try { sessionStorage.setItem(keyMsg, message); } catch {}
  }, [message, keyMsg]);

  useEffect(() => {
    try { sessionStorage.setItem(keyAnim, anim); } catch {}
  }, [anim, keyAnim]);

  useEffect(() => {
    try { sessionStorage.setItem(keyGift, JSON.stringify(giftSelection)); } catch {}
  }, [giftSelection, keyGift]);

  // Cargar video + animaciones
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);

        // Mensaje por defecto si no había uno guardado
        const had = sessionStorage.getItem(keyMsg);
        if (!had) setMessage(defaultMessageFromSlug(slug));

        // Opciones de animación por categoría
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);

        // Si no había una elegida, toma la primera
        const hadAnim = sessionStorage.getItem(keyAnim);
        if (!hadAnim) setAnim(opts[0] || "❌ None");
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* --- Pantalla extendida con barra y paso automático (3s) --- */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      // barra
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // fullscreen best-effort: si el navegador requiere gesto, igual mostramos la vista extendida sin tabs en la mayoría;
      // si no se puede, seguimos con el video de fondo y la barra.
      (async () => {
        try {
          const el = document.documentElement;
          if (el.requestFullscreen) await el.requestFullscreen();
          // Safari (no crashea si no existe)
          // eslint-disable-next-line no-unused-expressions
          el.webkitRequestFullscreen && el.webkitRequestFullscreen();
        } catch {}
      })();

      // auto salir y pasar a edición
      timer = setTimeout(async () => {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
          }
          // Safari
          // eslint-disable-next-line no-unused-expressions
          document.webkitExitFullscreen && document.webkitExitFullscreen();
        } catch {}
        setShowEdit(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  /* --- Animaciones suaves y al frente (sin bloquear inputs) --- */
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

  // ---- Gift Card Popup ----
  const GiftCardPopup = () => {
    const tabs = ["Popular", "Lifestyle", "Digital"];
    const [activeTab, setActiveTab] = useState("Popular");
    const [expanded, setExpanded] = useState({});
    const [tempBrand, setTempBrand] = useState(giftSelection.brand || "");
    const [amount, setAmount] = useState(giftSelection.amount || 0);

    const cards = {
      Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
      Lifestyle:{ featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
      Digital:  { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
    };

    const quick = [5, 10, 25, 50, 100];
    const onDone = () => {
      setGiftSelection({ brand: tempBrand, amount: Number(amount) || 0 });
      // NO tocamos el checkout aquí; solo cerramos este popup:
      setShowGiftPopup(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
          <button onClick={() => setShowGiftPopup(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
          <h3 className="text-xl font-bold text-center mb-4 text-pink-600">Choose a Gift Card 🎁</h3>

          {/* Tabs */}
          <div className="flex justify-center gap-6 mb-4">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`pb-1 ${activeTab === t ? "text-pink-500 border-b-2 border-pink-500 font-semibold" : "text-gray-400"}`}>{t}</button>
            ))}
          </div>

          {/* Featured */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {cards[activeTab].featured.map((b) => (
              <button key={b} onClick={() => setTempBrand(b)} className={`border rounded-xl py-2 px-3 text-sm ${tempBrand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}>{b}</button>
            ))}
          </div>

          {/* More */}
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

          {/* Amount */}
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

  // ---- Checkout (Stripe) ----
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          message,
          anim,
          cardPrice: CARD_PRICE,
          gift: giftSelection,
        }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert(data?.error || "Checkout not available. Configure STRIPE keys.");
    } catch {
      alert("Error starting checkout.");
    }
  };

  if (!item) return null;

  /* ---------- Pantalla extendida con barra y auto paso ---------- */
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
          <>
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Barra */}
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

  /* ---------------- Editor principal ---------------- */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animaciones al frente */}
      <div className="absolute inset-0">{renderEffect()}</div>

      <div className="relative z-[30]">
        {/* 1A: diseño */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        {/* 1B: mensaje + acciones */}
        <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
          />

          {/* Dropdown dinámico por categoría */}
          <select
            value={anim}
            onChange={(e) => setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
          >
            {animOptions.map((a, i) => (
              <option key={i} value={a}>{a}</option>
            ))}
            <option value="❌ None">❌ None</option>
          </select>

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowGiftPopup(true)}
              className="w-[48%] rounded-full py-3 font-semibold transition text-[#3b2b1f]"
              style={{ backgroundColor: "#FFD966" }}
            >
              🎁 Choose Gift Card
            </button>
            <button
              onClick={handleCheckout}
              className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition"
            >
              Checkout 💜
            </button>
          </div>

          {/* Estado seleccionado GiftCard */}
          {giftSelection.brand && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600 gap-2">
              <span>
                Selected: <strong>{giftSelection.brand}</strong> — ${Number(giftSelection.amount || 0).toFixed(2)}
              </span>
              <button
                onClick={() => setGiftSelection({ brand: "", amount: 0 })}
                className="text-pink-400 hover:text-pink-600 transition"
                title="Remove gift card"
              >
                🗑️
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Popups */}
      {showGiftPopup && <GiftCardPopup />}
    </main>
  );
      }
