"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getAnimationOptionsForSlug, 
  AnimationOverlay 
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";
import CropperModal from "@/components/croppermodal";
import GiftCardPopup from "@/components/giftcard";
import CheckoutModal from "@/components/checkout";

export default function EditPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  // Estados principales
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedAnimation, setSelectedAnimation] = useState("✨ None (No Animation)");
  const [animationIntensity, setAnimationIntensity] = useState("normal");
  const [opacityLevel, setOpacityLevel] = useState(0.9);
  const [emojiCount, setEmojiCount] = useState(20);
  const [animationOptions, setAnimationOptions] = useState([]);
  
  // Estados de imágenes y extras
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [gift, setGift] = useState(null);
  
  // Estados de sender/recipient
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });
  
  // Control de fullscreen y preview
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  // ===== CARGAR VIDEO =====
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const found = data.videos?.find(v => v.name === slug || v.slug === slug);
        
        if (!found) {
          console.error(`❌ Video no encontrado: ${slug}`);
          router.push("/categories");
          return;
        }
        
        setVideo(found);
        
        // Cargar opciones de animación según el slug
        const options = getAnimationOptionsForSlug(slug);
        setAnimationOptions(options);
        
        // Mensaje sugerido
        const suggestedMessage = getMessageForSlug(slug);
        setMessage(suggestedMessage);
        
        console.log(`✅ Video cargado: ${found.name}`);
      } catch (err) {
        console.error("❌ Error cargando video:", err);
      }
    }
    
    loadVideo();
  }, [slug, router]);

  // ===== FULLSCREEN =====
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // ===== HANDLERS =====
  const handleImageCropped = (dataUrl) => {
    setUploadedImage(dataUrl);
    setShowCropper(false);
  };

  const handleGiftSelect = (giftData) => {
    setGift(giftData);
    setShowGiftPopup(false);
  };

  const handleCheckout = async () => {
    // Validaciones básicas
    if (!sender.name || !sender.email) {
      alert("❌ Please fill in your name and email");
      return;
    }
    
    if (!recipient.name || !recipient.email) {
      alert("❌ Please fill in recipient's name and email");
      return;
    }
    
    if (!message.trim()) {
      alert("❌ Please write a message");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: video.name,
          message,
          anim: selectedAnimation,
          sender,
          recipient,
          gift: gift || { brand: "", amount: 0 },
          cardPrice: 5,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("❌ Error creating checkout session");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Error processing checkout");
    }
  };

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff5f8]">
        <p className="text-lg text-gray-600 animate-pulse">Loading card...</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== VIDEO FULLSCREEN ===== */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-[9999]' : 'relative w-full'} bg-black`}>
        <div className="relative w-full h-screen flex items-center justify-center">
          {/* Video base */}
          <video
            ref={videoRef}
            src={video.file}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          />
          
          {/* Overlay de animación */}
          <AnimationOverlay
            slug={slug}
            animation={selectedAnimation}
            intensity={animationIntensity}
            opacityLevel={opacityLevel}
            emojiCount={emojiCount}
          />
          
          {/* Mensaje flotante */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-md w-11/12 z-[9000]"
            >
              <p className="text-gray-800 text-center text-lg leading-relaxed whitespace-pre-line">
                {message}
              </p>
              {sender.name && (
                <p className="text-sm text-gray-500 text-center mt-3 italic">
                  — {sender.name}
                </p>
              )}
            </motion.div>
          )}
          
          {/* Botón fullscreen */}
          {!isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg z-[9001]"
            >
              🔍 Preview Fullscreen
            </button>
          )}
          
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg z-[9001]"
            >
              ✕ Exit Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* ===== PANEL DE EDICIÓN (solo visible fuera de fullscreen) ===== */}
      {!isFullscreen && (
        <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <button
                onClick={() => router.back()}
                className="text-pink-500 hover:text-pink-600 font-semibold mb-4 inline-block"
              >
                ← Back
              </button>
              <h1 className="text-3xl font-bold text-pink-600 mb-2">
                ✨ Customize Your Card
              </h1>
              <p className="text-gray-600">
                {video.object || video.name}
              </p>
            </div>

            {/* ===== SECCIÓN: MENSAJE ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                💬 Your Message
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your heartfelt message here..."
                className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-4 text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                {message.length} characters
              </p>
            </div>

            {/* ===== SECCIÓN: ANIMACIÓN ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ✨ Animation
              </h2>
              
              {/* Selector de animación */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Choose Animation:
                </label>
                <select
                  value={selectedAnimation}
                  onChange={(e) => setSelectedAnimation(e.target.value)}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3 text-gray-700"
                >
                  {animationOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Controles de animación (solo si hay animación) */}
              {selectedAnimation !== "✨ None (No Animation)" && (
                <div className="space-y-4 mt-4 p-4 bg-pink-50 rounded-xl">
                  {/* Intensidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Intensity:
                    </label>
                    <div className="flex gap-2">
                      {["soft", "normal", "vivid"].map(level => (
                        <button
                          key={level}
                          onClick={() => setAnimationIntensity(level)}
                          className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                            animationIntensity === level
                              ? "bg-pink-500 text-white"
                              : "bg-white text-gray-700 hover:bg-pink-100"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opacidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Opacity: {Math.round(opacityLevel * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.1"
                      value={opacityLevel}
                      onChange={(e) => setOpacityLevel(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Cantidad de emojis */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Emoji Count: {emojiCount}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="5"
                      value={emojiCount}
                      onChange={(e) => setEmojiCount(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ===== SECCIÓN: IMAGEN OPCIONAL ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📸 Add Photo (Optional)
              </h2>
              
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full rounded-xl"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCropper(true)}
                  className="w-full py-4 border-2 border-dashed border-pink-300 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all"
                >
                  + Upload Photo
                </button>
              )}
            </div>

            {/* ===== SECCIÓN: SENDER ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                👤 From (You)
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={sender.name}
                  onChange={(e) => setSender({...sender, name: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={sender.email}
                  onChange={(e) => setSender({...sender, email: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
                <input
                  type="tel"
                  placeholder="Your phone (optional)"
                  value={sender.phone}
                  onChange={(e) => setSender({...sender, phone: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
              </div>
            </div>

            {/* ===== SECCIÓN: RECIPIENT ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎁 To (Recipient)
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Recipient's name"
                  value={recipient.name}
                  onChange={(e) => setRecipient({...recipient, name: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
                <input
                  type="email"
                  placeholder="Recipient's email"
                  value={recipient.email}
                  onChange={(e) => setRecipient({...recipient, email: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
                <input
                  type="tel"
                  placeholder="Recipient's phone (optional)"
                  value={recipient.phone}
                  onChange={(e) => setRecipient({...recipient, phone: e.target.value})}
                  className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3"
                />
              </div>
            </div>

            {/* ===== SECCIÓN: GIFT CARD ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎁 Add Gift Card (Optional)
              </h2>
              
              {gift ? (
                <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-gray-800">{gift.brand || "Gift Card"}</p>
                    <p className="text-green-600 font-bold">${gift.amount}</p>
                  </div>
                  <button
                    onClick={() => setGift(null)}
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowGiftPopup(true)}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold rounded-xl transition-all"
                >
                  + Add Gift Card
                </button>
              )}
            </div>

            {/* ===== BOTÓN FINAL ===== */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-3xl font-bold text-pink-600">
                  ${(5 + (gift?.amount || 0)).toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl rounded-full shadow-lg transition-all"
              >
                💳 Checkout & Send
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-3">
                Secure payment powered by Stripe
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ===== MODALES ===== */}
      <AnimatePresence>
        {showCropper && (
          <CropperModal
            open={showCropper}
            onClose={() => setShowCropper(false)}
            onDone={handleImageCropped}
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
      </AnimatePresence>
    </>
  );
    }
