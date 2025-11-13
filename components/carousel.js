"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FullscreenPreview from "./fullscreen-preview";

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  // Para detectar taps y swipes
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const direction = useRef(null);

  const TAP_THRESHOLD = 10;
  const SWIPE_THRESHOLD = 40;

  // Autoplay cada 5s
  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (!pauseRef.current && videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  // Cargar videos desde /public/videos/index.json
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const allVideos = data.videos || [];

        setVideos(allVideos.slice(0, 10));
      } catch (err) {
        console.error("Error cargando videos:", err);
      }
    }

    loadVideos();
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [videos]);

  // TOUCH START
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    moved.current = false;
    direction.current = null;

    pauseRef.current = true;
    clearInterval(autoplayRef.current);
  };

  // TOUCH MOVE
  const handleTouchMove = (e) => {
    const t = e.touches[0];
    const deltaX = t.clientX - startX.current;
    const deltaY = t.clientY - startY.current;

    if (Math.abs(deltaX) > TAP_THRESHOLD || Math.abs(deltaY) > TAP_THRESHOLD) {
      moved.current = true;
      direction.current =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      e.stopPropagation();
    }
  };

  // TOUCH END
  const handleTouchEnd = (e) => {
    e.stopPropagation();

    if (!moved.current) {
      // TAPPED CARD
      const tapped = videos[index];
      if (tapped) handleClick(tapped);
    } else if (direction.current === "horizontal") {
      // SWIPE
      const diffX = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        setIndex((prev) =>
          diffX > 0
            ? (prev + 1) % videos.length
            : (prev - 1 + videos.length) % videos.length
        );
      }
    }

    setTimeout(() => {
      pauseRef.current = false;
      startAutoplay();
    }, 3000);
  };

  // CLICK VIDEO
  const handleClick = (video) => {
    const slug = video.slug || video.name;

    if (window.innerWidth >= 1024) {
      // PC → Preview fullscreen
      setPreviewData({
        videoSrc: video.file,
        slug,
      });
      setShowPreview(true);
    } else {
      // Mobile → directo a editar
      router.push(`/edit/${slug}`);
    }
  };

  // MIENTRAS CARGA
  if (videos.length === 0) {
    return (
      <div className="w-full flex justify-center items-center h-[440px]">
        <p className="text-gray-400 text-lg">Loading carousel...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
        {/* CARRUSEL */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            const current = videos[index];
            if (current) handleClick(current);
          }}
          className="relative w-full max-w-5xl flex justify-center items-center h-[440px] cursor-pointer"
          style={{ touchAction: "pan-y" }}
        >
          {videos.map((video, i) => {
            const offset = (i - index + videos.length) % videos.length;

            const positionClass =
              offset === 0
                ? "translate-x-0 scale-100 z-20 opacity-100"
                : offset === 1
                ? "translate-x-full scale-90 z-10 opacity-50"
                : offset === videos.length - 1
                ? "-translate-x-full scale-90 z-10 opacity-50"
                : "opacity-0 z-0";

            return (
              <div
                key={i}
                className={`absolute transition-all duration-500 ease-in-out ${positionClass}`}
              >
                <video
                  src={video.file}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controlsList="nodownload noplaybackrate"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-pink-50 overflow-hidden pointer-events-none"
                />
              </div>
            );
          })}
        </div>

        {/* DOTS */}
        <div className="flex mt-5 gap-2">
          {videos.map((_, i) => (
            <span
              key={i}
              onClick={() => {
                setIndex(i);
                pauseRef.current = true;
                clearInterval(autoplayRef.current);

                setTimeout(() => {
                  pauseRef.current = false;
                  startAutoplay();
                }, 3000);
              }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === index ? "bg-pink-500 scale-125" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* PREVIEW FULLSCREEN SOLO PC */}
      {showPreview && previewData && (
        <FullscreenPreview
          videoSrc={previewData.videoSrc}
          slug={previewData.slug}
        />
      )}
    </>
  );
        }
