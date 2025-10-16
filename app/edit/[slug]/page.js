"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { defaultMessageFromSlug } from "@/lib/messages";

export default function EditCardPage({ params }) {
  const { slug } = params;
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Mensaje automático según la tarjeta seleccionada
    setMessage(defaultMessageFromSlug(slug));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col items-center justify-start pt-10 pb-20">
      {/* 📱 Tarjeta extendida centrada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-3xl shadow-lg w-[90%] max-w-md overflow-hidden"
      >
        {/* Imagen de la tarjeta */}
        <div className="w-full aspect-[4/5] bg-[#fdfdfd] flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt="Card preview"
              width={400}
              height={400}
              className="object-contain rounded-2xl"
            />
          ) : (
            <span className="text-gray-400 text-sm">🖼️ Card preview</span>
          )}
        </div>

        {/* Campo de texto del mensaje */}
        <div className="p-6 text-center">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-2xl p-3 text-gray-700 focus:outline-none resize-none text-center"
            rows={3}
          />
        </div>
      </motion.div>
    </div>
  );
                }
