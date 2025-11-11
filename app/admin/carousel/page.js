import { useState, useEffect } from "react";

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth();
  if (month === 9) return "halloween";
  if (month === 10) return "thanksgiving";
  if (month === 11) return "christmas";
  if (month === 1) return "valentines";
  if (month === 6) return "july4";
  return "general";
}

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

function loadCarouselConfig() {
  try {
    const stored = localStorage.getItem("everwish_carousel_config");
    return stored ? JSON.parse(stored) : { videos: {}, lastRotation: Date.now() };
  } catch {
    return { videos: {}, lastRotation: Date.now() };
  }
}

function saveCarouselConfig(config) {
  try {
    localStorage.setItem("everwish_carousel_config", JSON.stringify(config));
  } catch (err) {
    console.error("Error:", err);
  }
}

export default function CarouselAdminPanel() {
  const [allVideos, setAllVideos] = useState([]);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const data = await res.json();
      const videos = (data.videos || []).map(v => ({
        ...v,
        score: calculateVideoScore(v),
      }));
      
      videos.sort((a, b) => b.score - a.score);
      setAllVideos(videos);

      const cfg = loadCarouselConfig();
      setConfig(cfg);

      const active = Object.entries(cfg.videos).filter(([_, info]) => info.active);
      const pending = videos.filter(v => !cfg.videos[v.name]?.active);
      const lastRotation = cfg.lastRotation || 0;
      const hoursSince = (Date.now() - lastRotation) / (1000 * 60 * 60);
      
      setStats({
        active: active.length,
        pending: pending.length,
        nextRotation: Math.max(0, 24 - hoursSince),
        currentSeason: getCurrentSeason(),
      });
    } catch (err) {
      console.error("Error:", err);
    }
  }

  function forceVideo(videoName) {
    const now = Date.now();
    const newConfig = { ...config };
    
    newConfig.videos[videoName] = {
      active: true,
      addedAt: now,
      forced: true,
      forcedAt: now,
    };
    
    const activeVideos = Object.entries(newConfig.videos)
      .filter(([_, info]) => info.active)
      .sort((a, b) => {
        if (a[1].forced && !b[1].forced) return 1;
        if (!a[1].forced && b[1].forced) return -1;
        return a[1].addedAt - b[1].addedAt;
      });
    
    if (activeVideos.length > 10) {
      const [oldestName, _] = activeVideos[0];
      newConfig.videos[oldestName] = {
        ...newConfig.videos[oldestName],
        active: false,
        removedAt: now,
      };
    }
    
    saveCarouselConfig(newConfig);
    setConfig(newConfig);
    loadData();
    alert(`✅ ${videoName} agregado al carrusel inmediatamente`);
  }

  function removeVideo(videoName) {
    const newConfig = { ...config };
    newConfig.videos[videoName] = {
      ...newConfig.videos[videoName],
      active: false,
      removedAt: Date.now(),
    };
    
    saveCarouselConfig(newConfig);
    setConfig(newConfig);
    loadData();
    alert(`🗑️ ${videoName} removido del carrusel`);
  }

  function resetCarousel() {
    if (!confirm("¿Resetear el carrusel completamente?")) return;
    
    const newConfig = {
      videos: {},
      lastRotation: Date.now(),
      version: "1.0",
    };
    
    saveCarouselConfig(newConfig);
    setConfig(newConfig);
    loadData();
    alert("✅ Carrusel reseteado");
  }

  const filteredVideos = allVideos.filter(v => {
    if (filter === "active") return config?.videos[v.name]?.active;
    if (filter === "pending") return !config?.videos[v.name]?.active;
    if (filter === "forced") return config?.videos[v.name]?.forced;
    return true;
  });

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#fff7f5] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f5] p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 text-center">
          🎡 Administrador del Carrusel
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Gestiona los 10 videos destacados del carrusel principal
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-pink-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Videos Activos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">En Espera</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-600">{Math.round(stats.nextRotation)}h</p>
            <p className="text-sm text-gray-600">Próxima Rotación</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.currentSeason}</p>
            <p className="text-sm text-gray-600">Temporada Actual</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full font-semibold ${
                filter === "all" ? "bg-pink-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              Todos ({allVideos.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-full font-semibold ${
                filter === "active" ? "bg-green-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              Activos ({stats.active})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full font-semibold ${
                filter === "pending" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              Pendientes ({stats.pending})
            </button>
          </div>

          <button
            onClick={resetCarousel}
            className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold hover:bg-red-200"
          >
            🔄 Resetear Carrusel
          </button>
        </div>

        {/* Lista de Videos */}
        <div className="space-y-3">
          {filteredVideos.map((video, i) => {
            const isActive = config?.videos[video.name]?.active;
            const isForced = config?.videos[video.name]?.forced;
            const addedAt = config?.videos[video.name]?.addedAt;

            return (
              <div
                key={i}
                className={`bg-white rounded-xl p-4 shadow-md border-2 ${
                  isActive ? "border-green-400" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Video Preview */}
                  <video
                    src={video.file}
                    className="w-20 h-28 rounded-lg object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{video.object || video.name}</h3>
                    <div className="flex gap-2 text-xs mb-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Score: {video.score}
                      </span>
                      {video.subcategory && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {video.subcategory}
                        </span>
                      )}
                      {isForced && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          ⚡ Forzado
                        </span>
                      )}
                      {isActive && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          ✅ Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      👁️ {video.views || 0} · 🛒 {video.purchases || 0} · ⭐ {video.votes || 0}
                    </p>
                    {addedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Agregado: {new Date(addedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {isActive ? (
                      <button
                        onClick={() => removeVideo(video.name)}
                        className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold hover:bg-red-200 text-sm"
                      >
                        🗑️ Remover
                      </button>
                    ) : (
                      <button
                        onClick={() => forceVideo(video.name)}
                        className="px-4 py-2 rounded-full bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-300 text-sm"
                      >
                        ⚡ Agregar Ya
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">No hay videos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
