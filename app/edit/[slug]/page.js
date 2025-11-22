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

  // estados
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFound, setVideoFound] = useState(true);
  const [lastActiveAnimation, setLastActiveAnimation] = useState("");

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

  // cargar video + config
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

    const defaultMsg = getMessageForSlug(slug);
    setMessage(defaultMsg);

    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    if (opts.length > 0) setAnimation(opts[0]);
  }, [slug]);

  // secuencia intro => editor
  useEffect(() => {
    if (stage === "expanded") {
      const t1 = setTimeout(() => {
        setStage("shrinking");
        setProgress(50);
      }, 2000);
      const t2 = setTimeout(() => {
        setStage("editor");
        setProgress(100);
      }, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage]);

  // control de animaciones
  useEffect(() => {
    if (animation) {
      setLastActiveAnimation(animation);
      setAnimKey((k) => k + 1);
    }
  }, [animation, intensity, emojiCount]);

  const openGift = () => setShowGift(true);
  const openCheckout = () => setShowCheckout(true);
  const openCrop = () => setShowCrop(true);

  const handleGiftSelect = (g) => {
    setGift(g);
    setTotal(5 + (g?.value || 0));
    setShowGift(false);
  };

  const handleImageCropped = (croppedBlob) => {
    setUserImage(croppedBlob);
    setShowCrop(false);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  // RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* INTRO SPLASH */}
      {stage === "expanded" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* TRANSICIÓN */}
      {stage === "shrinking" && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 0.5, y: -150 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black"
        >
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* EDITOR */}
      {stage === "editor" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header con progreso */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  Create Your Card
                </h1>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Grid: Video + Controles */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* VIDEO PREVIEW */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[9/16] max-w-md mx-auto">
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onContextMenu={(e) => e.preventDefault()}
                    controlsList="nodownload"
                  />

                  {/* Animation Overlay */}
                  {animation && (
                    <AnimationOverlay
                      key={animKey}
                      animation={animation}
                      intensity={intensity}
                      emojiCount={emojiCount}
                    />
                  )}

                  {/* Mensaje */}
                  {message && (
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-center text-lg font-medium leading-relaxed">
                        {message}
                      </p>
                    </div>
                  )}

                  {/* User Image */}
                  {userImage && (
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={URL.createObjectURL(userImage)}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROLES */}
              <div className="space-y-6">
                {/* Mensaje */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Write your heartfelt message..."
                  />
                </div>

                {/* Animaciones */}
                {animationOptions.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Animation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {animationOptions.map((anim) => (
                        <button
                          key={anim}
                          onClick={() => setAnimation(anim)}
                          className={`px-4 py-3 rounded-xl font-medium capitalize transition-all ${
                            animation === anim
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {anim}
                        </button>
                      ))}
                    </div>

                    {/* Intensidad */}
                    {animation && (
                      <div className="mt-4 space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Intensity
                        </label>
                        <div className="flex gap-2">
                          {["light", "normal", "heavy"].map((int) => (
                            <button
                              key={int}
                              onClick={() => setIntensity(int)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                                intensity === int
                                  ? "bg-pink-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {int}
                            </button>
                          ))}
                        </div>

                        {/* Slider de cantidad */}
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Emoji Count: {emojiCount}
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={emojiCount}
                            onChange={(e) =>
                              setEmojiCount(Number(e.target.value))
                            }
                            className="w-full accent-pink-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User Image Upload */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Add Your Photo
                  </label>
                  <button
                    onClick={openCrop}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                  >
                    {userImage ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>

                {/* Gift Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Add Gift Card (Optional)
                  </label>
                  <button
                    onClick={openGift}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    {gift
                      ? `$${gift.value} Visa Gift Card`
                      : "Add Gift Card"}
                  </button>
                </div>

                {/* Checkout */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-pink-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={openCheckout}
                    className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Checkout & Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* MODALES */}
      {showGift && (
        <GiftCardPopup onClose={() => setShowGift(false)} onSelect={handleGiftSelect} />
      )}
      {showCheckout && (
        <CheckoutModal
          total={total}
          gift={gift}
          onClose={handleCheckoutClose}
          cardData={{
            slug,
            message,
            animation,
            intensity,
            emojiCount,
            userImage,
            videoSrc,
          }}
        />
      )}
      {showCrop && (
        <CropperModal onClose={() => setShowCrop(false)} onCropComplete={handleImageCropped} />
      )}
    </div>
  );
}
