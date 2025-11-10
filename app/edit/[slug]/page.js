"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";
import GiftCardPopup from "@/components/giftcard";
import CheckoutModal from "@/components/checkout";
import CropperModal from "@/components/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;

  // estados base
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFound, setVideoFound] = useState(true);

  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [gift, setGift] = useState(null);
  const [total, setTotal] = useState(5);
  const [userImage, setUserImage] = useState(null);

  const [intensity, setIntensity] = useState("normal");
  const [emojiCount, setEmojiCount] = useState(20);

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);

  // 1) cargar video + config
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const videos = data.videos || data || [];

        let match = videos.find((v) => v.name === slug);
        if (!match) match = videos.find((v) => v.slug === slug);

        if (match) {
          setVideoSrc(match.file);
          setVideoFound(true);
        } else {
          setVideoSrc(`/videos/${slug}.mp4`);
          setVideoFound(false);
        }
      } catch (err) {
        console.error("❌ Error cargando video:", err);
        setVideoSrc(`/videos/${slug}.mp4`);
        setVideoFound(false);
      }
    }

    loadVideo();
    setMessage(getMessageForSlug(slug));

    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
  }, [slug]);

  // 2) pantalla de carga
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  // 3) refrescar overlay cuando cambie algo
  useEffect(() => {
    setAnimKey(Date.now());
  }, [animation, category, intensity, emojiCount]);

  // 4) bloquear clic derecho global
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  const handleCardClick = () => {
    // No mostrar alert, solo prevenir descarga silenciosamente
  };

  // gift
  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  // Panel de animación reutilizable
  const AnimationPanel = () => (
    <div
      className={`flex items-center justify-between w-full rounded-xl ${
        animation && !animation.startsWith("✨ None")
          ? "bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 text-gray-800 shadow-sm"
          : "bg-gray-100 text-gray-400"
      }`}
      style={{ height: "44px", padding: "0 10px" }}
    >
      {/* selector */}
      <select
        value={animation}
        onChange={(e) => setAnimation(e.target.value)}
        className="flex-1 text-xs font-medium bg-transparent focus:outline-none cursor-pointer truncate"
      >
        {animationOptions
          .filter((a) => !a.includes("None"))
          .map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
      </select>

      {/* controles */}
      <div className="flex items-center gap-2 ml-2">
        <div className="flex items-center rounded-md border border-gray-300 overflow-hidden">
          <button
            className="px-2 text-base"
            onClick={() => setEmojiCount((prev) => Math.max(5, prev - 5))}
          >
            –
          </button>
          <span className="px-2 text-xs font-medium text-gray-700">
            {emojiCount}
          </span>
          <button
            className="px-2 text-base"
            onClick={() => setEmojiCount((prev) => Math.min(60, prev + 5))}
          >
            +
          </button>
        </div>

        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="px-2 text-xs bg-transparent font-medium focus:outline-none cursor-pointer"
        >
          <option value="soft">Soft</option>
          <option value="normal">Normal</option>
          <option value="vivid">Vivid</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="relative h-[100vh] max-h-[100vh] bg-[#fff7f5] flex items-center justify-center overflow-hidden">
      {/* pantalla de carga */}
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
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-lg">Video not found: {slug}</p>
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

      {stage === "editor" && (
        <>
          {/* capa de emojis */}
          <AnimationOverlay
            key={animKey}
            slug={slug}
            animation={animation}
            intensity={intensity}
            opacityLevel={0.9}
            emojiCount={emojiCount}
          />

          {/* LAYOUT CON FOTO */}
          {userImage ? (
            <div className="relative z-[200] w-full max-w-md min-h-[100vh] px-3 pt-4 pb-20 flex flex-col gap-2 overflow-y-auto">
              {/* 1. VIDEO - optimizado para verse completo */}
              <div
                className="relative rounded-2xl border bg-gray-50 overflow-hidden cursor-pointer select-none flex-shrink-0"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "36vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onError={() => setVideoFound(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="text-5xl mb-3">⚠️</div>
                    <p className="text-xs text-center px-4 mb-2 font-semibold">
                      This card&apos;s video is missing
                    </p>
                  </div>
                )}
              </div>

              {/* 2. MENSAJE - compacto */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <h3 className="text-center text-xs font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-xl border p-2 text-center text-xs text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400 resize-none"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* 3. FOTO GRANDE - botones flotantes encima */}
              <div className="relative flex-shrink-0" style={{ height: "36vh" }}>
                <div
                  className="absolute inset-0 rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-[#fff7f5] cursor-pointer"
                  onClick={() => setShowCrop(true)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={userImage}
                    alt="user"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>

                {/* BOTONES FLOTANTES ENCIMA DE LA FOTO */}
                <div className="absolute bottom-3 left-0 right-0 px-3 z-10">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGift(true);
                      }}
                      className="flex-1 rounded-full bg-pink-200/95 backdrop-blur-sm py-2.5 text-sm font-semibold text-pink-700 shadow-lg"
                    >
                      🎁 Gift Card
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCheckout(true);
                      }}
                      className="flex-1 rounded-full bg-purple-500/95 backdrop-blur-sm py-2.5 text-sm font-semibold text-white shadow-lg"
                    >
                      💳 Checkout
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. PANEL DE ANIMACIÓN - DEBAJO (requiere scroll para ver) */}
              <div className="flex-shrink-0 mt-1">
                <AnimationPanel />
              </div>
            </div>
          ) : (
            /* LAYOUT SIN FOTO - todo más espaciado y proporcional */
            <div className="relative z-[200] w-full max-w-md h-[100vh] max-h-[100vh] px-3 py-6 flex flex-col gap-4">
              {/* 1. VIDEO - más grande y centrado */}
              <div
                className="relative rounded-2xl border bg-gray-50 overflow-hidden cursor-pointer select-none"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "48vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onError={() => setVideoFound(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="text-5xl mb-3">⚠️</div>
                    <p className="text-xs text-center px-4 mb-2 font-semibold">
                      This card&apos;s video is missing or not uploaded yet.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. MENSAJE - más alto */}
              <div className="flex flex-col gap-2">
                <h3 className="text-center text-sm font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-2xl border p-4 text-center text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* 3. BOTÓN ADD IMAGE - centrado */}
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={() => setShowCrop(true)}
                  className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-[#3b2b1f] hover:bg-yellow-300 transition-all shadow-md"
                >
                  📸 Add Image
                </button>
              </div>

              {/* 4. PANEL DE ANIMACIÓN */}
              <AnimationPanel />

              {/* 5. BOTONES FLOTANTES */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => setShowGift(true)}
                  className="flex-1 rounded-full bg-pink-200 py-2.5 text-sm font-semibold text-pink-700"
                >
                  🎁 Gift Card
                </button>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="flex-1 rounded-full bg-purple-500 py-2.5 text-sm font-semibold text-white"
                >
                  💳 Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODALES */}
      <div className="fixed inset-0 pointer-events-none z-[10050]">
        {showGift && (
          <div className="pointer-events-auto relative">
            <GiftCardPopup
              initial={gift}
              onSelect={updateGift}
              onClose={() => setShowGift(false)}
            />
          </div>
        )}
        {showCheckout && (
          <div className="pointer-events-auto relative">
            <CheckoutModal
              total={total}
              gift={gift}
              onGiftChange={() => setShowGift(true)}
              onGiftRemove={removeGift}
              onClose={() => setShowCheckout(false)}
            />
          </div>
        )}
        {showCrop && (
          <div className="pointer-events-auto relative">
            <CropperModal
              open={showCrop}
              existingImage={userImage}
              onClose={() => setShowCrop(false)}
              onDelete={() => {
                setUserImage(null);
                setShowCrop(false);
              }}
              onDone={(img) => {
                setUserImage(img);
                setShowCrop(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
                  }
