"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const lastTouch = useRef(null);

  useEffect(() => {
    if (!open || !imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => draw(ctx, img, scale, offset);
    imageRef.current = img;
  }, [imageSrc, scale, offset, open]);

  const draw = (ctx, img, scale, offset) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const x = width / 2 - scaledW / 2 + offset.x;
    const y = height / 2 - scaledH / 2 + offset.y;
    ctx.drawImage(img, x, y, scaledW, scaledH);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 4, height / 4, width / 2, height / 2);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouch.current = { dist: Math.hypot(dx, dy) };
    }
  };

  const handleTouchMove = (e) => {
    if (!lastTouch.current || !imageRef.current) return;
    if (e.touches.length === 1 && lastTouch.current.x !== undefined) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastTouch.current.dist !== undefined) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      setScale((p) => Math.max(0.5, Math.min(3, p * (dist / lastTouch.current.dist))));
      lastTouch.current = { dist };
    }
  };

  const handleDone = () => {
    const canvas = canvasRef.current;
    onDone(canvas.toDataURL("image/jpeg"));
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-4 w-[92%] max-w-sm flex flex-col gap-3">
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="text-sm"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="rounded-xl touch-none bg-black"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          />
        )}

        <div className="flex justify-between gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-200 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              onClick={handleDone}
              className="flex-1 rounded-full bg-yellow-400 py-2 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
  }
