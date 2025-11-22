"use client";

import { useEffect, useState } from "react";
import { 
  getCurrentUser, 
  logout, 
  getDrafts, 
  getPurchasedCards,
  deleteDraft 
} from "@/lib/auth";
import { Crown, Send, LogOut, Plus, Trash2, ShoppingCart, CreditCard, Eye, Edit } from "lucide-react";

export default function MySpace() {
  const [user, setUser] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("purchased"); // "drafts" o "purchased"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Cargar borradores y compradas desde localStorage
    setDrafts(getDrafts());
    setPurchased(getPurchasedCards());
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDeleteDraft = (draftId) => {
    if (!confirm("¿Eliminar este borrador?")) return;
    deleteDraft(draftId);
    setDrafts(getDrafts());
  };

  const handleContinueDraft = (draft) => {
    // Ir a editar la tarjeta
    window.location.href = `/edit/${draft.slug}?draft=${draft.id}`;
  };

  const handleCheckoutDraft = (draft) => {
    // Ir directo al checkout con el borrador
    window.location.href = `/edit/${draft.slug}?draft=${draft.id}&checkout=true`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                My Space
              </h1>
              
              {/* Badge según tipo de usuario */}
              {user?.isTemp ? (
                <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  <span>👤 Invitado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold text-sm">VIP</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user && !user.isTemp && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>
              )}
              
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("drafts")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "drafts"
                ? "bg-yellow-400 text-gray-900 shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Borradores ({drafts.length})
          </button>
          
          <button
            onClick={() => setActiveTab("purchased")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "purchased"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            Compradas ({purchased.length})
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB: BORRADORES (Carrito) */}
        {/* ============================================================ */}
        {activeTab === "drafts" && (
          <>
            {drafts.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10 text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Cuando empieces a crear una tarjeta, se guardará aquí automáticamente para que puedas continuar después.
                </p>
                <a
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Empezar a crear
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="relative aspect-video bg-gradient-to-br from-yellow-50 to-orange-50">
                      {draft.userImage ? (
                        <img
                          src={draft.userImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">📝</span>
                        </div>
                      )}
                      
                      {/* Badge borrador */}
                      <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        Borrador
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {draft.slug || "Tarjeta sin nombre"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {draft.message || "Sin mensaje"}
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        Actualizado: {new Date(draft.updatedAt).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleContinueDraft(draft)}
                          className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        
                        <button
                          onClick={() => handleCheckoutDraft(draft)}
                          className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pagar
                        </button>
                        
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ============================================================ */}
        {/* TAB: COMPRADAS */}
        {/* ============================================================ */}
        {activeTab === "purchased" && (
          <>
            {purchased.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-10 h-10 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No tienes tarjetas compradas
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Compra tu primera tarjeta para verla aquí
                  </p>
                  
                  {drafts.length > 0 ? (
                    <button
                      onClick={() => setActiveTab("drafts")}
                      className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Ver Borradores ({drafts.length})
                    </button>
                  ) : (
                    <a
                      href="/categories"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Crear Tarjeta
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchased.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl shadow-sm border-2 border-green-200 overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="relative aspect-video bg-gradient-to-br from-green-50 to-emerald-50">
                      {card.userImage ? (
                        <img
                          src={card.userImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">✅</span>
                        </div>
                      )}
                      
                      {/* Badge comprada */}
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Comprada
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {card.slug || "Tarjeta"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {card.message || "Sin mensaje"}
                      </p>
                      
                      {/* Link de la tarjeta */}
                      {card.cardLink && (
                        <div className="bg-gray-50 rounded-lg p-2 mb-4">
                          <p className="text-xs text-gray-500 mb-1">Link de tu tarjeta:</p>
                          <a 
                            href={card.cardLink}
                            target="_blank"
                            className="text-sm text-pink-600 font-medium break-all hover:underline"
                          >
                            {card.cardLink}
                          </a>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={card.cardLink || `/view/${card.id}`}
                          target="_blank"
                          className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </a>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(card.cardLink || `${window.location.origin}/view/${card.id}`);
                            alert("¡Link copiado!");
                          }}
                          className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Compartir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
                }
