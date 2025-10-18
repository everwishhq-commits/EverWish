"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  AnimationOverlay,
  getAnimationOptionsForSlug,
} from "@/lib/animations";
import { defaultMessageFromSlug } from "@/lib/messages";

import GiftCardModal from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;

  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState(""); // opción activa
  const [animationOptions, setAnimationOptions] = useState([]); // 10 opciones

  const [imageSrc, setImageSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const [showGift, setShowGift] = useState(false);
  const [gift, setGift] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  /* ⚙️ Inicial: mensaje, opciones y video */
  useEffect(() => {
    setMessage(defaultMessageFromSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts[0] || "sparkles"); // entra de una
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  /* 🕒 Pantalla extendida 3s con barra */
  useEffect(() => {
    let value = 0;
    const id = setInterval(() => {
      value += 1;
      setProgress(value);
      if (value >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  /* 📸 Subida de imagen (no se guarda en tu servidor) */
  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result); // data:URL
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fff7f5] overflow-hidden">

      {/* 🟣 Pantalla extendida */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
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

      {/* 🟢 Editor + Overlay */}
      {stage === "editor" && (
        <>
          {/* Overlay SIEMPRE arriba de todo (y toma la opción activa) */}
          {animation && <AnimationOverlay animation={animation} />}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-[500] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-10 mb-12"
          >
            {/* Tarjeta (imagen del slug como base) */}
            <div className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50">
              <div className="relative w-full h-72">
                <Image
                  src={`/${slug}.jpg`}
                  alt="Card"
                  fill
                  className="object-cover"
                  priority
                />
                {/* imagen del usuario encima */}
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt="User image"
                    fill
                    className="object-contain p-6"
                  />
                )}
              </div>
            </div>

            {/* Mensaje (único, desde lib/messages) */}
            <textarea
              className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Dropdown (10 opciones de la categoría del slug) */}
            <div className="my-3">
              <select
                className="w-full rounded-xl border p-3 text-center font-medium text-gray-700 focus:border-pink-400 focus:ring-pink-400"
                value={animation}
                onChange={(e) => setAnimation(e.target.value)} // cambio inmediato
              >
                {animationOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
                <option value="">none</option>
              </select>
            </div>

            {/* Botones */}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <label className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-[#3b2b1f] shadow-sm hover:bg-yellow-300 cursor-pointer">
                📸 Add Image
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
              <button
                onClick={() => setShowGift(true)}
                className="flex items-center gap-2 rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 shadow-sm hover:bg-pink-300"
              >
                🎁 Gift Card
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-purple-600"
              >
                💳 Checkout
              </button>
            </div>
          </motion.div>

          {/* 🔸 Modales */}
          {showCrop && (
            <CropperModal
              open={showCrop}
              src={imageSrc}
              onClose={() => setShowCrop(false)}
              onDone={(dataUrl) => {
                setImageSrc(dataUrl);
                setShowCrop(false);
              }}
            />
          )}
          {showGift && (
            <GiftCardModal
              open={showGift}
              onClose={() => setShowGift(false)}
              onSelect={(g) => {
                // permitir buscar/quitar desde el modal de gift
                setGift(g);
                setShowGift(false);
              }}
            />
          )}
          {showCheckout && (
            <CheckoutModal
              open={showCheckout}
              onClose={() => setShowCheckout(false)}
              gift={gift}
            />
          )}
        </>
      )}
    </div>
  );
                }
