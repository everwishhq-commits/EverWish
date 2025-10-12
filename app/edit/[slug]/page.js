"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditCardPage() {
  const { slug } = useParams();
  const [message, setMessage] = useState("Have a pumpkin-tastic Halloween!");
  const [name, setName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [animation, setAnimation] = useState("none");
  const [preview, setPreview] = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#fff8f2] flex flex-col items-center justify-center p-6">
      {/* 💌 Tarjeta */}
      <div className="bg-white shadow-xl rounded-3xl p-6 max-w-md w-full relative overflow-hidden">
        {/* Animación decorativa */}
        {animation === "confetti" && (
          <div className="absolute inset-0 animate-pulse text-center text-3xl pointer-events-none">
            🎉🎊🎉
          </div>
        )}
        {animation === "hearts" && (
          <div className="absolute inset-0 animate-bounce text-center text-3xl pointer-events-none">
            ❤️💖💞
          </div>
        )}
        {animation === "sparkles" && (
          <div className="absolute inset-0 animate-pulse text-center text-3xl pointer-events-none">
            ✨🌟✨
          </div>
        )}

        {/* Imagen o espacio del usuario */}
        <div className="flex flex-col items-center mb-4">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="User"
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-200 shadow-md"
            />
          ) : (
            <label className="cursor-pointer text-sm text-pink-600 underline">
              Add your photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Mensaje editable */}
        {!preview ? (
          <>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full text-center text-gray-800 font-medium border rounded-md p-3 mb-3 bg-white/80"
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center border rounded-md p-2 mb-3 bg-white/80"
            />
            <select
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
              className="w-full border rounded-md p-2 mb-3 text-gray-700"
            >
              <option value="none">No animation</option>
              <option value="confetti">🎉 Confetti</option>
              <option value="hearts">❤️ Hearts</option>
              <option value="sparkles">✨ Sparkles</option>
            </select>
            <button
              onClick={() => setPreview(true)}
              className="bg-pink-500 text-white font-semibold py-3 w-full rounded-md hover:bg-pink-600 transition"
            >
              Preview ✨
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {message}
            </p>
            {name && (
              <p className="text-sm text-gray-500 mb-4">— {name}</p>
            )}
            <button
              onClick={() => setPreview(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => alert("Card ready to send 🎉")}
              className="bg-pink-500 text-white px-4 py-2 rounded-md"
            >
              Send 💌
            </button>
          </div>
        )}
      </div>

      {/* Descripción */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        You’re editing: <span className="font-semibold">{slug}</span>
      </p>
    </div>
  );
          }
