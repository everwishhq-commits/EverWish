"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditPage() {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);

  // Cargar el video correcto
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        const allVideos = Array.isArray(data) ? data : data.all || [];
        const match = allVideos.find((v) => v.slug === slug);
        setVideo(match);
      } catch (err) {
        console.error("Error loading video:", err);
      }
    }
    loadVideo();
  }, [slug]);

  // Forzar pantalla completa cuando el usuario toca
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  if (!video) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50 text-gray-500">
        Loading card...
      </main>
    );
  }

  return (
    <main
      className="min-h-screen w-screen bg-black flex items-center justify-center overflow-hidden fixed top-0 left-0"
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={enterFullscreen}
      onClick={enterFullscreen}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          src={video.src}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-contain bg-black select-none pointer-events-none"
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          style={{
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        />
      </div>
      <style jsx global>{`
        video::-internal-media-controls-download-button {
          display: none;
        }
        video::-webkit-media-controls-enclosure {
          overflow: hidden !important;
        }
        video::-webkit-media-controls-panel {
          display: none !important;
          opacity: 0 !important;
        }
      `}</style>
    </main>
  );
        }
