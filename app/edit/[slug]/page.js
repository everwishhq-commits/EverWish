"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const slug = params.slug;
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoError, setVideoError] = useState(false);

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

  // 🎬 Inicializa datos y verifica video
  useEffect(() => {
    const safeSlug = encodeURIComponent(slug);
    setMessage(getMessageForSlug(slug));

    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);

    const videoPath = `/videos/${safeSlug}.mp4`;
    console.log("🎥 Verificando video:", videoPath);

    fetch(videoPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setVideoSrc(videoPath);
          setVideoError(false);
        } else {
          console.warn("⚠️ Video no encontrado:", videoPath);
          setVideoError(true);
        }
      })
      .catch(() => {
        console.error("❌ Error al acceder al video:", videoPath);
        setVideoError(true);
      });
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

  // ⬅ Volver al inicio
  const handleBack = () => {
    router.push("/");
  };

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
          {!videoError ? (
            <video
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div className="absolute flex flex-col items-center text-center text-gray-600 gap-4 px-6">
              <p className="text-lg font-medium">
                ⚠️ Video not found or unavailable.
              </p>
              <button
                onClick={handleBack}
                className="mt-3 px-5 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition"
              >
                ⬅ Back to Home
              </button>
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

      {/* 🎨 Editor principal */}
      {stage === "editor" && (
        <>
          {!videoError && (
            <AnimationOverlay
              key={animKey}
              slug={slug}
              animation={animation}
              intensity={intensity}
              opacityLevel={opacityLevel}
              emojiCount={emojiCount}
            />
          )}

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-6 mb-10"
          >
            {/* 🖼 Video o error */}
            <div
              className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50"
              onClick={handleCardClick}
            >
              {!videoError ? (
                <video
                  src={videoSrc}
                  className="w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-500">
                  ⚠️ Video not found or unavailable.
                  <button
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                  >
                    ⬅ Back to Home
                  </button>
                </div>
              )}
            </div>

            {/* 📝 Mensaje */}
            {!videoError && (
              <>
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </>
            )}

            {/* 📸 Imagen */}
            {!videoError && (
              <>
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
              </>
            )}

            {/* 🛍 Botones principales */}
            {!videoError && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
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
