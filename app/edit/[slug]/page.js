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

/* ---------- Catálogo de animaciones ---------- */
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
  if (cats.length === 0)
    return ["✨ Sparkles","🎉 Confetti","💖 Hearts","🌸 Bloom","🌟 Shine","🕊️ Peace","🌈 Glow","💫 Dust","🎇 Light","❌ None"];
  const bag = [];
  for (const c of cats) bag.push(...(ANIMS[c] || []));
  return Array.from(new Set(bag)).slice(0, 10);
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const CARD_PRICE = 5;
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftSelection, setGiftSelection] = useState({ brand: "", amount: 0 });
  const [showCheckout, setShowCheckout] = useState(false);

  /* --- Cargar video y animaciones --- */
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

  /* --- Pantalla extendida con soporte horizontal --- */
  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      timer = setTimeout(() => setShowEdit(true), 3000);
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  if (!item) return null;

  // 🔹 Pantalla extendida sin tabs, responsive vertical/horizontal
  if (!showEdit) {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center overflow-hidden bg-black"
        style={{
          height: "100dvh", // usa viewport dinámico, elimina barras en móviles
          width: "100vw",
        }}
      >
        {item.src?.endsWith(".mp4") ? (
          <>
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                aspectRatio: "auto",
                objectFit: "cover",
                WebkitUserSelect: "none",
                userSelect: "none",
                touchAction: "none",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <img
            src={item.src}
            alt={slug}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectFit: "cover", aspectRatio: "auto" }}
          />
        )}
      </div>
    );
  }

  /* --- Editor --- */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="relative z-20">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
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
            {animOptions.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
            <option value="❌ None">❌ None</option>
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
              onClick={async () => {
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
                  else alert(data?.error || "Checkout not available.");
                } catch {
                  alert("Error starting checkout.");
                }
              }}
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
