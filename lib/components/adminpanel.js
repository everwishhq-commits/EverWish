"use client";

import { useState, useEffect } from "react";
import axios from "axios";

/**
 * 🧭 AdminPanel — Panel principal del administrador Everwish
 * Permite crear, enviar y monitorear tarjetas, contactos y campañas.
 * Usa Axios para obtener y enviar datos.
 */

export default function AdminPanel() {
  const [cards, setCards] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);

  /* 📦 Cargar información inicial */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cardsRes, recipientsRes, statsRes] = await Promise.all([
          axios.get("/api/cards"),
          axios.get("/api/recipients"),
          axios.get("/api/admin/stats"),
        ]);
        setCards(cardsRes.data || []);
        setRecipients(recipientsRes.data || []);
        setStats(statsRes.data || {});
      } catch (err) {
        console.error("Error al cargar datos del panel:", err);
        setError("No se pudieron cargar los datos del panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ✉️ Enviar tarjeta */
  const handleSend = async (recipientId) => {
    if (!selectedCard) {
      alert("Selecciona una tarjeta antes de enviar.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/send", {
        cardId: selectedCard.id,
        recipientId,
      });
      alert("🎉 Tarjeta enviada correctamente.");
    } catch (err) {
      console.error("Error al enviar tarjeta:", err);
      alert("❌ No se pudo enviar la tarjeta.");
    } finally {
      setLoading(false);
    }
  };

  /* 🗑️ Eliminar tarjeta */
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta tarjeta?")) return;
    try {
      await axios.delete(`/api/cards/${id}`);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error eliminando tarjeta:", err);
    }
  };

  return (
    <div className="p-6 bg-[#fff7f5] min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        🧭 Everwish Admin Panel
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500 mb-4">Cargando datos...</div>
      )}

      {/* 📊 Estadísticas */}
      <section className="mb-8 bg-white shadow rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-3">📈 Estadísticas generales</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-pink-100 rounded-xl">
            <p className="text-sm text-gray-500">Tarjetas enviadas</p>
            <p className="text-xl font-bold">{stats.sent || 0}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl">
            <p className="text-sm text-gray-500">Vistas totales</p>
            <p className="text-xl font-bold">{stats.views || 0}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-xl">
            <p className="text-sm text-gray-500">Reenvíos</p>
            <p className="text-xl font-bold">{stats.resends || 0}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-xl">
            <p className="text-sm text-gray-500">Comentarios</p>
            <p className="text-xl font-bold">{stats.comments || 0}</p>
          </div>
        </div>
      </section>

      {/* 🎨 Lista de tarjetas */}
      <section className="mb-8 bg-white shadow rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">🎨 Tus tarjetas creadas</h2>

        {cards.length === 0 && (
          <p className="text-gray-500 text-center">No tienes tarjetas aún.</p>
        )}

        <ul className="space-y-3">
          {cards.map((card) => (
            <li
              key={card.id}
              className={`p-4 rounded-xl border cursor-pointer ${
                selectedCard?.id === card.id
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedCard(card)}
            >
              <p className="font-medium text-gray-800">{card.title}</p>
              <p className="text-sm text-gray-500">
                {card.category} · {card.views || 0} vistas
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleDelete(card.id)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                >
                  🗑️ Eliminar
                </button>
                <button
                  onClick={() => window.open(`/view/${card.id}`, "_blank")}
                  className="px-3 py-1 text-sm rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  👁️ Ver
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 👥 Lista de destinatarios */}
      <section className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">👥 Destinatarios</h2>

        {recipients.length === 0 && (
          <p className="text-gray-500 text-center">No hay destinatarios.</p>
        )}

        <ul className="space-y-3">
          {recipients.map((r) => (
            <li
              key={r.id}
              className="p-3 rounded-xl border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{r.name}</p>
                <p className="text-sm text-gray-500">{r.email}</p>
              </div>
              <button
                onClick={() => handleSend(r.id)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
              >
                ✉️ Enviar
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
        }
