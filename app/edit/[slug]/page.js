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
import { useRouter } from "next/navigation";

export default function EditPage({ params }) {
  const slug = params.slug;
  const router = useRouter();

  // estados
  const [stage, setStage] = useState("preview"); // Cambiado de "expanded" a "preview"
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

  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    setMessage(getMessageForSlug(slug));

    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    const defaultAnim = opts.find((a) => !a.includes("None")) || opts[0];
    setAnimation(defaultAnim);
    setLastActiveAnimation(defaultAnim);
  }, [slug]);

  // loading pantalla con countdown
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setStage("editor");
        }, 500);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  // re-render anim
  useEffect(() => {
    setAnimKey(Date.now());
  }, [animation, category, intensity, emojiCount]);

  // bloquear clic derecho global
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // bloquear guardar
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

  // Panel de animación
  const isAnimationActive = animation && !animation.startsWith("✨ None");

  const AnimationPanel = () => {
    const currentEmoji = isAnimationActive ? animation.split(' ')[0] : '✨';
    
    return (
      <div
        className={`flex items-center justify-between w-full rounded-xl ${
          isAnimationActive
            ? "bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 text-gray-800 shadow-sm"
            : "bg-gray-100 text-gray-400"
        }`}
        style={{ height: "50px", padding: "0 12px" }}
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
          className={`text-xl mr-2 transition-all flex-shrink-0 ${
            isAnimationActive 
              ? "cursor-default" 
              : "cursor-pointer hover:scale-110"
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
          className={`flex-1 text-xs font-medium bg-transparent focus:outline-none truncate min-w-0 ${
            isAnimationActive ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          {!isAnimationActive ? (
            <option value="">Select Animation</option>
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

        <div className="flex items-center gap-2 ml-2">
          <div className="flex items-center rounded-md border border-gray-300 overflow-hidden bg-white">
            <button
              className="px-2 text-base"
              onClick={() => setEmojiCount((prev) => Math.max(5, prev - 5))}
              disabled={!isAnimationActive}
            >
              –
            </button>
            <span className="px-2 text-xs font-medium text-gray-700">
              {emojiCount}
            </span>
            <button
              className="px-2 text-base"
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
            className="px-2 text-xs bg-white rounded-md border border-gray-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="soft">Soft</option>
            <option value="normal">Normal</option>
            <option value="vivid">Vivid</option>
          </select>

          <button
            onClick={() => {
              if (isAnimationActive) {
                setLastActiveAnimation(animation);
                const noneOption = animationOptions.find((a) => a.includes("None"));
                if (noneOption) setAnimation(noneOption);
              }
            }}
            className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-base transition-all ${
              isAnimationActive
                ? "bg-white text-red-500 hover:bg-red-50 cursor-pointer"
                : "bg-white text-gray-300 cursor-not-allowed"
            }`}
            disabled={!isAnimationActive}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-[100vh] max-h-[100vh] bg-[#fff7f5] flex items-center justify-center overflow-hidden">
      {stage === "preview" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: isMobile 
              ? '#000000'
              : 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
          }}
        >
          <div 
            className="flex items-center justify-center"
            style={{
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '600px',
              maxHeight: isMobile ? '100%' : '85vh',
              padding: isMobile ? '0' : '2rem'
            }}
          >
            {videoFound ? (
              <video
                src={videoSrc}
                className="rounded-2xl shadow-2xl object-contain bg-pink-50"
                style={{
                  width: isMobile ? '100%' : 'auto',
                  height: isMobile ? '100%' : 'auto',
                  maxHeight: isMobile ? '100%' : '80vh',
                  maxWidth: isMobile ? '100%' : '550px',
                  borderRadius: isMobile ? '0' : '1rem'
                }}
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
          </div>

          <button
            onClick={() => setStage("editor")}
            className="absolute top-8 right-8 bg-white/90 hover:bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg transition-all z-10"
          >
            Skip Preview
          </button>

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
            opacityLevel={0.9}
            emojiCount={emojiCount}
          />

          {userImage ? (
            <div className="relative z-[200] w-full max-w-md h-[100vh] px-3 pt-4 pb-24 overflow-y-auto flex flex-col gap-3">
              <div
                className="relative rounded-2xl border bg-gray-50 overflow-hidden cursor-pointer select-none flex-shrink-0"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "38vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="w-full h-full aspect-[4/5] object-cover object-center bg-pink-50 overflow-hidden pointer-events-none"
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

              <div className="flex flex-col gap-2 flex-shrink-0">
                <h3 className="text-center text-sm font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-2xl border p-3 text-center text-base text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400 resize-none"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="relative flex-shrink-0" style={{ height: "38vh" }}>
                <div
                  className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-[#fff7f5] h-full cursor-pointer flex items-center justify-center"
                  onClick={() => setShowCrop(true)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={userImage}
                    alt="user"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>

                <div className="absolute bottom-3 left-0 right-0 px-3 z-10">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGift(true);
                      }}
                      className="flex-1 rounded-full bg-pink-200/95 backdrop-blur-sm py-2.5 text-sm font-semibold text-pink-700 shadow-lg hover:bg-pink-300/95 transition-all"
                    >
                      🎁 Gift Card
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCheckout(true);
                      }}
                      className="flex-1 rounded-full bg-purple-500/95 backdrop-blur-sm py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-600/95 transition-all"
                    >
                      💳 Checkout
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 mt-2 mb-4">
                <AnimationPanel />
              </div>
            </div>
          ) : (
            <div className="relative z-[200] w-full max-w-md h-[100vh] px-3 py-4 flex flex-col">
              <div
                className="relative rounded-2xl border bg-gray-50 overflow-hidden cursor-pointer select-none flex-shrink-0"
                onClick={handleCardClick}
                onContextMenu={(e) => e.preventDefault()}
                style={{ height: "46vh" }}
              >
                {videoFound ? (
                  <video
                    src={videoSrc}
                    className="w-full h-full aspect-[4/5] object-cover object-center bg-pink-50 overflow-hidden pointer-events-none"
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

              <div className="flex flex-col gap-2 flex-shrink-0 mt-4">
                <h3 className="text-center text-sm font-semibold text-gray-700">
                  ✨ Customize your message ✨
                </h3>
                <textarea
                  className="w-full rounded-2xl border p-4 text-center text-base text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400 resize-none"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-center flex-shrink-0 py-4">
                <button
                  onClick={() => setShowCrop(true)}
                  className="flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-[#3b2b1f] hover:bg-yellow-300 transition-all shadow-md"
                >
                  📸 Add Image
                </button>
              </div>

              <div className="flex-shrink-0 mt-1">
                <AnimationPanel />
              </div>

              <div className="flex gap-2 flex-shrink-0 mt-auto pt-2 pb-3">
                <button
                  onClick={() => setShowGift(true)}
                  className="flex-1 rounded-full bg-pink-200 py-2.5 text-sm font-semibold text-pink-700 hover:bg-pink-300 transition-all"
                >
                  🎁 Gift Card
                </button>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="flex-1 rounded-full bg-purple-500 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 transition-all"
                >
                  💳 Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
