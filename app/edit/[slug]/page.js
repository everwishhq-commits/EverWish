"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🎃 Auto message generator
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
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [amount, setAmount] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 🔹 Load videos & giftcards
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        const gifts = await fetch("/videos/giftcards.json");
        const giftList = await gifts.json();
        setGiftCards(giftList);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    })();
  }, [slug]);

  // 🔹 Fullscreen 3 seconds, then show editor
  useEffect(() => {
    const goFull = async () => {
      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } catch {}
    };
    goFull();
    setTimeout(async () => {
      if (document.fullscreenElement) await document.exitFullscreen();
      setShowEdit(true);
    }, 3000);
  }, []);

  const renderEffect = () => {
    if (anim === "hearts")
      return Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-pink-400 text-2xl"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -100],
            x: [0, Math.random() * 80 - 40],
            scale: [0.8, 1.2, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          💖
        </motion.span>
      ));
    return null;
  };

  if (!item) return null;

  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.toLowerCase().endsWith(".mp4") ? (
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
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        {renderEffect()}
      </div>

      <div className="relative z-10">
        {/* Imagen o video */}
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.toLowerCase().endsWith(".mp4") ? (
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

        {/* Caja principal */}
        <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">{renderEffect()}</div>

          <h2 className="text-xl font-semibold text-center mb-4 relative z-10">
            Customize your message ✨
          </h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400 relative z-10"
          />

          {/* Giftcard selector */}
          <button
            onClick={() => setShowGiftModal(true)}
            className="w-full mt-4 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 transition relative z-10"
          >
            🎁 Choose Gift Card
          </button>

          {/* Info de emisor y receptor */}
          <div className="mt-5">
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your name"
              className="w-full mb-3 rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
            />
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Recipient name"
              className="w-full mb-3 rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email"
              className="w-full mb-3 rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Recipient phone"
              className="w-full mb-3 rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition relative z-10"
          >
            Checkout 💌
          </motion.button>
        </section>
      </div>

      {/* 🪄 Modal Gift Cards */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-11/12 max-w-md relative">
            <h3 className="text-xl font-bold text-center mb-4">Select a Gift Card 🎁</h3>

            <select
              value={selectedGift?.name || ""}
              onChange={(e) =>
                setSelectedGift(giftCards.find((g) => g.name === e.target.value))
              }
              className="w-full mb-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Choose a brand</option>
              {giftCards.map((g, i) => (
                <option key={i} value={g.name}>
                  {g.category} - {g.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mb-4 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400"
            />

            {selectedGift && (
              <div className="flex justify-center mb-4">
                <img
                  src={selectedGift.image}
                  alt={selectedGift.name}
                  className="w-24 h-16 object-contain"
                />
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowGiftModal(false)}
                className="rounded-full bg-gray-300 text-gray-700 px-6 py-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowGiftModal(false)}
                className="rounded-full bg-pink-500 text-white px-6 py-2 font-semibold"
              >
                Add 💝
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
