"use client";

import { useState } from "react";

// ============================================================
// CONFIGURACIÓN DE USUARIOS VIP CON ENVÍO GRATUITO
// ============================================================

const VIP_USERS = [
  // ADMINS - Envío gratis ilimitado
  {
    email: "admin@everwish.cards",
    phone: "+15166046558",
    name: "Admin Everwish",
    type: "admin",
    freeCards: "unlimited",
  },
  {
    email: "everwishhq@gmail.com",
    name: "Everwish HQ",
    type: "admin",
    freeCards: "unlimited",
  },
  {
    email: "gabrielvelasco11@hotmail.com",
    name: "Gabriel Velasco",
    type: "admin",
    freeCards: "unlimited",
  },
];

// ============================================================
// COMPONENTE SIMPLE PARA AGREGAR USUARIOS VIP
// ============================================================

export default function FreeTrialPanel() {
  const [trialUsers, setTrialUsers] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("everwish_vip_users");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    months: "2",
    cards: "10",
  });

  const addVIPUser = (e) => {
    e.preventDefault();
    
    if (!newUser.name || (!newUser.email && !newUser.phone)) {
      alert("❌ Name and at least one contact (email or phone) required");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + parseInt(newUser.months));

    const user = {
      name: newUser.name,
      email: newUser.email || null,
      phone: newUser.phone || null,
      freeCards: parseInt(newUser.cards),
      usedCards: 0,
      addedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const updated = [...trialUsers, user];
    setTrialUsers(updated);
    localStorage.setItem("everwish_vip_users", JSON.stringify(updated));

    alert(`✅ VIP user added: ${user.name}`);
    setNewUser({ name: "", email: "", phone: "", months: "2", cards: "10" });
  };

  const removeVIPUser = (index) => {
    if (!confirm("Remove this VIP user?")) return;
    
    const updated = trialUsers.filter((_, i) => i !== index);
    setTrialUsers(updated);
    localStorage.setItem("everwish_vip_users", JSON.stringify(updated));
    alert("🗑️ VIP user removed");
  };

  const activeUsers = trialUsers.filter(u => {
    const now = new Date();
    const expires = new Date(u.expiresAt);
    return now <= expires && u.usedCards < u.freeCards;
  });

  return (
    <div className="min-h-screen bg-[#fff7f5] p-6">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          🎁 VIP Free Trial Management
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{VIP_USERS.length}</p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-600">{activeUsers.length}</p>
            <p className="text-sm text-gray-600">Active VIPs</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{trialUsers.length}</p>
            <p className="text-sm text-gray-600">Total VIPs</p>
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-purple-50 rounded-xl p-6 shadow mb-8">
          <h2 className="text-xl font-bold text-purple-800 mb-4">
            👑 Admin Users (Unlimited Free)
          </h2>
          <div className="space-y-2">
            {VIP_USERS.map((admin, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border-2 border-purple-200">
                <p className="font-bold">{admin.name}</p>
                <p className="text-sm text-gray-600">
                  {admin.email} {admin.phone && `• ${admin.phone}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add VIP Form */}
        <div className="bg-white rounded-xl p-6 shadow mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ➕ Add New VIP User
          </h2>
          
          <form onSubmit={addVIPUser} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="w-full border-2 rounded-xl px-4 py-2"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="border-2 rounded-xl px-4 py-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="border-2 rounded-xl px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={newUser.months}
                onChange={(e) => setNewUser({...newUser, months: e.target.value})}
                className="border-2 rounded-xl px-4 py-2"
              >
                <option value="1">1 month</option>
                <option value="2">2 months</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
              </select>

              <input
                type="number"
                min="1"
                max="100"
                placeholder="Free cards"
                value={newUser.cards}
                onChange={(e) => setNewUser({...newUser, cards: e.target.value})}
                className="border-2 rounded-xl px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold"
            >
              ✅ Add VIP User
            </button>
          </form>
        </div>

        {/* VIP Users List */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            👥 VIP Users ({trialUsers.length})
          </h2>

          {trialUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No VIP users yet. Add your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {trialUsers.map((user, i) => {
                const now = new Date();
                const expires = new Date(user.expiresAt);
                const isActive = now <= expires && user.usedCards < user.freeCards;
                const isExpired = now > expires;

                return (
                  <div
                    key={i}
                    className={`border-2 rounded-xl p-4 ${
                      isActive ? 'bg-green-50 border-green-300' : 
                      isExpired ? 'bg-red-50 border-red-300' : 
                      'bg-orange-50 border-orange-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">
                          {isActive ? '✅' : isExpired ? '⏰' : '📊'} {user.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          {user.email} {user.phone && `• ${user.phone}`}
                        </p>
                        <p className="text-sm font-semibold mt-2">
                          Cards: {user.usedCards}/{user.freeCards} • 
                          Expires: {new Date(user.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeVIPUser(i)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
