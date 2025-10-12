"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRelatedName } from "../../lib/naming";

export default function CardPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (slug) {
      setVideoSrc(`/videos/${slug}.mp4`);
    }
  }, [slug]);

  const handlePersonalize = () => {
    const nextSlug = getRelatedName(slug, "1B");
    router.push(`/edit/${nextSlug}`);
  };

  const handleSend = () => {
    const nextSlug = getRelatedName(slug, "1B");
    router.push(`/share/${nextSlug}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf5] p-6">
      <div className="w-full max-w-md rounded-3xl shadow-lg overflow-hidden">
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          />
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePersonalize}
          className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow hover:bg-pink-600 transition"
        >
          Personalize
        </button>
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full shadow hover:bg-gray-200 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
            }
