"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function EditPage() {
  const [progress, setProgress] = useState(60);
  const match = { file: "/videos/sample.mp4" }; // 🔹 Cambia esto por un video real
  const slug = "sample";
  const videoFound = true;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden"
      style={{
        height: "108vh", // 🔹 un poco más alto que la pantalla
        paddingTop: "0vh", // 🔹 espacio arriba
        paddingBottom: "0vh", // 🔹 espacio abajo
      }}
    >
      {videoFound ? (
        <video
          src={match.file}
          className="w-[110vw] sm:w-[400px] md:w-[440px] aspect-[4/5.2] rounded-2xl shadow-lg object-cover object-center bg-pink-50"
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

      {/* Barra de carga (decorativa, puedes quitarla si no la quieres) */}
      <div className="absolute bottom-10 w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
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
