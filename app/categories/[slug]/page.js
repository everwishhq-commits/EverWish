"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CategoryVideosPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Starting fetch...");
  const [query, setQuery] = useState("");

  function detectCategory(filename) {
    const s = filename.toLowerCase();
    if (s.includes("halloween")) return "halloween";
    if (s.includes("christmas") || s.includes("xmas")) return "christmas";
    if (s.includes("birthday")) return "birthday";
    if (s.includes("love") || s.includes("valentine")) return "valentines";
    return "general";
  }

  useEffect(() => {
    async function fetchVideos() {
      try {
        setStatus("Fetching videos from API...");
        const isClient = typeof window !== "undefined";
        const baseUrl = isClient
          ? window.location.origin
          : process.env.NEXT_PUBLIC_BASE_URL || "https://everwish.cards";

        const url = `${baseUrl}/api/videos`;
        setStatus(`Connecting to: ${url}`);

        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          setStatus(`❌ API error: ${res.status}`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStatus(`✅ Data loaded. Total: ${data.all?.length || 0}`);

        const allVideos = data.all || [];
        const filtered = allVideos.filter((v) => {
          const cats = v.categories || [detectCategory(v.title)];
          return cats.includes(slug.toLowerCase());
        });

        setVideos(filtered);
      } catch (err) {
        setStatus(`❌ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-gray-700 text-center p-6">
        <h1 className="text-2xl font-bold mb-3">Loading {slug}...</h1>
        <p>{status}</p>
      </main>
    );
  }

  if (!videos.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white text-gray-700 text-center">
        <h1 className="text-3xl font-bold mb-4 capitalize">{slug}</h1>
        <p>{status}</p>
        <p>No videos found in this category 🎥</p>
        <Link href="/categories" className="mt-4 text-pink-500 underline">
          ← Back to Categories
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <Link href="/categories" className="text-pink-500 hover:underline">
          ← Back to Categories
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent capitalize">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-gray-700 text-lg">
          {status} — Showing {videos.length} videos ✨
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((v, i) => (
          <Link
            key={i}
            href={v.editUrl || `/edit/${v.slug}`}
            className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
          >
            <div className="relative w-full aspect-[4/5]">
              <video
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 rounded-3xl"></div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <p className="text-sm font-semibold text-white drop-shadow-md truncate">
                  {v.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
      }
