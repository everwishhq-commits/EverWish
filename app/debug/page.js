"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DebugVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("thanksgiving");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const data = await res.json();
        console.log("📦 Data from API:", data);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
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

  const bySubcategory = {};
  videos.forEach(v => {
    const sub = v.subcategory || "Unknown";
    if (!bySubcategory[sub]) bySubcategory[sub] = [];
    bySubcategory[sub].push(v);
  });

  const testSubcategoryPage = (subcategory) => {
    const slug = subcategory.toLowerCase().replace(/\s+/g, "-");
    console.log(`🔗 Testing navigation to: /subcategory/${slug}`);
    router.push(`/subcategory/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">🔍 Video Debug</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Home
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm">Total Videos</p>
            <p className="text-3xl font-bold">{videos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm">Subcategories</p>
            <p className="text-3xl font-bold">{Object.keys(bySubcategory).length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm">Match "{searchTerm}"</p>
            <p className="text-3xl font-bold">{filtered.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🔎 Search</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border rounded-lg p-3 mb-4"
        />
        <p className="mb-4">Found <strong>{filtered.length}</strong> videos</p>
        
        {filtered.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filtered.map((v, i) => (
              <div key={i} className="bg-pink-50 p-4 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold">{v.name}</p>
                  <button
                    onClick={() => router.push(`/edit/${v.name}`)}
                    className="px-3 py-1 bg-pink-500 text-white text-sm rounded hover:bg-pink-600"
                  >
                    Open →
                  </button>
                </div>
                <p className="text-sm">Subcategory: <strong>{v.subcategory}</strong></p>
                <p className="text-sm">Category: {v.category}</p>
                <p className="text-sm">Categories: {v.categories?.join(", ")}</p>
                <p className="text-xs text-gray-600">Tags: {v.tags?.slice(0, 8).join(", ")}</p>
                <p className="text-xs text-gray-400 mt-1">File: {v.file}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded">
            <p>⚠️ No videos found for "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📂 All Subcategories (Click to test)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(bySubcategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([sub, vids]) => (
              <div 
                key={sub} 
                className="bg-pink-50 p-3 rounded cursor-pointer hover:bg-pink-100 border-2 border-transparent hover:border-pink-300 transition-all"
                onClick={() => testSubcategoryPage(sub)}
              >
                <p className="font-semibold text-sm">{sub}</p>
                <p className="text-xs text-gray-600">{vids.length} videos</p>
                <p className="text-xs text-blue-500 mt-1">
                  → /subcategory/{sub.toLowerCase().replace(/\s+/g, "-")}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Subcategory URLs</h2>
        <div className="space-y-2">
          <button
            onClick={() => router.push("/subcategory/thanksgiving")}
            className="w-full px-4 py-3 bg-orange-100 hover:bg-orange-200 rounded-lg text-left"
          >
            Test: <strong>/subcategory/thanksgiving</strong>
          </button>
          <button
            onClick={() => router.push("/subcategory/christmas")}
            className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 rounded-lg text-left"
          >
            Test: <strong>/subcategory/christmas</strong>
          </button>
          <button
            onClick={() => router.push("/subcategory/dogs-cats")}
            className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-left"
          >
            Test: <strong>/subcategory/dogs-cats</strong>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📄 First 3 Videos (Raw JSON)</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(videos.slice(0, 3), null, 2)}
        </pre>
      </div>
    </div>
  );
      }
