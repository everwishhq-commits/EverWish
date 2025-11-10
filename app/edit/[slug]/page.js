"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditPage() {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(60);

  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const list = data.videos || data || [];
        const found = list.find(
          (v) => v.name === slug || v.slug === slug
        );
        setVideo(found || null);
      } catch (err) {
        console.error("❌ Error cargando videos:", err);
      }
    }
    loadVideo();
  }, [slug]);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff7f5] text-gray-600">
        <p className="animate-pulse">Loading video...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden"
      style={{
        height: "85vh", // 🔹 altura completa de viewport
        padding: 0, // 🔹 sin padding
      }}
    >
      <video
        src={video.file}
        className="w-full h-full object-cover bg-pink-50"
        autoPlay
        loop
        muted
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* nombre del video - posicionado absolutamente */}
      <p className="absolute bottom-16 -left-3 -right-3 text-center text-sm text-gray-600 font-medium bg-white/80 backdrop-blur-sm py-2">
        {video.object || video.name}
      </p>

      {/* Barra de carga decorativa */}
      <div className="absolute bottom-8 -left-3 -right-3 mx-auto w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
          }
