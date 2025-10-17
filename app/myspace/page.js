"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { EverwishAdmin } from "@/lib/admin";

export default function MySpace() {
  const [cards, setCards] = useState([]);

  /* 🔹 Simulación de carga de datos (desde backend o localStorage) */
  useEffect(() => {
    // 🧩 Ejemplo de estructura esperada
    const mock = [
      {
        id: "temp-ghost-halloween-17300001",
        slug: "ghost-halloween",
        message: "Have a spooky-fun Halloween full of treats and laughter! 🎃👻",
        animation: "Pumpkins 🎃",
        recipient: "friend@example.com",
        sender: "me@example.com",
        status: "pending",
        videoSrc: "/videos/ghost-halloween.mp4",
        createdAt: "2025-10-17T18:25:00Z",
      },
      {
        id: "paid-birthday-celebration-17300002",
        slug: "birthday-celebration",
        message: "Celebrate your special day with joy, smiles, and love! 🎂🎉",
        animation: "Stars ✨",
        recipient: "mom@example.com",
        sender: "me@example.com",
        status: "sent",
        videoSrc: "/videos/birthday-celebration.mp4",
        createdAt: "2025-10-14T21:00:00Z",
      },
      {
        id: "paid-valentines-love-17300003",
        slug: "valentines-love",
        message: "You make my heart smile — Happy Valentine’s Day! ❤️✨",
        animation: "Hearts ❤️",
        recipient: "partner@example.com",
        sender: "me@example.com",
        status: "opened",
        videoSrc: "/videos/valentines-love.mp4",
        createdAt: "2025-02-14T10:00:00Z",
      },
    ];
    setCards(mock);
  }, []);

  /* 🟣 Acciones */
  const handleReSend = (card) => {
    const result = EverwishAdmin.sendToMultiple(card.id, [
      card.recipient,
    ]);
    alert(`Card resent to ${card.recipient}: ${result[0].link}`);
  };

  const handleView = (card) => {
    window.open(`/view/${card.id}`, "_blank");
  };

  const handleEdit = (card) => {
    window.open(`/edit/${card.slug}`, "_blank");
  };

  const handleMarkOpened = (cardId) => {
    const updated = EverwishAdmin.markAsOpened(cardId);
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, status: "opened" } : c
      )
    );
    console.log(updated);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fff7f5] flex flex-col items-center py-10 px-3">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        💌 MySpace — Your Everwish Cards
      </h1>

      <div className="w-full max-w-2xl grid gap-5">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-pink-100"
          >
            {/* 🎞️ Mini preview */}
            <div className="w-full sm:w-1/3 relative">
              <video
                src={card.videoSrc}
                className="rounded-2xl w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* 📄 Info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-gray-700 font-medium">
                {card.message.length > 60
                  ? card.message.slice(0, 60) + "..."
                  : card.message}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Recipient: <b>{card.recipient}</b>
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(card.createdAt).toLocaleDateString()}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                  card.status === "opened"
                    ? "bg-green-100 text-green-700"
                    : card.status === "sent"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {card.status.toUpperCase()}
              </span>
            </div>

            {/* ⚙️ Acciones */}
            <div className="flex flex-col gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handleView(card)}
                className="rounded-full bg-purple-500 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-purple-600"
              >
                👀 View
              </button>
              {card.status !== "opened" && (
                <button
                  onClick={() => handleEdit(card)}
                  className="rounded-full bg-yellow-400 text-[#3b2b1f] px-4 py-2 text-sm font-semibold shadow hover:bg-yellow-300"
                >
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={() => handleReSend(card)}
                className="rounded-full bg-pink-200 text-pink-700 px-4 py-2 text-sm font-semibold shadow hover:bg-pink-300"
              >
                🔁 Re-send
              </button>
              {card.status !== "opened" && (
                <button
                  onClick={() => handleMarkOpened(card.id)}
                  className="rounded-full bg-green-100 text-green-700 px-4 py-2 text-sm font-semibold shadow hover:bg-green-200"
                >
                  ✅ Mark Opened
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {cards.length === 0 && (
          <p className="text-gray-400 text-center">
            You haven’t created any cards yet.  
            <Link href="/cards" className="underline text-purple-600">
              Create one now!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
      }
