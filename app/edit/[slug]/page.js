"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 💌 Mensaje automático según slug
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

// 🎇 Conjunto de animaciones según categoría
function getAnimationsForSlug(slug) {
  const s = slug.toLowerCase();
  if (/christmas|navidad/.test(s))
    return ["🎄 Snow Glow", "🎁 Santa Spark", "✨ Twinkle Lights", "❄️ Snowfall", "🕯️ Candle Light", "🎅 Gift Pop", "🌟 Star Shine", "💫 Magic Dust", "🧦 Cozy Socks", "🔔 Jingle Bells"];
  if (/halloween/.test(s))
    return ["🎃 Pumpkin Glow", "👻 Ghost Drift", "🕸️ Web Fall", "🧙‍♀️ Witch Dust", "🦇 Bat Flight", "🪄 Spark Potion", "💀 Skull Flicker", "🕯️ Candle Mist", "🌕 Moonlight Fade", "🍬 Candy Rain"];
  if (/thanksgiving/.test(s))
    return ["🦃 Turkey Glow", "🍂 Leaf Drift", "🍁 Fall Wind", "🕯️ Warm Light", "🥧 Pie Puff", "🌻 Harvest Bloom", "🍗 Feast Fade", "🌾 Grain Wave", "🍃 Gentle Breeze", "🔥 Hearth Flicker"];
  if (/birthday/.test(s))
    return ["🎉 Confetti Burst", "🎂 Cake Spark", "🎈 Balloon Rise", "✨ Glitter Pop", "🎊 Party Stream", "💝 Ribbon Glow", "🌈 Color Rain", "🎁 Gift Slide", "🪩 Disco Spin", "🥳 Smile Twirl"];
  if (/love|valentine/.test(s))
    return ["💖 Floating Hearts", "💘 Cupid Spark", "💞 Pink Glow", "🌹 Rose Fall", "💋 Kiss Burst", "✨ Soft Sparkle", "🌸 Bloom Fade", "💕 Heart Trail", "💫 Romantic Dust", "🕯️ Candle Flicker"];
  if (/condolence|loss|memory|funeral/.test(s))
    return ["🕊️ Dove Flight", "🌿 Leaf Drift", "🌧️ Soft Rain", "💫 Gentle Light", "🌸 Petal Fall", "✨ Peace Glow", "🌙 Moon Fade", "🪶 Feather Drift", "🕯️ Candle Calm", "🌾 Serenity Wave"];
  if (/independence|july|usa/.test(s))
    return ["🇺🇸 Flag Wave", "🎆 Firework Burst", "✨ Star Spark", "🗽 Liberty Glow", "🎇 Light Rain", "🔥 Spark Trail", "💫 Freedom Beam", "🎉 RedWhiteBlue", "🌟 Sky Flash", "🦅 Eagle Sweep"];
  if (/easter|bunny/.test(s))
    return ["🐰 Hop Trail", "🌸 Flower Bloom", "🌼 Petal Pop", "🥚 Egg Jump", "🌷 Spring Glow", "✨ Gentle Sparkle", "☀️ Morning Shine", "🕊️ Dove Peace", "💐 Joy Spread", "🍃 Fresh Air"];
  if (/newyear|year/.test(s))
    return ["🎆 Fireworks", "✨ Glitter Burst", "🎇 Star Rain", "🌟 Spark Trail", "🎉 Pop Stream", "🍾 Champagne Rise", "💫 Midnight Glow", "🕛 Clock Flash", "🎊 Joy Burst", "🌈 New Dawn"];
  return ["✨ Sparkles", "🎉 Confetti", "💖 Hearts", "🌸 Bloom", "🌟 Shine", "🕊️ Peace", "🌈 Glow", "💫 Dust", "🎇 Light", "❌ None"];
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const CARD_PRICE = 5;

  // 🔹 Pantalla inicial con barra de progreso
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));
        setAnimOptions(getAnimationsForSlug(slug));
        setAnim(getAnimationsForSlug(slug)[0]); // animación inicial

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

  // ✨ Render animación seleccionada
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
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {emoji}
      </motion.span>
    ));
  };

  // 🖼️ Pantalla inicial
  if (!showEdit)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
        </div>
        {item?.src ? (
          item.src.endsWith(".mp4") ? (
            <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-full object-cover" />
          )
        ) : null}
      </div>
    );

  // 🌸 Edición
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* Animación activa */}
      <div className="absolute inset-0 pointer-events-none">{renderEffect()}</div>

      <div className="relative z-20">
        {/* Imagen o video */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item?.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        {/* Mensaje + animaciones + botones */}
        <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
          />

          {/* Dropdown dinámico */}
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
              onClick={() => setShowCheckout(true)}
              className="w-[48%] bg-[#b89cff] hover:bg-[#9c7ff9] text-white font-semibold py-3 rounded-full transition"
            >
              Checkout 💜
            </button>
          </div>
        </section>
      </div>
    </main>
  );
            }
