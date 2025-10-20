"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Deducción de categoría por nombre de archivo/título si la API no trae `categories`
function detectCategory(str = "") {
  const s = String(str).toLowerCase();
  if (s.includes("halloween")) return "halloween";
  if (s.includes("christmas") || s.includes("xmas")) return "christmas";
  if (s.includes("valentine") || s.includes("love")) return "valentines";
  if (s.includes("birthday")) return "birthday";
  if (s.includes("mother")) return "mothers-day";
  if (s.includes("father")) return "fathers-day";
  if (s.includes("easter")) return "easter";
  if (s.includes("wedding")) return "wedding";
  if (s.includes("anniversary")) return "anniversary";
  if (s.includes("thanksgiving")) return "thanksgiving";
  if (s.includes("newyear")) return "new-year";
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return "pets";
  return "general";
}

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.all || [];

        // Normaliza: asegura slug/editUrl/categories
        const normalized = all.map((v) => {
          const safeSlug =
            v.slug ||
            String(v.title || "")
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^\w\-]+/g, "");
          const cats = v.categories && v.categories.length
            ? v.categories.map((c) => c.toLowerCase())
            : [detectCategory(v.title || safeSlug)];
          return {
            title: v.title || safeSlug,
            slug: safeSlug,
            src: v.src,
            categories: cats,
            editUrl: v.editUrl || `/edit/${safeSlug}`,
          };
        });

        const filtered = normalized.filter(
          (v) =>
            v.categories.includes(String(slug).toLowerCase()) ||
            v.title.toLowerCase().includes(String(slug).toLowerCase()) ||
            v.slug.toLowerCase().includes(String(slug).toLowerCase())
        );

        if (mounted) setVideos(filtered);
      } catch (e) {
        console.error("Error loading videos:", e);
        if (mounted) setVideos([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Búsqueda local
  const filtered = useMemo(
    () =>
      videos.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
      ),
    [videos, search]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-center px-4 pt-24 pb-16">
      {/* Back */}
      <Link
        href="/categories"
        className="text-pink-500 hover:underline text-sm font-medium"
      >
        ← Back to Categories
      </Link>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-extrabold mt-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
        {String(slug).replaceAll("-", " ")}
      </h1>

      <p className="text-gray-600 mt-2 mb-8">
        Discover beautiful Everwish cards for {String(slug).replaceAll("-", " ")} ✨
      </p>

      {/* Search */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-full border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-sm text-gray-700"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center items-start max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <p className="col-span-full text-gray-400 italic">
            No cards found for this category yet.
          </p>
        ) : (
          filtered.map((video, i) => (
            <Link
              key={`${video.slug}-${i}`}
              href={video.editUrl}
              className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
              aria-label={`Open ${video.title}`}
              title={video.title}
            >
              <div className="relative w-full aspect-[4/5]">
                <video
                  src={video.src}
                  // iOS: evita fullscreen automático
                  playsInline
                  // autoplay silencioso como el carrusel
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  // Bloqueos de descarga
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
                {/* Overlay invisible para bloquear long-press */}
                <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()} />
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
            }
