"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimationOverlay } from "@/lib/animations";

export default function ViewCard({ params }) {
  const id = params.id;
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulación: datos cargados del backend
    setData({
      slug: "ghost-halloween",
      message: "Boo! You’re my favorite human to haunt 👻",
      animation: "Pumpkins 🎃",
      photo: null,
      videoSrc: "/videos/ghost-halloween.mp4",
    });
  }, [id]);

  if (!data) return null;

  return (
    <div className="flex flex-col items-center justify-start bg-[#fff7f5] min-h-[100dvh] relative px-3 pt-6">
      <AnimationOverlay slug={data.slug} animation={data.animation} />

      <motion.div
        key="viewcard"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl"
      >
        <div className="relative mb-3 overflow-hidden rounded-2xl border bg-gray-50">
          <video
            src={data.videoSrc}
            className="w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <p className="text-center text-gray-700 font-medium mb-3 whitespace-pre-wrap">
          {data.message}
        </p>

        {data.photo && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={data.photo}
              alt="uploaded"
              className="rounded-xl w-[80%] shadow-md"
            />
          </div>
        )}

        <div className="flex justify-center gap-3 mt-2">
          <button className="rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 shadow-sm hover:bg-pink-300">
            🔁 Reenviar
          </button>
          <button className="rounded-full bg-purple-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-purple-600">
            🛒 Comprar otra
          </button>
        </div>
      </motion.div>
    </div>
  );
}
