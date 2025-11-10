"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EditPage({ params }) {
  const slug = params?.slug || "example";
  const [progress, setProgress] = useState(0);
  const [videoFound, setVideoFound] = useState(true);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const videos = data.videos || data || [];
        let match = videos.find((v) => v.name === slug);
        if (!match) match = videos.find((v) => v.slug === slug);

        if (match?.file) {
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

    // Simula carga
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [slug]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: "7vh" }}
    >
      {videoFound && videoSrc ? (
        <video
          src={videoSrc}
          className="w-[90vw] sm:w-[380px] md:w-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-pink-50"
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

      {/* Barra de carga */}
      <div className="absolute bottom-8 w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.03, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
            }
