"use client";
import { useState } from "react";
import axios from "axios";

export default function RecipientsAdmin() {
  const [cardId, setCardId] = useState("");
  const [csv, setCsv] = useState("");
  const [logs, setLogs] = useState([]);

  const upload = async () => {
    if (!cardId) return alert("Falta el ID de la tarjeta");
    const res = await axios.post(`/api/admin/cards/${cardId}/recipients`, { csv });
    setLogs(res.data);
    alert("✅ Lista cargada");
  };

  const send = async () => {
    if (!cardId) return alert("Selecciona una tarjeta");
    await axios.post(`/api/admin/cards/${cardId}/send`);
    alert("🚀 Envíos en proceso");
  };

  return (
    <div className="p-6 bg-[#fff7f5] min-h-[100dvh]">
      <h2 className="text-2xl font-bold mb-4 text-[#ff6b81] text-center">
        📬 Administración de Envíos
      </h2>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow">
        <label htmlFor="cardId" className="block font-semibold mb-1">ID de Tarjeta</label>
        <input
          id="cardId"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          className="w-full border rounded-xl p-3 mb-3"
          placeholder="uuid o slug"
        />

        <label htmlFor="csvList" className="block font-semibold mb-1">Lista de destinatarios</label>
        <textarea
          id="csvList"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={6}
          className="w-full border rounded-xl p-3 mb-4"
          placeholder="Ejemplo:\nNombre,correo o teléfono,canal"
        />

        <div className="flex justify-center gap-3">
          <button
            onClick={upload}
            className="bg-green-500 text-white rounded-full px-5 py-3 font-semibold hover:bg-green-600"
          >
            ⬆️ Subir Lista
          </button>
          <button
            onClick={send}
            className="bg-blue-500 text-white rounded-full px-5 py-3 font-semibold hover:bg-blue-600"
          >
            🚀 Enviar
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-2xl mx-auto">
        {logs.length > 0 && (
          <pre className="bg-white rounded-xl p-4 shadow text-sm overflow-x-auto">
            {JSON.stringify(logs, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
