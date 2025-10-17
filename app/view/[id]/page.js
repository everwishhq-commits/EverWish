"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimationOverlay } from "@/lib/animations";
import { EverwishAdmin } from "@/lib/admin";
import ThankYouModal from "@/lib/thankyoumodal"; // modal opcional (respuesta o agradecimiento)

export default function ViewPage({ params }) {
  const { id } = params;
  const [card, setCard] = useState(null);
  const [showThanks, setShowThanks] = useState(false);

  /* 🔹 Simula búsqueda de la tarjeta por ID */
  useEffect(() => {
    // Aquí normalmente harías fetch(`/api/cards/${id}`)
    const mock = {
      id,
      slug: "ghost-halloween",
      message:
        "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
      animation: "Ghosts 👻",
      sender: "me@example.com",
      image: null, // o link temporal del cliente
      videoSrc: "/videos/ghost-halloween.mp4",
      createdAt: "2025-10-17T18:25:00Z",
      status: "sent",
    };
    setCard(mock);

    // ✅ Marca como abierta en base de datos o memoria
    EverwishAdmin.markAsOpened(id);
  }, [id]);

  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#fff7f5]">
        <p className="text-gray-500">Loading your card...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center bg-[#fff7f5] min-h-[100dvh] overflow-hidden">
      {/* ✨ Fondo animado */}
      <AnimationOverlay slug={card.slug} animation={card.animation} />

      {/* 🎞️ Video base (tarjeta animada) */}
      <video
        src={card.videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🧧 Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-[200] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-md mx-3 flex flex-col items-center text-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ✨ A Special Wish for You ✨
        </h1>

        {/* 📸 Imagen opcional (subida por el emisor) */}
        {card.image && (
          <img
            src={card.image}
            alt="Gift"
            className="rounded-2xl w-full object-cover mb-4 shadow"
          />
        )}

        {/* 💬 Mensaje personalizado */}
        <p className="text-gray-700 text-lg leading-relaxed mb-5">
          {card.message}
        </p>

        {/* 💌 Fecha y firma */}
        <p className="text-sm text-gray-500 italic">
          — Sent with ❤️ from <b>{card.sender}</b> on{" "}
          {new Date(card.createdAt).toLocaleDateString()}
        </p>

        {/* 💬 Botón opcional para agradecer */}
        <button
          onClick={() => setShowThanks(true)}
          className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow"
        >
          💬 Send Thanks
        </button>
      </motion.div>

      {/* 🙏 Modal para responder */}
      {showThanks && (
        <ThankYouModal
          sender={card.sender}
          onClose={() => setShowThanks(false)}
        />
      )}
    </div>
  );
  }
