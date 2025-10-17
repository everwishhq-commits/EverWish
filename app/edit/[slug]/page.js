// /app/edit/[slug]/page.js
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedOverlay from "@/lib/animations";
import GiftCardModal from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";
import messages from "@/lib/messages";

export default function EditPage({ params }) {
  const slug = params.slug || "everwish-general";

  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("pumpkins");
  const [animationActive, setAnimationActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [videoSrc, setVideoSrc] = useState(`/videos/${slug}.mp4`);

  /* 🟣 Mensaje inicial y animación inmediata */
  useEffect(() => {
    const cat = slug.includes("ghost")
      ? "ghosts"
      : slug.includes("pumpkin")
      ? "pumpkins"
      : slug.includes("paw")
      ? "paws"
      : slug.includes("heart")
      ? "hearts"
      : "pumpkins";
    setCategory(cat);

    const list = messages[cat] || messages["pumpkins"];
    setMessage(list[0] || "Celebrate this special moment with Everwish. ✨");
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  /* 🕒 Pantalla extendida con barra */
  useEffect(() => {
    let value = 0;
    const timer = setInterval(() => {
      value += 1;
      setProgress(value);
      if (value >= 100) {
        clearInterval(timer);
        setStage("editor");
        setTimeout(() => setAnimationActive(true), 200); // 👈 activar animación inmediato
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setShowCrop(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#fff7f5] overflow-hidden">
      {/* 🟣 Pantalla extendida */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-8 w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.03, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {/* 🟢 Editor */}
      {stage === "editor" && (
        <>
          {/* ✨ Animación arriba del contenedor */}
          {animationActive && (
            <div className="absolute inset-0 z-[120] pointer-events-none">
              <AnimatedOverlay category={category} active />
            </div>
          )}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
          >
            <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
              <video
                src={videoSrc}
                className="w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            <textarea
              className="w-full text-center border rounded-2xl p-3 text-gray-700 mb-3 focus:ring-pink-400 focus:border-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {photo && (
              <img
                src={photo}
                alt="Uploaded"
                className="rounded-xl mx-auto mb-3"
                style={{ maxHeight: "150px", objectFit: "cover" }}
              />
            )}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl p-2 text-center mb-3"
            >
              <option value="pumpkins">🎃 Pumpkins</option>
              <option value="ghosts">👻 Ghosts</option>
              <option value="paws">🐾 Paws</option>
              <option value="hearts">💖 Hearts</option>
            </select>

            <div className="flex justify-center gap-3">
              <label className="bg-yellow-400 text-[#3b2b1f] font-semibold rounded-xl px-4 py-2 cursor-pointer">
                📸 Add Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowGift(true)}
                className="bg-pink-200 text-pink-700 font-semibold rounded-xl px-4 py-2 hover:bg-pink-300"
              >
                🎁 Gift Card
              </button>

              <button
                onClick={() => setShowCheckout(true)}
                className="bg-purple-600 text-white font-semibold rounded-xl px-4 py-2 hover:bg-purple-700"
              >
                💳 Checkout
              </button>
            </div>
          </motion.div>

          {showCrop && (
            <CropperModal
              imageSrc={photo}
              onSave={(url) => {
                setPhoto(url);
                setShowCrop(false);
              }}
              onCancel={() => setShowCrop(false)}
            />
          )}

          {showGift && (
            <GiftCardModal
              onClose={() => setShowGift(false)}
              onSelect={(cards) => {
                setGiftCards(cards.map((name) => ({ name, amount: 50 })));
                setShowGift(false);
              }}
            />
          )}

          {showCheckout && (
            <CheckoutModal
              giftCards={giftCards}
              onClose={() => setShowCheckout(false)}
              onConfirm={(plan) => {
                console.log("Plan:", plan);
                setShowCheckout(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
                }
