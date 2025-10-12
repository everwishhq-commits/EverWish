"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getRelatedName } from "../../lib/naming";

export default function EditCardPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  const [videoSrc, setVideoSrc] = useState("");
  const [message, setMessage] = useState("Wishing you a magical moment!");
  const [name, setName] = useState("");

  useEffect(() => {
    if (slug) {
      const base = slug.replace(/_1B$/, "_1A");
      setVideoSrc(`/videos/${base}.mp4`);
    }
  }, [slug]);

  const handleSend = () => {
    router.push(`/share/${slug}?msg=${encodeURIComponent(message)}&name=${encodeURIComponent(name)}`);
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

      <div className="w-full max-w-md mt-6 bg-white p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-semibold mb-3">Customize your message ✨</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-24 p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          onClick={handleSend}
          className="w-full py-3 bg-pink-500 text-white font-semibold rounded-full shadow hover:bg-pink-600 transition"
        >
          Preview & Send
        </button>
      </div>
    </main>
  );
            }
