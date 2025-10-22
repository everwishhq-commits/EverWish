"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/videos/index.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Filtrar videos que pertenezcan a la categoría
        const filtered = data.filter((v) =>
          (v.categories || []).some(
            (c) => c.toLowerCase().replace(/\s+/g, "-") === slug
          )
        );

        // 🔹 Identificar subcategorías dentro de la categoría
        const foundSubs = Array.from(
          new Set(filtered.map((v) => v.category).filter(Boolean))
        );
        setSubcategories(foundSubs);
        setVideos(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading videos:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-[#fff5f8]">
        <p className="animate-pulse text-lg">
          Loading Everwish cards for <b>{slug}</b>...
        </p>
      </main>
    );
  }

  const filteredVideos = videos.filter((v) =>
    v.object.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main
      className="flex flex-col items-center justify-start min-h-screen bg-[#fff5f8] text-gray-800 px-4 py-10 select-none touch-none"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer hover:text-pink-500"
        >
          Home
        </span>{" "}
        ›{" "}
        <span
          onClick={() => router.push("/categories")}
          className="cursor-pointer hover:text-pink-500"
        >
          Categories
        </span>{" "}
        ›{" "}
        <span className="text-gray-700 capitalize">
          {slug.replace("-", " ")}
        </span>
      </nav>

      {/* 🔙 Botón volver */}
      <button
        onClick={() => router.push("/categories")}
        className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
      >
        ← Back to Categories
      </button>

      {/* 🏷️ Encabezado */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-2 capitalize text-center">
        {slug.replace("-", " ")}
      </h1>
      <p className="text-gray-600 mb-10 text-center">
        Explore the celebrations and moments under this category ✨
      </p>

      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-10 rounded-full border border-pink-200 bg-white/70 px-4 py-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      {/* 🎨 Subcategorías */}
      {subcategories.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl w-full mb-12">
          {subcategories.map((sub, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() =>
                router.push(`/subcategory/${sub.toLowerCase().replace(/\s+/g, "-")}`)
              }
              className="cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 hover:shadow-lg p-6 flex flex-col items-center justify-center"
            >
              <span className="text-5xl mb-2">
                {getEmojiForSubcategory(sub)}
              </span>
              <span className="text-gray-800 font-semibold capitalize text-center">
                {sub}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🖼️ Grid de videos */}
      {filteredVideos.length === 0 ? (
        <p className="text-gray-500 text-center">No cards found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {filteredVideos.map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/edit/${video.name}`)}
              className="everwish-card cursor-pointer bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden hover:shadow-lg"
            >
              <video
                src={video.file}
                className="object-cover w-full h-auto aspect-[4/5]"
                playsInline
                loop
                muted
                disablePictureInPicture
                controls={false}
                controlsList="nodownload noremoteplayback nofullscreen"
              />
              <div className="text-center py-2 text-gray-700 font-semibold text-sm">
                {video.object}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

// 🌸 Emojis para subcategorías
function getEmojiForSubcategory(name) {
  const map = {
    halloween: "🎃",
    christmas: "🎄",
    thanksgiving: "🦃",
    "4th of july": "🦅",
    easter: "🐰",
    newyear: "🎆",
  };
  const key = name?.toLowerCase() || "";
  return map[key] || "✨";
}
