import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  // 🔹 Cargar todos los videos para buscar coincidencias
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-store" });
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("❌ Error loading videos:", err);
      }
    }
    loadData();
  }, []);

  // 🔍 Conecta búsqueda con categorías/subcategorías
  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim().toLowerCase();
    if (!term) return;

    // Buscar coincidencia entre los campos relevantes
    const found = videos.find((v) =>
      [v.object, v.category, v.subcategory, ...(v.categories || [])]
        .filter(Boolean)
        .some((txt) => txt.toLowerCase().includes(term))
    );

    if (found) {
      const mainCategory =
        (found.categories && found.categories[0]) ||
        found.category ||
        found.subcategory;

      if (mainCategory) {
        router.push(`/category/${mainCategory.toLowerCase().replace(/\s+/g, "-")}`);
      } else {
        alert("No related category found.");
      }
    } else {
      alert(`No matches found for: "${term}"`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 🔍 Barra de búsqueda funcional */}
      <form onSubmit={handleSearch} className="w-full flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search any theme — e.g. yeti, turtle, love..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 md:w-96 px-4 py-3 rounded-full border border-pink-200 bg-white/80 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
        />
      </form>

      {/* 👇 Aquí va el resto de tus categorías ya existentes */}
      {/* (no toques lo que ya tienes debajo: los íconos, grid, etc.) */}
    </div>
  );
}
