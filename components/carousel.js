import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 📅 DETECTAR TEMPORADA ACTUAL
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if (month === 9) return "halloween";
  if (month === 10) {
    const thanksgiving = getNthThursday(now.getFullYear(), 10, 4);
    if (day >= thanksgiving.getDate() - 7 && day <= thanksgiving.getDate() + 3) {
      return "thanksgiving";
    }
  }
  if (month === 11) return "christmas";
  if (month === 1) return "valentines";
  if (month === 2 || month === 3) return "easter";
  if (month === 6) return "july4";
  return "general";
}

function getNthThursday(year, month, n) {
  const firstDay = new Date(year, month, 1);
  const firstThursday = 1 + ((11 - firstDay.getDay()) % 7);
  return new Date(year, month, firstThursday + (n - 1) * 7);
}

// 🎯 CALCULAR SCORE
function calculateVideoScore(video) {
  let score = 0;
  const currentSeason = getCurrentSeason();
  const videoCategories = [
    video.name?.toLowerCase(),
    video.subcategory?.toLowerCase(),
    ...(video.tags || []).map(t => t.toLowerCase()),
  ].join(" ");
  
  if (videoCategories.includes(currentSeason)) score += 50;
  
  const views = video.views || 0;
  const purchases = video.purchases || 0;
  const votes = video.votes || 0;
  score += Math.min(30, (purchases * 5 + votes * 2 + views * 0.1));
  
  const createdAt = new Date(video.createdAt || video.uploadedAt || Date.now());
  const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 7) score += 20;
  else if (daysSinceCreated < 30) score += 10;
  
  return score;
}

// 💾 CONFIGURACIÓN
function loadCarouselConfig() {
  if (typeof window === "undefined") return { videos: {}, lastRotation: Date.now() };
  try {
    const stored = localStorage.getItem("everwish_carousel_config");
    return stored ? JSON.parse(stored) : { videos: {}, lastRotation: Date.now() };
  } catch {
    return { videos: {}, lastRotation: Date.now() };
  }
}

function saveCarouselConfig(config) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("everwish_carousel_config", JSON.stringify(config));
  } catch (err) {
    console.error("Error guardando config:", err);
  }
}

// 🔄 ROTACIÓN
function applyRotation(allVideos, config) {
  const now = Date.now();
  const currentActive = Object.entries(config.videos)
    .filter(([_, info]) => info.active)
    .map(([name, info]) => ({
      name,
      ...info,
      video: allVideos.find(v => v.name === name),
    }))
    .filter(item => item.video)
    .sort((a, b) => a.addedAt - b.addedAt);
  
  const candidates = allVideos.filter(v => !config.videos[v.name]?.active);
  
  const lastRotation = config.lastRotation || 0;
  const hoursSinceRotation = (now - lastRotation) / (1000 * 60 * 60);
  
  if (hoursSinceRotation >= 24 && candidates.length > 0 && currentActive.length >= 10) {
    const oldestVideo = currentActive[0];
    const newVideo = candidates[0];
    
    config.videos[oldestVideo.name] = { ...config.videos[oldestVideo.name], active: false, removedAt: now };
    config.videos[newVideo.name] = { active: true, addedAt: now, forced: false };
    config.lastRotation = now;
    saveCarouselConfig(config);
    
    currentActive.shift();
    currentActive.push({ name: newVideo.name, active: true, addedAt: now, video: newVideo });
  }
  
  while (currentActive.length < 10 && candidates.length > 0) {
    const newVideo = candidates.shift();
    config.videos[newVideo.name] = { active: true, addedAt: now, forced: false };
    currentActive.push({ name: newVideo.name, active: true, addedAt: now, video: newVideo });
  }
  
  saveCarouselConfig(config);
  return currentActive.map(item => item.video);
}

export default function Carousel() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState(null);
  const autoplayRef = useRef(null);
  const pauseRef = useRef(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const direction = useRef(null);

  const TAP_THRESHOLD = 10;
  const SWIPE_THRESHOLD = 40;

  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    if (!pauseRef.current && videos.length > 0) {
      autoplayRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const allVideos = data.videos || [];

        const config = loadCarouselConfig();
        const videosWithScore = allVideos.map(v => ({
          ...v,
          score: calculateVideoScore(v),
        }));
        
        videosWithScore.sort((a, b) => b.score - a.score);
        const activeVideos = applyRotation(videosWithScore, config);
        
        setVideos(activeVideos);

        // Estadísticas
        const active = Object.values(config.videos).filter(v => v.active).length;
        const lastRotation = config.lastRotation || 0;
        const hoursSinceRotation = (Date.now() - lastRotation) / (1000 * 60 * 60);
        const nextRotationIn = Math.max(0, 24 - hoursSinceRotation);
        
        setStats({
          active,
          nextRotationIn: Math.round(nextRotationIn * 10) / 10,
          currentSeason: getCurrentSeason(),
        });
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

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    moved.current = false;
    direction.current = null;
    pauseRef.current = true;
    clearInterval(autoplayRef.current);
  };

  const handleTouchMove = (e) => {
    const t = e.touches[0];
    const deltaX = t.clientX - startX.current;
    const deltaY = t.clientY - startY.current;

    if (Math.abs(deltaX) > TAP_THRESHOLD || Math.abs(deltaY) > TAP_THRESHOLD) {
      moved.current = true;
      direction.current = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();

    if (!moved.current) {
      const tapped = videos[index];
      const slugToUse = tapped?.slug || tapped?.name;
      if (slugToUse) handleClick(slugToUse);
    } else if (direction.current === "horizontal") {
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

  const handleClick = async (slug) => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      await new Promise((r) => setTimeout(r, 150));
      router.push(`/edit/${slug}`);
    } catch {
      router.push(`/edit/${slug}`);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="w-full flex justify-center items-center h-[440px]">
        <p className="text-gray-400 text-lg">Loading carousel...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12 overflow-hidden select-none">
      {/* Estadísticas del carrusel */}
      {stats && (
        <div className="mb-4 text-center text-sm text-gray-600">
          <p>🎡 {stats.active} videos activos · 🌍 Temporada: <b>{stats.currentSeason}</b></p>
          <p>⏰ Próxima rotación en <b>{stats.nextRotationIn}h</b></p>
        </div>
      )}

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl flex justify-center items-center h-[440px]"
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
                className="w-[300px] sm:w-[320px] md:w-[340px] h-[420px] aspect-[4/5] rounded-2xl shadow-lg object-cover object-center bg-pink-50 overflow-hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Dots */}
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
  );
    }
