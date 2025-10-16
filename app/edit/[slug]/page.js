"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function EditCardPage() {
  const { slug } = useParams();
  const [step, setStep] = useState("expanded"); // "expanded" → "edit"
  const [progress, setProgress] = useState(0);

  // Simulación de imágenes según slug
  const cardImages = {
    "mother-day": "/cards/mother-day.jpg",
    "easter-bunny": "/cards/easter-bunny.jpg",
    "zombie-birthday": "/cards/zombie-birthday.jpg",
  };

  // Mensajes automáticos según tarjeta
  const defaultMessages = {
    "mother-day": "Celebrate this moment with a smile. Wishing you peace and light. ✨",
    "easter-bunny": "Hop into happiness and share joy this Easter! 🐰",
    "zombie-birthday": "Have a zombie-licious birthday! 🧁",
  };

  // Barra de carga y transición automática
  useEffect(() => {
    if (step === "expanded") {
      let progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setStep("edit");
            return 100;
          }
          return prev + 2;
        });
      }, 60); // 60 ms × 50 ≈ 3 s
    }
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50">
      {/* Pantalla extendida */}
      {step === "expanded" && (
        <div className="relative bg-white w-[90%] max-w-md rounded-3xl shadow-xl overflow-hidden transition-all duration-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-pink-100">
            <div
              className="h-full bg-pink-400 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="p-6 flex flex-col items-center justify-center text-center">
            <Image
              src={cardImages[slug] || "/placeholder.png"}
              alt="Card preview"
              width={320}
              height={320}
              className="rounded-2xl shadow-md mb-4"
            />
            <p className="text-gray-500 text-sm italic">
              Expanding your Everwish moment...
            </p>
          </div>
        </div>
      )}

      {/* Pantalla de edición */}
      {step === "edit" && (
        <div className="bg-white rounded-3xl shadow-lg w-[90%] max-w-md p-6 flex flex-col items-center text-center transition-all duration-700">
          <Image
            src={cardImages[slug] || "/placeholder.png"}
            alt="Card preview"
            width={320}
            height={320}
            className="rounded-2xl shadow-md mb-4"
          />
          <h3 className="font-semibold text-gray-700 mb-2">
            Customize your message ✨
          </h3>
          <textarea
            readOnly
            className="w-full p-3 border rounded-xl text-gray-600 text-center resize-none"
            value={defaultMessages[slug] || "Your Everwish message goes here ✨"}
          />
        </div>
      )}
    </div>
  );
                }
