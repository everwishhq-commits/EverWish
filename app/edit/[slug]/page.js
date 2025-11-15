"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const defaultAnim = opts.find((a) => !a.includes("None")) || opts[0];
    setAnimation(defaultAnim);
    setLastActiveAnimation(defaultAnim);
  }, [slug]);

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

  useEffect(() => {
    setAnimKey(Date.now());
  }, [animation, category, intensity, emojiCount]);

  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  const handleCardClick = () => {
    alert("🔒 This card is protected. Purchase to download!");
  };

  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };
  
  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  const isAnimationActive = animation && !animation.startsWith("✨ None");

  const AnimationPanel = () => {
    const currentEmoji = isAnimationActive ? animation.split(' ')[0] : '✨';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between w-full rounded-2xl transition-all duration-300 ${
          isAnimationActive
            ? "bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 text-gray-800 shadow-lg border-2 border-white"
            : "bg-white/90 backdrop-blur-sm text-gray-400 border-2 border-gray-200"
        }`}
        style={{ height: "56px", padding: "0 16px" }}
      >
        <button
          onClick={() => {
            if (!isAnimationActive) {
              if (lastActiveAnimation) {
                setAnimation(lastActiveAnimation);
              } else {
                const firstActive = animationOptions.find((a) => !a.includes("None"));
                if (firstActive) setAnimation(firstActive);
              }
            }
          }}
          className={`text-2xl mr-3 transition-all flex-shrink-0 ${
            isAnimationActive 
              ? "cursor-default animate-bounce" 
              : "cursor-pointer hover:scale-125 hover:rotate-12"
          }`}
        >
          {currentEmoji}
        </button>

        <select
          value={isAnimationActive ? animation : ""}
          onChange={(e) => {
            setAnimation(e.target.value);
            if (!e.target.value.includes("None")) {
              setLastActiveAnimation(e.target.value);
            }
          }}
          disabled={!isAnimationActive}
          className={`flex-1 text-sm font-semibold bg-transparent focus:outline-none truncate min-w-0 ${
            isAnimationActive ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          {!isAnimationActive ? (
            <option value="">✨ Tap emoji to activate</option>
          ) : (
            <>
              {animationOptions
                .filter((a) => !a.includes("None"))
                .map((a) => {
                  const name = a.split(' ').slice(1).join(' ');
                  return (
                    <option key={a} value={a}>
                      {name}
                    </option>
                  );
                })}
            </>
          )}
        </select>

        <div className="flex items-center gap-2 ml-3">
          <div className="flex items-center rounded-lg border-2 border-gray-300 overflow-hidden bg-white shadow-sm">
            <button
              className="px-2.5 py-1 text-lg font-bold text-pink-600 hover:bg-pink-50 transition-colors"
              onClick={() => setEmojiCount((prev) => Math.max(5, prev - 5))}
              disabled={!isAnimationActive}
            >
              −
            </button>
            <span className="px-3 text-sm font-bold text-gray-700 min-w-[32px] text-center border-x-2 border-gray-200">
              {emojiCount}
            </span>
            <button
              className="px-2.5 py-1 text-lg font-bold text-pink-600 hover:bg-pink-50 transition-colors"
              onClick={() => setEmojiCount((prev) => Math.min(60, prev + 5))}
              disabled={!isAnimationActive}
            >
              +
            </button>
          </div>

          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            disabled={!isAnimationActive}
            className="px-3 py-1.5 text-sm bg-white rounded-lg border-2 border-gray-300 font-semibold focus:outline-none focus:border-pink-400 cursor-pointer shadow-sm"
          >
            <option value="soft">💫 Soft</option>
            <option value="normal">✨ Normal</option>
            <option value="vivid">🌟 Vivid</option>
          </select>

          <button
            onClick={() => {
              if (isAnimationActive) {
                setLastActiveAnimation(animation);
                const noneOption = animationOptions.find((a) => a.includes("None"));
                if (noneOption) setAnimation(noneOption);
              }
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all shadow-sm ${
              isAnimationActive
                ? "bg-white text-red-500 hover:bg-red-50 hover:scale-110 cursor-pointer border-2 border-red-200"
                : "bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-200"
            }`}
            disabled={!isAnimationActive}
          >
            ✕
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative h-[100vh] max-h-[100vh] bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center overflow-hidden">
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {videoFound ? (
            <video
              src={videoSrc}
              className="w-full h-full aspect-[4/5] object-cover object-center shadow-2xl"
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

          <div className="absolute bottom-8 w-2/3 h-3 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"
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
            opacityLevel={0.9}
            emojiCount={emojiCount}
          />

          {userImage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-[200] w-full max-w-md h-[100vh] px-4 pt-6 pb-24 overflow-y-auto flex flex-col gap-4"
            >
              <div
                className="relative rounded-3xl border-4 border-white bg-white overflow-hidden cursor-pointer select-none flex-shrink-0 shadow-2xl hover:shadow-pink-200 transition-shadow duration-300"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "38vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="w-full h-full aspect-[4/5] object-cover object-center pointer-events-none"
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

              <div className="flex flex-col gap-3 flex-shrink-0">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                  <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    ✨ Your Message ✨
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                </div>
                <textarea
                  className="w-full rounded-2xl border-2 border-pink-200 p-4 text-center text-base text-gray-700 shadow-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 resize-none bg-white/95 backdrop-blur-sm transition-all"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message..."
                />
              </div>

              <div className="relative flex-shrink-0" style={{ height: "38vh" }}>
                <div
                  className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-purple-50 h-full cursor-pointer flex items-center justify-center hover:shadow-pink-200 transition-shadow duration-300"
                  onClick={() => setShowCrop(true)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={userImage}
                    alt="user"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>

                <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGift(true);
                      }}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 backdrop-blur-sm py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition-all border-2 border-white"
                    >
                      🎁 Add Gift
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCheckout(true);
                      }}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm py-3 text-sm font-bold text-white shadow-xl hover:shadow-2xl transition-all border-2 border-white"
                    >
                      💳 Checkout ${total}
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 mt-2 mb-4">
                <AnimationPanel />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-[200] w-full max-w-md h-[100vh] px-4 py-6 flex flex-col"
            >
              <div
                className="relative rounded-3xl border-4 border-white bg-white overflow-hidden cursor-pointer select-none flex-shrink-0 shadow-2xl hover:shadow-pink-200 transition-shadow duration-300"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "46vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="w-full h-full aspect-[4/5] object-cover object-center pointer-events-none"
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

              <div className="flex flex-col gap-3 flex-shrink-0 mt-5">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                  <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    ✨ Your Message ✨
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                </div>
                <textarea
                  className="w-full rounded-2xl border-2 border-pink-200 p-4 text-center text-base text-gray-700 shadow-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 resize-none bg-white/95 backdrop-blur-sm transition-all"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message..."
                />
              </div>

              <div className="flex items-center justify-center flex-shrink-0 py-5">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCrop(true)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-3 text-base font-bold text-gray-800 hover:shadow-xl transition-all shadow-lg border-2 border-white"
                >
                  📸 Add Photo
                </motion.button>
              </div>

              <div className="flex-shrink-0 mt-2">
                <AnimationPanel />
              </div>

              <div className="flex gap-3 flex-shrink-0 mt-auto pt-4 pb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGift(true)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 py-3 text-sm font-bold text-white hover:shadow-xl transition-all shadow-lg border-2 border-white"
                >
                  🎁 Add Gift
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCheckout(true)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-sm font-bold text-white hover:shadow-xl transition-all shadow-lg border-2 border-white"
                >
                  💳 Checkout ${total}
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}

      <div className="fixed inset-0 pointer-events-none z-[10050]">
        <AnimatePresence>
          {showGift && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto relative"
            >
              <GiftCardPopup
                initial={gift}
                onSelect={updateGift}
                onClose={() => setShowGift(false)}
              />
            </motion.div>
          )}
          {showCheckout && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit
