"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SharePage({ params }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const [videoSrc, setVideoSrc] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (slug) {
      // el slug original sin “_1B” para mostrar el video
      const base = slug.replace(/_1B$/, "_1A");
      setVideoSrc(`/videos/${base}.mp4`);
    }

    // recuperar mensaje y nombre de la URL
    const msg = searchParams.get("msg");
    const sender = searchParams.get("name");

    if (msg) setMessage(decodeURIComponent(msg));
    if (sender) setName(decodeURIComponent(sender));
  }, [slug, searchParams]);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💌 Your Everwish</h2>
        <p className="text-lg text-gray-700 mb-4 whitespace-pre-line">{message}</p>

        {name && (
          <p className="text-sm text-gray-500 italic">— From {name}</p>
        )}

        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow hover:bg-pink-600 transition"
          >
            Replay Animation
          </button>
        </div>
      </div>
    </main>
  );
              }
