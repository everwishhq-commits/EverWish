"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function EditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const found = data.videos.find(v => v.name === slug);
        if (found) {
          setVideo(found);
          console.log(`📹 Video cargado: ${found.name}`);
        } else {
          console.error(`❌ Video no encontrado: ${slug}`);
        }
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
    loadVideo();
  }, [slug]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    // TODO: Implementar lógica de envío
    console.log("📤 Enviando:", { video, message, image });
    alert("Función de envío en desarrollo");
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-pink-500 hover:text-pink-600 font-semibold flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-xl font-bold text-pink-600">Customize Card</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Columna izquierda: Preview */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Preview
              </h2>

              {/* Contenedor FIJO con aspect ratio */}
              <div className="relative w-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden shadow-lg">
                {/* Aspect ratio container: 9:16 (vertical video) */}
                <div className="aspect-[9/16] relative">
                  {/* Video adaptado al contenedor */}
                  <video
                    ref={videoRef}
                    src={video.file}
                    className="absolute inset-0 w-full h-full object-cover"
                    loop
                    muted
                    autoPlay
                    playsInline
                    controlsList="nodownload"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Mensaje superpuesto (si existe) */}
                  {message && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 pointer-events-none">
                      <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-white text-center text-lg font-semibold leading-relaxed">
                          {message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Imagen superpuesta (si existe) */}
                  {imagePreview && (
                    <div className="absolute bottom-6 inset-x-6 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-3">
                {video.object || video.name}
              </p>
            </motion.div>
          </div>

          {/* Columna derecha: Controles */}
          <div className="space-y-6">
            
            {/* Mensaje */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <label className="block text-lg font-bold text-gray-800 mb-3">
                💬 Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:outline-none resize-none"
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 text-right mt-2">
                {message.length}/200 characters
              </p>
            </motion.div>

            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <label className="block text-lg font-bold text-gray-800 mb-3">
                📷 Add Photo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full py-3 px-4 border-2 border-dashed border-pink-300 rounded-xl text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all"
              >
                {imagePreview ? (
                  <span className="text-pink-600 font-semibold">✓ Image selected</span>
                ) : (
                  <span className="text-gray-600">Click to upload image</span>
                )}
              </label>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="mt-3 text-sm text-pink-500 hover:text-pink-600 font-semibold"
                >
                  × Remove image
                </button>
              )}
            </motion.div>

            {/* Botón de envío */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleSend}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🎉 Send Card
            </motion.button>

            <p className="text-xs text-gray-500 text-center">
              The recipient will receive the card with your personalized message and image
            </p>
          </div>
        </div>
      </div>
    </div>
  );
              }
