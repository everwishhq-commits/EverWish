"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StatsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await axios.get("/api/admin/stats");
    setStats(res.data || []);
  }

  return (
    <div className="p-6 bg-[#fff7f5] min-h-[100dvh]">
      <h2 className="text-2xl font-bold text-center text-[#ff6b81] mb-8">
        📊 Métricas y Estadísticas
      </h2>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow">
        {stats.length === 0 && <p>No hay estadísticas disponibles aún.</p>}
        {stats.map((row) => (
          <div
            key={row.card_id}
            className="border-b py-4 flex justify-between items-center"
          >
            <span className="font-semibold">{row.slug}</span>
            <span>👀 {row.views} vistas</span>
            <span>📨 {row.sends} envíos</span>
            <span>💬 {row.comments} comentarios</span>
          </div>
        ))}
      </div>
    </div>
  );
              }
