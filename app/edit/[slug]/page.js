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
  const [userImage, setUserImage] = useState(null);
  const [total, setTotal] = useState(5);

  // 🎨 Animación personalizada
  const [intensity, setIntensity] = useState("normal");
  const [opacityLevel, setOpacityLevel] = useState(0.9);
  const [emojiCount, setEmojiCount] = useState(20);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  // 🎬 Inicialización
  useEffect(() => {
    setMessage(getMessageForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
    setVideoSrc(`/videos/${slug}.mp4`);
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

  // 💳 Gift Card
  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  // 🚫 Bloqueos táctiles / descargas
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("touchstart", prevent, { passive: false });
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("touchstart", prevent);
      document.removeEventListener("touchmove", prevent);
    };
  }, []);

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => setAnimKey(Date.now()), [
    animation,
    category,
    intensity,
    opacityLevel,
    emojiCount,
  ]);

  return (
    <div
      className="fixed inset-0 bg-[#fff7f5] flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: "100dvh",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      {/* ⏳ Splash inicial */}
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
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
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

      {/* ✨ Editor principal */}
      {stage === "editor" && (
        <>
          {/* 🌈 Capa de animaciones */}
          <AnimationOverlay
            key={animKey}
            slug={slug}
            animation={animation}
            intensity={intensity}
            opacityLevel={opacityLevel}
            emojiCount={emojiCount}
          />

          <div className="relative z-[200] w-full h-full flex flex-col items-center justify-center px-4">
            {/* 🖼 Video principal */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[8%] overflow-hidden border shadow-lg">
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
              {/* 🛑 Capa invisible anti-click derecho */}
              <div
                className="absolute inset-0 z-[50]"
                onContextMenu={(e) => e.preventDefault()}
              ></div>
            </div>

            {/* 📝 Mensaje */}
            <div className="mt-6 text-center max-w-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                ✨ Customize your message ✨
              </h3>
              <textarea
                className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

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

            {/* 🎁 Botones */}
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
          </div>
        </>
      )}

      {/* 🔧 Modales */}
      {showGift && (
        <GiftCardPopup
          initial={gift}
          onSelect={updateGift}
          onClose={() => setShowGift(false)}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          total={total}
          gift={gift}
          onGiftChange={() => setShowGift(true)}
          onGiftRemove={removeGift}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {showCrop && (
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
      )}
    </div>
  );
              }
