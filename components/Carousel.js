"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Carousel() {
  // 🎞️ Datos de prueba embebidos (sin API)
  const [videos, setVideos] = useState([
    {
      slug: "pumpkin_halloween_1A",
      src: "/videos/pumpkin_halloween_1A.mp4",
      name: "Pumpkin Halloween",
      category: "Halloween",
    },
    {
      slug: "ghost_halloween_1A",
      src: "/videos/ghost_halloween_1A.mp4",
      name: "Ghost Halloween",
      category: "Halloween",
    },
    {
      slug: "unicorn_birthday_1A",
      src: "/videos/unicorn_birthday_1A.mp4",
      name: "Unicorn Birthday",
      category: "Birthday",
    },
    {
      slug: "elephant_baby_1A",
      src: "/videos/elephant_baby_1A.mp4",
      name: "Elephant Baby",
      category: "Baby Shower",
    },
    {
      slug: "love_besos_abrazos_1A",
      src: "/videos/love_besos_abrazos_1A.mp4",
      name: "Besos y Abrazos",
      category: "Love",
    },
  ]);

  const [current, setCurrent] = useState(0);

  // ⏱️ Rotación automática cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [videos.length]);

  if (!videos || videos.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-lg bg-white">
      {videos.map((video, index) => (
        <motion.div
          key={video.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[240px] sm:h-[320px] object-cover rounded-3xl"
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-gray-700 bg-white/70 py-2">
            <p className="font-semibold">{video.name}</p>
            <p className="text-sm text-gray-500">{video.category}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
        }
