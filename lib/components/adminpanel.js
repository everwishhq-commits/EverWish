"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AnimationOverlay } from "@/lib/animations";
import CropperModal from "@/lib/croppermodal";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";

export default function Adminpanel() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [options, setOptions] = useState([]);
  const [recipientsCsv, setRecipientsCsv] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const res = await axios.get("/api/admin/cards");
      setCards(res.data || []);
    } catch (err) {
      console.error("error cargando tarjetas:", err);
    }
  }

  async function createCard(e) {
    e.preventDefault();
    if (!slug || !message) return alert("completa el slug y el mensaje");
    try {
      const payload = { slug, message, animation };
      const res = await axios.post("/api/admin/cards", payload);
      setSelectedCard(res.data);
      loadCards();
      alert("✅ tarjeta creada con éxito");
    } catch (err) {
      console.error(err);
      alert("❌ error al crear tarjeta");
    }
  }

  async function loadOptionsForSlug(s) {
    try {
      const res = await axios.get(`/api/animations/options?slug=${encodeURIComponent(s)}`);
      setOptions(res.data || []);
      setAnimation(res.data?.[0] || "");
    } catch {
      setOptions([]);
    }
  }

  async function uploadRecipients() {
    if (!selectedCard) return alert("selecciona una tarjeta primero");
    try {
      await axios.post(`/api/admin/cards/${selectedCard.id}/recipients`, {
        csv: recipientsCsv,
      });
      alert("✅ destinatarios subidos correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ error al subir destinatarios");
    }
  }

  async function sendBatch() {
    if (!selectedCard) return alert("selecciona una tarjeta primero");
    try {
      await axios.post(`/api/admin/cards/${selectedCard.id}/send`, {
        channel: "email",
      });
      alert("🚀 envío en proceso (revisa tu proveedor)");
    } catch (err) {
      console.error(err);
      alert("❌ error al enviar tarjetas");
    }
  }

  return (
    <div className="p-6 bg-[#fff7f5] min-h-[100dvh]">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#ff6b81]">
        💌 everwish admin panel
      </h1>

      <form
        onSubmit={createCard}
        className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md mb-8"
      >
        <label className="block font-semibold mb-1">slug (ej: bunny-easter)</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            loadOptionsForSlug(e.target.value);
          }}
          className="block w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-pink-300"
        />

        <label className="block font-semibold mb-1">mensaje principal</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-pink-300"
          rows={2}
        />

        <label className="block font-semibold mb-1">animación</label>
        <select
          value={animation}
          onChange={(e) => setAnimation(e.target.value)}
          className="block w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-pink-300"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="submit"
            className="px-5 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-semibold"
          >
            💾 crear tarjeta
          </button>
          <button
            type="button"
            onClick={() => setShowCrop(true)}
            className="px-5 py-3 bg-yellow-400 rounded-full hover:bg-yellow-300 font-semibold text-[#3b2b1f]"
          >
            📸 agregar imagen
          </button>
          <button
            type="button"
            onClick={() => setShowGift(true)}
            className="px-5 py-3 bg-pink-200 rounded-full hover:bg-pink-300 font-semibold text-pink-700"
          >
            🎁 giftcard
          </button>
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="px-5 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 font-semibold"
          >
            💳 checkout
          </button>
        </div>
      </form>

      {selectedCard && (
        <div className="max-w-lg mx-auto bg-white p-4 rounded-2xl shadow-md mb-8 relative">
          <AnimationOverlay slug={selectedCard.slug} animation={animation} />
          <div className="relative z-[200] p-4 bg-white rounded-xl shadow-sm text-center">
            <h2 className="font-semibold text-lg mb-2">preview: {selectedCard.slug}</h2>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h3 className="font-bold text-lg mb-3 text-center">📋 destinatarios</h3>
        <textarea
          value={recipientsCsv}
          onChange={(e) => setRecipientsCsv(e.target.value)}
          rows={6}
          placeholder="nombre,correo o teléfono,canal"
          className="w-full border p-3 rounded-xl mb-4 focus:ring-2 focus:ring-pink-300"
        />
        <div className="flex justify-center gap-3">
          <button
            onClick={uploadRecipients}
            className="px-5 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 font-semibold"
          >
            ⬆️ subir lista
          </button>
          <button
            onClick={sendBatch}
            className="px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold"
          >
            🚀 enviar tarjetas
          </button>
        </div>
      </div>

      <CropperModal
        open={showCrop}
        onClose={() => setShowCrop(false)}
        onDone={() => setShowCrop(false)}
      />
      <GiftCardPopup
        initial={null}
        onSelect={() => setShowGift(false)}
        onClose={() => setShowGift(false)}
      />
      <CheckoutModal
        total={5}
        gift={null}
        onGiftChange={() => setShowGift(true)}
        onGiftRemove={() => {}}
        onClose={() => setShowCheckout(false)}
      />
    </div>
  );
      }
