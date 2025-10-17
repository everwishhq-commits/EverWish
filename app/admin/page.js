"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#fff7f5] p-10">
      <h1 className="text-4xl font-bold text-[#ff6b81] mb-8">
        💼 Everwish Admin Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 max-w-3xl w-full">
        <Link
          href="/admin/editor"
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          ✨ Crear Tarjetas
        </Link>

        <Link
          href="/admin/recipients"
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          📋 Destinatarios y Envíos
        </Link>

        <Link
          href="/admin/stats"
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          📊 Estadísticas y Seguimiento
        </Link>

        <Link
          href="/cards/myspace"
          className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center"
        >
          🧑‍💻 Vista MySpace / Usuario
        </Link>
      </div>
    </div>
  );
}
