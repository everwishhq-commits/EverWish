"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

/**
 * 🧭 Página principal del panel de administración Everwish
 * Carga el componente AdminPanel desde /lib/components/adminpanel.js
 * usando importación dinámica (para reducir peso inicial del bundle).
 */

const AdminPanel = dynamic(() => import("@/lib/components/adminpanel"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen text-gray-500">
      <p className="text-lg">Cargando panel de administrador...</p>
    </div>
  ),
});

export default function AdminPage() {
  return (
    <motion.div
      className="min-h-screen bg-[#fff7f5] flex flex-col items-center justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <header className="w-full bg-pink-100 py-4 shadow-md text-center">
        <h1 className="text-2xl font-bold text-pink-700">🌸 Everwish Admin</h1>
        <p className="text-sm text-gray-600">
          Panel de control — Crear, enviar y monitorear tarjetas
        </p>
      </header>

      <main className="flex-1 w-full max-w-4xl mt-6 px-4 sm:px-6 lg:px-8">
        <AdminPanel />
      </main>

      <footer className="w-full bg-pink-50 py-3 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Everwish · Admin Console
      </footer>
    </motion.div>
  );
}
