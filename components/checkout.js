"use client";

import { useState } from "react";
import { X, CreditCard, Mail, Phone, User } from "lucide-react";
import { 
  loginAfterPayment, 
  savePurchasedCard, 
  getCurrentUser,
  isAuthenticated 
} from "@/lib/auth";

export default function CheckoutModal({ total, onClose, cardData }) {
  const currentUser = getCurrentUser();
  const isUserReal = isAuthenticated();
  
  const [formData, setFormData] = useState({
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    name: currentUser?.name || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // Validaciones básicas
      if (!formData.email || !formData.phone) {
        throw new Error("Email y teléfono son requeridos");
      }

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 🎯 CONVERSIÓN: Usuario temporal → Usuario real
      if (currentUser?.isTemp) {
        console.log("🔄 Convirtiendo usuario temporal a real...");
        loginAfterPayment(
          formData.email,
          formData.phone,
          formData.name
        );
      }

      // Generar link único de la tarjeta
      const cardLink = `${window.location.origin}/view/${cardData.slug}-${Date.now()}`;

      // Guardar tarjeta como comprada
      const purchasedCard = savePurchasedCard({
        ...cardData,
        id: `card_${Date.now()}`,
        userEmail: formData.email,
        userPhone: formData.phone,
        userName: formData.name,
        cardLink: cardLink,
        amount: total,
      });

      console.log("✅ Pago exitoso:", {
        card: purchasedCard,
        wasTemp: currentUser?.isTemp,
        nowReal: true
      });

      // Redirigir a My Space para ver la compra
      alert("¡Pago exitoso! Tu tarjeta está lista.");
      window.location.href = "/myspace";

    } catch (err) {
      console.error("❌ Error en pago:", err);
      setError(err.message || "Error procesando el pago");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-4 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold mb-1">Checkout</h2>
          <p className="text-sm text-pink-100">
            {isUserReal 
              ? "Completa tu compra" 
              : "Crea tu cuenta al comprar"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Info del usuario temporal */}
          {currentUser?.isTemp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                ℹ️ Al completar la compra, se creará tu cuenta automáticamente y todos tus borradores se guardarán.
              </p>
            </div>
          )}

          {/* Información personal */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isUserReal}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isUserReal}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nombre (opcional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          {/* Información de pago */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Información de pago
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-pink-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón de pago */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </span>
            ) : (
              `Pagar $${total.toFixed(2)}`
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            🔒 Pago seguro y encriptado
          </p>
        </form>
      </div>
    </div>
  );
            }
