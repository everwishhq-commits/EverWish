"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const router = useRouter();

  // 🔹 Load cards from /api/videos
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setCards(data);
      } catch (e) {
        console.error("Error loading cards", e);
      }
    })();
  }, []);

  // 🔁 Infinite swipe / auto loop every 4s
  useEffect(() => {
    if (cards.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [cards]);

  if (cards.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Loading cards...</p>
      </div>
    );

  const current = cards[index];

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#fff8f5] overflow-hidden">
      <motion.div
        key={current.slug}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-80 h-80 rounded-3xl shadow-lg bg-white overflow-hidden cursor-pointer"
        onClick={() => router.push(`/edit/${current.slug}`)}
      >
        {current.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={current.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={current.src}
            alt={current.title}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>

      <p className="mt-6 text-gray-700 font-medium text-center px-6">
        {current.title || "Tap to view and customize your card ✨"}
      </p>
    </main>
  );
          }
