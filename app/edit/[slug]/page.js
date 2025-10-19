"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");

  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [total, setTotal] = useState(5);
  const [userImage, setUserImage] = useState(null);

  // 🎨 Estados de animación
  const [intensity, setIntensity] = useState("normal");
  const [opacityLevel, setOpacityLevel] = useState(0.9);
  const [emojiCount, setEmojiCount] = useState(20);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  // 🎬 Inicializa datos
  useEffect(() => {
    setMessage(getMessageForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  // ⏳ Pantalla de carga inicial
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

  // 🎁 Gift Card
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

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);
  useEffect(
    () => setAnimKey(Date.now()),
    [animation, category, intensity, opacityLevel, emojiCount]
  );

  return (
    <div
      className="relative min-h-[100dvh] bg-[#fff7f5] flex flex-col items-center overflow-hidden"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* ⏳ Pantalla de carga */}
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
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

      {/* 🎨 Editor principal */}
      {stage === "editor" && (
        <>
          <AnimationOverlay
            key={animKey}
            slug={slug}
            animation={animation}
            intensity={intensity}
            opacityLevel={opacityLevel}
            emojiCount={emojiCount}
          />

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-6 mb-10"
          >
            {/* 🖼 Tarjeta principal */}
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

            {/* 📝 Mensaje */}
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
              ✨ Customize your message ✨
            </h3>
            <textarea
              className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* 📸 Imagen del usuario */}
            {userImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="my-3 cursor-pointer hover:scale-[1.02] transition-transform flex justify-center"
                onClick={() => setShowCrop(true)}
              >
                <img
                  src={userImage}
                  alt="User upload"
                  className="rounded-2xl border border-gray-200 shadow-sm"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    aspectRatio: "4 / 3",
                    backgroundColor: "#fff7f5",
                    maxWidth: "100%",
                  }}
                />
              </motion.div>
            )}

            {!userImage && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowCrop(true)}
                  className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-[#3b2b1f] hover:bg-yellow-300 transition-all shadow-sm"
                >
                  📸 Add Image
                </button>
              </div>
            )}

            {/* ✨ Panel de animación */}
            <div className="my-4">
              <div
                className={`flex items-center justify-between w-full rounded-xl transition-all duration-300 ${
                  animation && !animation.startsWith("✨ None")
                    ? "bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 text-gray-800 shadow-sm"
                    : "bg-gray-100 text-gray-400"
                }`}
                style={{
                  height: "46px",
                  padding: "0 6px 0 6px", // 👈 ligeramente más estrecho
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {/* 🔹 Selector de animaciones */}
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value)}
                  className={`flex-1 text-sm bg-transparent font-medium focus:outline-none cursor-pointer truncate transition ${
                    animation.startsWith("✨ None")
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                  style={{
                    maxWidth: "42%",
                    appearance: "auto",
                  }}
                >
                  {animationOptions
                    .filter((a) => !a.includes("None"))
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>

                {/* 🔸 Controles */}
                {!isPurchased && !isViewed && (
                  <div className="flex items-center gap-2 ml-1">
                    {/* Control cantidad – / + */}
                    <div className="flex items-center rounded-md border border-gray-300 overflow-hidden">
                      <button
                        className="px-2 text-lg hover:bg-gray-200 transition"
                        onClick={() =>
                          setEmojiCount((prev) => Math.max(5, prev - 5))
                        }
                      >
                        –
                      </button>
                      <span className="px-2 text-sm font-medium text-gray-700">
                        {emojiCount}
                      </span>
                      <button
                        className="px-2 text-lg hover:bg-gray-200 transition"
                        onClick={() =>
                          setEmojiCount((prev) => Math.min(60, prev + 5))
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Intensidad */}
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="px-2 text-sm bg-transparent font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="soft">Soft</option>
                      <option value="normal">Normal</option>
                      <option value="vivid">Vivid</option>
                    </select>

                    {/* ❌ Quitar animación */}
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
            </div>

            {/* 🛍 Botones principales */}
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

            {showDownload && (
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleDownload}
                className="fixed bottom-10 right-6 z-[400] rounded-full bg-[#ff7b00] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#ff9f33]"
              >
                ⬇️ Download
              </motion.button>
            )}
          </motion.div>
        </>
      )}

      {/* 🔧 Modales */}
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
