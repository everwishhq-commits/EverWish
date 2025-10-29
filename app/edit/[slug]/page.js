"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";

// ✅ Corrige los imports con nombres exactos
import GiftCardPopup from "@/components/GiftCard";
import CheckoutModal from "@/components/Checkout";
import CropperModal from "@/components/CropperModal";

export default function EditPage({ params }) {
  const slug = params.slug;

  // 🎬 Estados principales
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFound, setVideoFound] = useState(true);

  // 🎁 Modales y regalos
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [total, setTotal] = useState(5);
  const [userImage, setUserImage] = useState(null);

  // 🌈 Configuración de animación
  const [intensity, setIntensity] = useState("normal");
  const [opacityLevel, setOpacityLevel] = useState(0.9);
  const [emojiCount, setEmojiCount] = useState(20);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);

  // 🧭 Verificación y caché cada 24 h
  useEffect(() => {
    const lastCheck = localStorage.getItem("everwish_videos_lastCheck");
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    if (!lastCheck || now - parseInt(lastCheck, 10) > day) {
      localStorage.setItem("everwish_videos_lastCheck", now.toString());
      fetch("/api/cards?refresh=" + now)
        .then((r) => r.json())
        .then((data) => {
          localStorage.setItem("everwish_videos_cache", JSON.stringify(data));
        })
        .catch((e) => console.warn("⚠️ No se pudo actualizar videos:", e));
    }
  }, []);

  // 🎥 Carga video principal
  useEffect(() => {
    async function loadVideo() {
      try {
        const cached = localStorage.getItem("everwish_videos_cache");
        let data = cached ? JSON.parse(cached) : null;

        if (!data) {
          const res = await fetch("/api/cards");
          data = await res.json();
          localStorage.setItem("everwish_videos_cache", JSON.stringify(data));
        }

        const list = Array.isArray(data.videos)
          ? data.videos
          : Array.isArray(data)
          ? data
          : [];

        const match = list.find(
          (v) =>
            v.slug === slug ||
            v.object === slug ||
            v.src?.includes(slug)
        );

        if (match) {
          setVideoSrc(match.src);
          setVideoFound(true);
        } else {
          setVideoSrc(`/cards/${slug}.mp4`);
          setVideoFound(false);
        }
      } catch (err) {
        console.error("❌ Error loading video:", err);
        setVideoSrc(`/cards/${slug}.mp4`);
        setVideoFound(false);
      }
    }

    loadVideo();
    setMessage(getMessageForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
  }, [slug]);

  // ⏳ Pantalla de carga
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 25);
    return () => clearInterval(id);
  }, []);

  // 🧩 Sincroniza animaciones dinámicamente
  useEffect(
    () => setAnimKey(Date.now()),
    [animation, category, intensity, opacityLevel, emojiCount]
  );

  // 🎁 Funciones de regalo
  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  // 💾 Descarga
  const handleCardClick = () => {
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3500);
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = `${slug}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // 🧠 Render principal
  return (
    <div
      className="relative min-h-[100dvh] bg-[#fff7f5] flex flex-col items-center overflow-hidden"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 🕓 Pantalla de carga */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {videoFound ? (
            <video
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div className="text-gray-500 text-center">
              ⚠️ Video not found: {slug}.mp4
            </div>
          )}
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

      {/* 🎨 Editor */}
      {stage === "editor" && (
        <>
          {!videoFound ? (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
              <p className="text-gray-500 text-lg mb-4">
                ⚠️ Sorry, this video could not be found or isn’t uploaded yet.
              </p>
              <Link
                href="/"
                className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-all"
              >
                ⬅ Back to Everwish
              </Link>
            </div>
          ) : (
            <>
              <AnimationOverlay
                key={animKey}
                slug={slug}
                animation={animation}
                intensity={intensity}
                opacityLevel={opacityLevel}
                emojiCount={emojiCount}
              />

              {/* 💌 Editor principal */}
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-6 mb-10"
              >
                <div
                  className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50"
                  onClick={handleCardClick}
                >
                  <video
                    src={videoSrc}
                    className="w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Botones */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowGift(true)}
                    className="flex items-center gap-2 rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 hover:bg-pink-300 transition-all shadow-sm"
                  >
                    🎁 Gift Card
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-600 transition-all shadow-sm"
                  >
                    💳 Checkout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
                }
