"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";
import { classifyVideo } from "@/lib/classification-system";
import { SUBCATEGORY_GROUPS } from "@/lib/categories-config";
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

  // 🔥 NUEVO: Información de clasificación
  const [cardInfo, setCardInfo] = useState(null);

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);

  // 🔥 MEJORA: Cargar video + clasificación
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const videos = data.videos || data || [];

        // Buscar el video por nombre exacto primero
        let match = videos.find((v) => v.name === slug);
        
        if (!match) {
          match = videos.find((v) => v.slug === slug);
        }
        
        if (!match) {
          const baseSlug = slug.replace(/_\d+[A-Z]$/i, '');
          match = videos.find((v) => 
            v.name.replace(/_\d+[A-Z]$/i, '') === baseSlug
          );
        }

        if (match) {
          console.log(`✅ Video encontrado: ${match.name}`);
          setVideoSrc(match.file);
          setVideoFound(true);
          
          // 🔥 CLASIFICAR el video para obtener sus categorías/subcategorías
          const classifications = classifyVideo(match.name + ".mp4");
          const primaryClass = classifications[0];
          
          // Extraer todas las subcategorías disponibles en esta categoría
          const categorySlug = primaryClass.categorySlug;
          const allSubcategories = SUBCATEGORY_GROUPS[categorySlug] || {};
          
          setCardInfo({
            name: match.name,
            object: primaryClass.object,
            variant: primaryClass.variant,
            categories: match.categories || [primaryClass.categorySlug],
            subcategories: match.subcategories || primaryClass.subcategories,
            availableSubcategories: allSubcategories, // ⭐ TODAS las subcategorías
          });
          
          console.log(`📊 Clasificación:`, {
            categorías: primaryClass.categorySlug,
            subcategorías: primaryClass.subcategories,
            disponibles: Object.keys(allSubcategories).length + " grupos"
          });
        } else {
          console.warn(`⚠️ Video no encontrado en index.json: ${slug}`);
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

  // loading pantalla
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

  // bloquear clic derecho global
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };
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

  // 🔥 NUEVO: Panel de información de la tarjeta
  const CardInfoPanel = () => {
    if (!cardInfo) return null;

    return (
      <div className="bg-white rounded-2xl p-4 shadow-md border border-pink-100 mb-3">
        <h3 className="text-sm font-bold text-pink-600 mb-2 text-center">
          📋 Card Information
        </h3>
        
        <div className="space-y-2 text-xs">
          {/* Objeto */}
          <div>
            <span className="font-semibold text-gray-700">Object:</span>
            <span className="ml-2 text-gray-600">{cardInfo.object}</span>
          </div>
          
          {/* Variante */}
          <div>
            <span className="font-semibold text-gray-700">Variant:</span>
            <span className="ml-2 text-purple-600 font-mono">{cardInfo.variant}</span>
          </div>
          
          {/* Categorías */}
          <div>
            <span className="font-semibold text-gray-700">Categories:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {cardInfo.categories.map((cat, i) => (
                <span key={i} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs">
                  {cat.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </span>
              ))}
            </div>
          </div>
          
          {/* Subcategorías ACTIVAS */}
          <div>
            <span className="font-semibold text-gray-700">Active Subcategories:</span>
            {cardInfo.subcategories.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {cardInfo.subcategories.map((sub, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    ✅ {sub}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs mt-1">None active</p>
            )}
          </div>
          
          {/* Subcategorías DISPONIBLES (aunque estén vacías) */}
          <div>
            <span className="font-semibold text-gray-700">Available Subcategories:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(cardInfo.availableSubcategories).map(([group, subs]) => (
                <details key={group} className="bg-gray-50 rounded p-2">
                  <summary className="cursor-pointer font-semibold text-xs text-gray-700">
                    📂 {group} ({subs.length})
                  </summary>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {subs.map((sub, i) => {
                      const isActive = cardInfo.subcategories.includes(sub);
                      return (
                        <span 
                          key={i} 
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            isActive 
                              ? "bg-green-100 text-green-700 font-semibold" 
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isActive ? "✅" : "○"} {sub}
                        </span>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-[100vh] max-h-[100vh] bg-[#fff7f5] flex items-center justify-center overflow-hidden">
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
              className="w-full h-full aspect-[4/5] object-cover object-center bg-pink-50"
              autoPlay
              loop
              muted
              playsInline
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              onError={(e) => {
                console.error(`❌ Error cargando video: ${videoSrc}`);
                setVideoFound(false);
              }}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-lg">Video not found: {slug}</p>
              <p className="text-sm text-gray-400 mt-2">
                Path tried: {videoSrc}
              </p>
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
                style={{ height: "30vh" }}
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

              {/* 🔥 NUEVO: Mostrar información de la tarjeta */}
              <CardInfoPanel />

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

              <div className="relative flex-shrink-0" style={{ height: "30vh" }}>
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
                style={{ height: "36vh" }}
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
                      This c
