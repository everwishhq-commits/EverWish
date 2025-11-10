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

  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFound, setVideoFound] = useState(true);

  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [total, setTotal] = useState(5);
  const [userImage, setUserImage] = useState(null);

  const [intensity, setIntensity] = useState("normal");
  const [emojiCount, setEmojiCount] = useState(20);
  const [isPurchased] = useState(false);
  const [isViewed] = useState(false);

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);

  // cargar video y opciones
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

  // loading
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

  // re-render anim
  useEffect(() => {
    setAnimKey(Date.now());
  }, [animation, category, intensity, emojiCount]);

  // bloquear descarga
  const handleCardClick = () => {
    alert("🔒 This card is protected. Purchase to download!");
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

  // bloquear clic derecho
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  return (
    <div className="h-[100vh] max-h-[100vh] bg-[#fff7f5] flex items-center justify-center">
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
          {/* capa de animación */}
          <AnimationOverlay
            key={animKey}
            slug={slug}
            animation={animation}
            intensity={intensity}
            opacityLevel={0.9}
            emojiCount={emojiCount}
          />

          {/* CARD */}
          <div className="relative z-[200] w-full max-w-md h-[100vh] max-h-[100vh] px-3 flex flex-col gap-3">
            {/* 1. VIDEO (45% de la pantalla) */}
            <div
              className="relative rounded-2xl border bg-gray-50 overflow-hidden cursor-pointer select-none"
              onClick={handleCardClick}
              onContextMenu={(e) => e.preventDefault()}
              style={{ height: "45vh" }}
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
                  <p className="text-xs text-gray-500 px-3 text-center">
                    Looking for:{" "}
                    <code className="bg-white px-2 py-1 rounded text-xs">
                      {slug}
                    </code>
                  </p>
                </div>
              )}

              {videoFound && (
                <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold pointer-events-none">
                  🔒 interno
                </div>
              )}
            </div>

            {/* 2. MENSAJE (auto, pero poco alto) */}
            <div className="flex flex-col gap-2">
              <h3 className="text-center text-sm font-semibold text-gray-700">
                ✨ Customize your message ✨
              </h3>
              <textarea
                className="w-full rounded-2xl border p-3 text-center text-sm text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            {/* 3. FOTO (30% de la pantalla) */}
            <div className="flex-1">
              {userImage ? (
                <div
                  className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-[#fff7f5] h-[30vh]"
                  onClick={() => setShowCrop(true)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={userImage}
                    alt="user"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              ) : (
                <div className="h-[30vh] flex items-center justify-center">
                  <button
                    onClick={() => setShowCrop(true)}
                    className="flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-[#3b2b1f] hover:bg-yellow-300 transition-all shadow-sm"
                  >
                    📸 Add Image
                  </button>
                </div>
              )}
            </div>

            {/* 4. CONTROLES + BOTONES (barra baja, altura fija) */}
            <div className="pb-1">
              {/* animación */}
              <div
                className={`flex items-center justify-between w-full rounded-xl transition-all duration-300 mb-2 ${
                  animation && !animation.startsWith("✨ None")
                    ? "bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 text-gray-800 shadow-sm"
                    : "bg-gray-100 text-gray-400"
                }`}
                style={{ height: "42px", padding: "0 8px" }}
              >
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value)}
                  className="flex-1 text-xs font-medium focus:outline-none cursor-pointer truncate bg-transparent"
                >
                  {animationOptions
                    .filter((a) => !a.includes("None"))
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>

                {!isPurchased && !isViewed && (
                  <div className="flex items-center gap-2 ml-1">
                    <div className="flex items-center rounded-md border border-gray-300 overflow-hidden">
                      <button
                        className="px-2 text-base hover:bg-gray-200 transition"
                        onClick={() =>
                          setEmojiCount((prev) => Math.max(5, prev - 5))
                        }
                      >
                        –
                      </button>
                      <span className="px-2 text-xs font-medium text-gray-700">
                        {emojiCount}
                      </span>
                      <button
                        className="px-2 text-base hover:bg-gray-200 transition"
                        onClick={() =>
                          setEmojiCount((prev) => Math.min(60, prev + 5))
                        }
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

                    <button
                      className={`ml-1 px-2 text-lg font-bold transition ${
                        animation && !animation.startsWith("✨ None")
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400"
                      }`}
                      onClick={() => setAnimation("✨ None (No Animation)")}
                      title="Remove animation"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* botones */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowGift(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-pink-200 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-300 transition-all shadow-sm"
                >
                  🎁 Gift Card
                </button>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-purple-500 py-2 text-sm font-semibold text-white hover:bg-purple-600 transition-all shadow-sm"
                >
                  💳 Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* modales */}
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
