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

  const [intensity, setIntensity] = useState("normal");
  const [opacityLevel, setOpacityLevel] = useState(0.9);
  const [emojiCount, setEmojiCount] = useState(20);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    setMessage(getMessageForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  useEffect(() => {
    let val = 0;
    const id = setInterval(() => {
      val += 1;
      setProgress(val);
      if (val >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
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
      style={{ height: "100dvh", overscrollBehavior: "none" }}
    >
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

          <div className="relative z-[200] w-full h-full flex flex-col items-center justify-center px-4">
            {/* 🖼 VIDEO */}
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
                className="w-full h-full object-cover"
              />
            </div>

            {/* ✍️ MENSAJE */}
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

            {/* 📸 IMAGEN */}
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

            {/* ✨ ANIMACIÓN */}
            <div className="my-4 w-full max-w-[480px] flex items-center justify-between rounded-xl bg-gradient-to-r from-pink-50 to-yellow-50 shadow-sm px-3 py-2 border border-pink-100">
              <select
                value={animation}
                onChange={(e) => setAnimation(e.target.value)}
                className="flex-1 bg-transparent text-gray-700 font-medium focus:outline-none"
              >
                {animationOptions
                  .filter((a) => !a.includes("None"))
                  .map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmojiCount((p) => Math.max(5, p - 5))}
                  className="px-2 text-lg hover:text-pink-600"
                >
                  –
                </button>
                <span className="text-gray-700">{emojiCount}</span>
                <button
                  onClick={() => setEmojiCount((p) => Math.min(60, p + 5))}
                  className="px-2 text-lg hover:text-pink-600"
                >
                  +
                </button>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="text-sm bg-transparent text-gray-700 font-medium"
                >
                  <option value="soft">Soft</option>
                  <option value="normal">Normal</option>
                  <option value="vivid">Vivid</option>
                </select>
                <button
                  className="ml-1 text-lg text-red-400 hover:text-red-600"
                  onClick={() => setAnimation("✨ None (No Animation)")}
                >
                  ×
                </button>
              </div>
            </div>

            {/* 🎁 GIFT Y CHECKOUT */}
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

      {/* 🔧 MODALES */}
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
