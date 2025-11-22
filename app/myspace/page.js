"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { isFreeTrialUser, getFreeTrialInfo } from "@/lib/free-trial-config";
import { Crown, Send, Users, LogOut, Plus, Trash2, Mail, MessageSquare } from "lucide-react";

export default function MySpace() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freeTrialInfo, setFreeTrialInfo] = useState(null);
  const [sendMode, setSendMode] = useState("individual"); // "individual" o "bulk"
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setUser(currentUser);

    // Verificar si es usuario VIP
    const trialInfo = getFreeTrialInfo(currentUser.email, currentUser.phone);
    setFreeTrialInfo(trialInfo);

    // Cargar tarjetas del usuario
    loadUserCards(currentUser);
  }, []);

  const loadUserCards = async (currentUser) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-cards?email=${encodeURIComponent(currentUser.email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleCardSelect = (cardId) => {
    if (sendMode === "bulk") {
      setSelectedCards(prev => 
        prev.includes(cardId) 
          ? prev.filter(id => id !== cardId)
          : [...prev, cardId]
      );
    }
  };

  const handleBulkSend = () => {
    if (selectedCards.length === 0) {
      alert("Selecciona al menos una tarjeta para enviar");
      return;
    }
    
    // Aquí iría la lógica de envío bulk
    console.log("Enviando tarjetas:", selectedCards);
    alert(`✅ ${selectedCards.length} tarjetas enviadas exitosamente!`);
    setSelectedCards([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu espacio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                My Space
              </h1>
              
              {/* Badge VIP */}
              {freeTrialInfo?.isActive && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold text-sm">VIP</span>
                  {freeTrialInfo.cardsRemaining !== null && (
                    <span className="text-xs opacity-90">
                      {freeTrialInfo.cardsRemaining} tarjetas gratis
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">{user?.phone}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controles de envío */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Modo de Envío</h2>
              <p className="text-sm text-gray-500">
                {sendMode === "individual" 
                  ? "Envía tarjetas una por una"
                  : `${selectedCards.length} tarjetas seleccionadas`
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSendMode("individual");
                  setSelectedCards([]);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  sendMode === "individual"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Send className="w-4 h-4" />
                Individual
              </button>

              <button
                onClick={() => setSendMode("bulk")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  sendMode === "bulk"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Users className="w-4 h-4" />
                Bulk
              </button>
            </div>
          </div>

          {/* Botón de envío bulk */}
          {sendMode === "bulk" && selectedCards.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleBulkSend}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar {selectedCards.length} tarjetas seleccionadas
              </button>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No tienes tarjetas aún
              </h3>
              <p className="text-gray-500 mb-6">
                Crea tu primera tarjeta personalizada y envíala a alguien especial
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Crear Primera Tarjeta
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardSelect(card.id)}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${
                  sendMode === "bulk" && selectedCards.includes(card.id)
                    ? "border-pink-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-pink-300 hover:shadow-md"
                }`}
              >
                {/* Card Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-2xl overflow-hidden">
                  {card.videoUrl ? (
                    <video
                      src={card.videoUrl}
                      className="w-full h-full object-contain bg-white"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Sin preview</p>
                    </div>
                  )}
                  
                  {/* Checkbox para modo bulk */}
                  {sendMode === "bulk" && (
                    <div className="absolute top-3 right-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedCards.includes(card.id)
                          ? "bg-pink-500 border-pink-500"
                          : "bg-white border-gray-300"
                      }`}>
                        {selectedCards.includes(card.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">
                        {card.recipientName || "Sin nombre"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {card.category || "Sin categoría"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      card.status === "sent" 
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {card.status === "sent" ? "Enviada" : "Pendiente"}
                    </span>
                  </div>

                  {/* Actions */}
                  {sendMode === "individual" && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/edit/${card.slug}`;
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Editar
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica de envío individual
                          alert(`Enviando: ${card.recipientName}`);
                        }}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-1"
                      >
                        <Send className="w-4 h-4" />
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {freeTrialInfo?.isActive && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Estado VIP</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {freeTrialInfo.cardsRemaining !== null
                    ? `Te quedan ${freeTrialInfo.cardsRemaining} tarjetas gratis de ${freeTrialInfo.freeCards} totales`
                    : "Tarjetas gratis ilimitadas"
                  }
                </p>
                {freeTrialInfo.expiresAt && (
                  <p className="text-xs text-gray-500">
                    Válido hasta: {new Date(freeTrialInfo.expiresAt).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
