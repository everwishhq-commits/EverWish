"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimationOverlay } from "@/lib/animations";

export default function ViewCard({ params }) {
  const id = params.id;
  const [card, setCard] = useState(null);

  useEffect(() => {
    // 🔹 Simula carga de datos de la tarjeta
    setCard({
      slug: "ghost-halloween",
      message: "Boo! You’re my favorite human to haunt 🎃",
      animation: "Pumpkins 🎃",
      photo: null,
      plan: "Signature",
    });
  }, [id]);

  if (!card) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-[#fff7f5] min-h-[100dvh] relative px-3">
      {card.animation && (
        <AnimationOverlay slug={card.slug} animation={card.animation} />
      )}

      <motion.div
        key="view"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-6 mb-8"
      >
        <video
          src={`/videos/${card.slug}.mp4`}
          className="w-full rounded-2xl object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        <p className="mt-3 text-center text-gray-700 text-lg">
          {card.message}
        </p>

        {card.photo && (
          <div className="my-3 w-full flex justify-center">
            <img
              src={card.photo}
              alt="user upload"
              className="rounded-xl w-[80%] shadow-md"
            />
          </div>
        )}

        <div className="mt-5 flex justify-center gap-3">
          <button className="rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 shadow-sm hover:bg-pink-300">
            🔁 Reenviar
          </button>
          <button className="rounded-full bg-purple-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-purple-600">
            🛒 Comprar otra
          </button>
        </div>
      </motion.div>
    </div>
  );
  }
