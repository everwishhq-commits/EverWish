"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getMessageForSlug } from "@/lib/messages";
import { AnimationOverlay, getAnimationOptionsForSlug } from "@/lib/animations";
import CropperModal from "@/components/croppermodal";
import GiftCardPopup from "@/components/giftcard";
import CheckoutModal from "@/components/checkout";

export default function EditPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Estados principales
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedAnimation, setSelectedAnimation] = useState("✨ None (No Animation)");
  const [showAnimationPicker, setShowAnimationPicker] = useState(false);
  const [animationOptions, setAnimationOptions] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [gift, setGift] = useState(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // 🎬 CARGAR VIDEO
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const allVideos = data.videos || [];
        const found = allVideos.find(v => v.name === slug || v.slug === slug);
        
        if (found) {
          setVideo(found);
          const defaultMsg = getMessageForSlug(slug);
          setMessage(defaultMsg);
          
          const options = getAnimationOptionsForSlug(slug);
          setAnimationOptions(options);
          setSelectedAnimation(options[1] || options[0]);
        } else {
          console.error("Video no encontrado:", slug);
          router.push("/categories");
        }
      } catch (err) {
        console.error("Error cargando video:", err);
        router.push("/categories");
      }
    }
    loadVideo();
  }, [slug, router]);

  // 🖥️ PANTALLA COMPLETA - Detectar cambios
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
      
      if (isNowFullscreen) {
        setShowControls(true);
        startControlsTimeout();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // ⏱️ Auto-ocultar controles después de 3 segundos
  const startControlsTimeout = () => {
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    if (isFullscreen) {
      setShowControls(true);
      startControlsTimeout();
    }
  };

  // 🎬 ENTRAR/SALIR DE PANTALLA COMPLETA
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  // 📸 IMAGEN SUBIDA
  const handleImageDone = (croppedImage) => {
    setUploadedImage(croppedImage);
    setShowCropper(false);
  };

  // 🎁 GIFT CARD
  const handleGiftSelect = (giftData) => {
    setGift(giftData);
    setShowGiftPopup(false);
  };

  // 💳 CHECKOUT
  const handleCheckout = async () => {
    if (!senderName || !senderEmail || !recipientName || !recipientEmail) {
      alert("Please fill in all sender and recipient information");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          message,
          anim: selectedAnimation,
          sender: { name: senderName, email: senderEmail },
          recipient: { name: recipientName, email: recipientEmail },
          gift: gift || { brand: "", amount: 0 },
          cardPrice: 5,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff5f8]">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-pink-50 to-white"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* 🎬 VIDEO CON OVERLAY */}
      <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[60vh]'} w-full bg-black`}>
        <video
          ref={videoRef}
          src={video.file}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay de Animación */}
        {selectedAnimation && !selectedAnimation.includes("None") && (
          <AnimationOverlay
            slug={slug}
            animation={selectedAnimation}
            intensity="normal"
            opacityLevel={0.9}
            emojiCount={20}
          />
        )}

        {/* Imagen subida */}
        {uploadedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-[80%] max-h-[80%] rounded-2xl shadow-2xl"
            />
          </div>
        )}

        {/* Mensaje sobre el video */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl max-w-md text-center z-20"
          >
            <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </motion.div>
        )}

        {/* CONTROLES EN PANTALLA COMPLETA */}
        <AnimatePresence>
          {isFullscreen && showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-50 flex gap-3"
            >
              <button
                onClick={toggleFullscreen}
                className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg transition-all"
              >
                ✕ Exit Fullscreen
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Fullscreen (cuando NO está en fullscreen) */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg transition-all z-30"
          >
            ⛶ Fullscreen
          </button>
        )}
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none"
            placeholder="Write your personalized message..."
          />
        </div>

        {/* Sender Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Recipient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              placeholder="jane@example.com"
            />
          </div>
        </div>

        {/* Animation Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Animation Style
          </label>
          <button
            onClick={() => setShowAnimationPicker(!showAnimationPicker)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 hover:border-pink-400 text-left flex justify-between items-center transition-all"
          >
            <span>{selectedAnimation}</span>
            <span className="text-gray-400">{showAnimationPicker ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {showAnimationPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 max-h-64 overflow-y-auto border-2 border-pink-200 rounded-xl bg-white"
              >
                {animationOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAnimation(option);
                      setShowAnimationPicker(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors ${
                      selectedAnimation === option ? "bg-pink-100 font-semibold" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowCropper(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-3 rounded-full font-semibold shadow-md transition-all"
          >
            📸 Add Photo
          </button>

          <button
            onClick={() => setShowGiftPopup(true)}
            className="w-full bg-pink-200 hover:bg-pink-300 text-pink-700 py-3 rounded-full font-semibold shadow-md transition-all"
          >
            🎁 {gift ? `Gift Card: $${gift.amount}` : "Add Gift Card"}
          </button>

          <button
            onClick={handleCheckout}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full font-bold text-lg shadow-lg transition-all"
          >
            💳 Continue to Checkout ($5.00)
          </button>
        </div>
      </div>

      {/* MODALES */}
      {showCropper && (
        <CropperModal
          open={showCropper}
          onClose={() => setShowCropper(false)}
          onDone={handleImageDone}
        />
      )}

      {showGiftPopup && (
        <GiftCardPopup
          initial={gift}
          onSelect={handleGiftSelect}
          onClose={() => setShowGiftPopup(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          total={5 + (gift?.amount || 0)}
          gift={gift}
          onGiftChange={() => setShowGiftPopup(true)}
          onGiftRemove={() => setGift(null)}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
    }
