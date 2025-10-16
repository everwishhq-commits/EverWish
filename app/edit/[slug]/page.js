"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { defaultMessageFromSlug } from "@/lib/messages";
import { getAnimationsForSlug, AnimationOverlay } from "@/lib/animations";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug || "";
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animations, setAnimations] = useState([]);
  const [headerTitle, setHeaderTitle] = useState("");
  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [total, setTotal] = useState(5);

  /* 🔹 Configuración inicial automática */
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const anims = getAnimationsForSlug(slug);
    setAnimations(anims);

    // 🔸 Detectar el set por slug
    if (slug.includes("easter")) setHeaderTitle("🐰 Easter Animations");
    else if (slug.includes("usa") || slug.includes("4th")) setHeaderTitle("🎆 4th of July Animations");
    else if (slug.includes("pet") || slug.includes("dog") || slug.includes("cat"))
      setHeaderTitle("🐾 Pet Day Animations");
    else if (slug.includes("ghost") || slug.includes("halloween"))
      setHeaderTitle("🎃 Halloween Animations");
    else if (slug.includes("christmas")) setHeaderTitle("🎄 Christmas Animations");
    else if (slug.includes("valentine")) setHeaderTitle("💖 Valentine Animations");
    else setHeaderTitle("✨ Everwish Effects");

    // 🔸 Activar automáticamente la primera animación
    if (anims.length > 0) {
      setAnimation(anims[0]);
    }

    // 🔸 Cargar video
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  /* 🔹 Iniciar barra de carga */
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  /* 🔹 GiftCard y total */
  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  /* 🔹 Descargar video */
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = `${slug}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  /* 🔹 Mostrar botón de descarga 3.5s */
  const handleCardClick = () => {
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3500);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden min-h-[100dvh]">
      {/* 🟣 Pantalla extendida */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
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

      {/* 🟢 Editor principal */}
      {stage === "editor" && (
        <>
          {/* ✨ Animación activa automática */}
          {animation && <AnimationOverlay slug={slug} animation={animation} />}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-10"
          >
            {/* 🎬 Video principal */}
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

            {/* 🏷️ Header con categoría */}
            <h3 className="text-center text-sm font-semibold text-pink-500 mb-2">
              {headerTitle}
            </h3>

            {/* 📝
