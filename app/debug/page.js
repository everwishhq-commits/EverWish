"use client";
import { useEffect, useState } from "react";

export default function DebugVideosPage() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("thanksgiving");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    load();
  }, []);

  const filtered = videos.filter(v => {
    const searchable = [
      v.name,
      v.object,
      v.subcategory,
      v.category,
      ...(v.categories || []),
      ...(v.tags || [])
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchable.includes(searchTerm.toLowerCase());
  });

  // Agrupar por subcategoría
  const bySubcategory = {};
  videos.forEach(v => {
    const sub = v.subcategory || "Unknown";
    if (!bySubcategory[sub]) bySubcategory[sub] = [];
    bySubcategory[sub].push(v);
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔍 Video Debug Tool</h1>
      
      {/* Stats */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Videos</p>
            <p className="text-3xl font-bold text-blue-600">{videos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Subcategories</p>
            <p className="text-3xl font-bold text-green-600">{Object.keys(bySubcategory).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">Match "{searchTerm}"</p>
            <p className="text-3xl font-bold text-purple-600">{filtered.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🔎 Search Test</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border rounded-lg p-3 mb-4"
        />
        <p className="text-sm text-gray-600 mb-2">Found {filtered.length} videos</p>
        
        {filtered.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map((v, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-bold">{v.name}</p>
                <p className="text-gray-600">Subcategory: {v.subcategory}</p>
                <p className="text-gray-600">Categories: {v.categories?.join(", ")}</p>
                <p className="text-gray-500 text-xs">Tags: {v.tags?.slice(0, 5).join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Subcategories */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📂 All Subcategories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(bySubcategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([sub, vids]) => (
              <div key={sub} className="bg-pink-50 p-3 rounded">
                <p className="font-semibold text-sm">{sub}</p>
                <p className="text-xs text-gray-600">{vids.length} videos</p>
              </div>
            ))}
        </div>
      </div>

      {/* Raw JSON (first 3 videos) */}
      <div className="bg-white rounded-xl p-6 mt-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📄 Sample Data (First 3 Videos)</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(videos.slice(0, 3), null, 2)}
        </pre>
      </div>
    </div>
  );
}
