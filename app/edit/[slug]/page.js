"use client";

import { useEffect, useState } from "react";

export default function EditPage({ params }) {
  const { slug } = params;
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function loadVideo() {
      const res = await fetch("/api/videos");
      const data = await res.json();
      const videos = data.videos || data || [];
      const found = videos.find((v) => v.slug === slug || v.name === slug);
      setMatch(found || null);
    }
    loadVideo();
  }, [slug]);

  if (!match) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fff7f5]">
        <p className="text-gray-500">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fff7f5] overflow-hidden">
      <video
        src={match.file}
        autoPlay
        loop
        muted
        playsInline
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        className="max-w-full max-h-full rounded-2xl shadow-lg object-contain bg-pink-50"
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      />
    </div>
  );
}
