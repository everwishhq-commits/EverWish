"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const PREVIEW_TIME = 4; // ⏱️ duración en segundos

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

        // Barra de progreso animada manual
        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 0.1;
          setProgress((elapsed / PREVIEW_TIME) * 100);
          if (elapsed >= PREVIEW_TIME) {
            clearInterval(interval);
            endFullscreen();
          }
        }, 100);

        const endFullscreen = async () => {
          if (document.fullscreenElement) await document.exitFullscreen();
          setShowEdit(true);
        };
      } catch (e) {
        console.error("Error loading video:", e);
        setShowEdit(true);
      }
    })();
  }, [slug]);

  // ✨ animaciones globales (al frente)
  const renderEffect = () =>
    Array.from({ length: 15 }).map((_, i) => (
      <motion.span
        key={i}
        className="fixed text-xl z-[9999] pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          y: [0, -100],
          x: [0, Math.random() * 120 - 60],
          scale: [0.8, 1.2, 0],
        }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
        style={{
          color: anim === "hearts" ? "#ff70a6" : "#ffd700",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
      >
        {anim === "hearts" ? "💖" : "✨"}
      </motion.span>
    ));

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff8f5] text-gray-500">
        Loading Everwish card...
      </div>
    );
  }

  // 🌈 Pantalla de vista previa con barra de progreso
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black relative overflow-hidden">
        {item.src?.endsWith(".mp4") ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setLoading(false)}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <img
            src={item.src}
            alt={slug}
            onLoad={() => setLoading(false)}
            className="w-full h-full object-cover absolute inset-0"
          />
        )}

        {/* 🌸 Texto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: PREVIEW_TIME }}
          className="absolute bottom-16 text-white text-sm font-light tracking-wide"
        >
          {loading ? "Loading your card..." : "Previewing your card... ✨"}
        </motion.p>

        {/* Barra de progreso */}
        <div className="absolute bottom-10 w-3/4 h-2 rounded-full overflow-hidden bg-white/20 backdrop-blur-md">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300"
          />
        </div>
      </div>
    );
  }

  // ✨ Editor principal
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {renderEffect()}
      <div className="relative z-20">
        <div className="w-full rounded-3xl shadow-md overflow-hidden bg-white">
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
            <option value="sparkles">✨ Sparkles</option>
            <option value="hearts">💖 Hearts</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              className="w-[48%] rounded-full py-3 font-semibold text-[#3b2b1f]"
              style={{ backgroundColor: "#FFD966" }}
            >
              🎁 Choose Gift Card
            </button>
            <button
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
