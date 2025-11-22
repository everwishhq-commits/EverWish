"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FreeTrialManager } from "@/lib/free-trial-config";

export default function FreeTrialAdminPage() {
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    months: 2,
    freeCards: 10,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  function loadStats() {
    const data = FreeTrialManager.getStats();
    setStats(data);
  }

  function handleAddUser(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!formData.name || (!formData.email && !formData.phone)) {
        throw new Error("Name and at least one contact (email or phone) are required");
      }

      FreeTrialManager.addTrialUser({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        months: parseInt(formData.months),
        freeCards: parseInt(formData.freeCards),
      });

      setSuccess(`✅ Free trial added for ${formData.name}!`);
      setFormData({ name: "", email: "", phone: "", months: 2, freeCards: 10 });
      setShowAddForm(false);
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRemoveUser(email, phone) {
    if (!confirm("Are you sure you want to remove this free trial?")) return;
    
    FreeTrialManager.removeTrialUser(email, phone);
    setSuccess("🗑️ Free trial removed successfully");
    loadStats();
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#fff7f5] flex items-center justify-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7f5] p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.location.href = "/admin"}
            className="text-pink-500 hover:text-pink-600 font-semibold mb-4"
          >
            ← Back to Admin
          </button>
          
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            🎁 Free Trial Management
          </h1>
          <p className="text-gray-600">
            Manage VIP users who can send cards for free (marketing & publicity)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active Trials</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.expired}</p>
            <p className="text-sm text-gray-600">Expired</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalCardsSent}</p>
            <p className="text-sm text-gray-600">Cards Sent</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-2 border-green-500 rounded-xl p-4 mb-6 text-green-700 font-semibold"
          >
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-2 border-red-500 rounded-xl p-4 mb-6 text-red-700 font-semibold"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Add User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            {showAddForm ? "✕ Cancel" : "+ Add New VIP User"}
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white rounded-xl p-6 shadow-lg mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add New VIP User</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-pink-400 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email (at least one required)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-pink-400 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone (at least one required)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-pink-400 focus:outline-none"
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Free Trial Duration (months)
                  </label>
                  <select
                    value={formData.months}
                    onChange={(e) => setFormData({ ...formData, months: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-pink-400 focus:outline-none"
                  >
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Free Cards Allowed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.freeCards}
                    onChange={(e) => setFormData({ ...formData, freeCards: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold shadow-lg transition"
              >
                ✅ Add VIP User
              </button>
            </form>
          </motion.div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">👥 VIP Users List</h2>

          {stats.users.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No VIP users yet. Add your first one above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.users.map((user, i) => {
                const statusColors = {
                  active: "bg-green-100 text-green-700 border-green-300",
                  expired: "bg-red-100 text-red-700 border-red-300",
                  limit_reached: "bg-orange-100 text-orange-700 border-orange-300",
                };

                const statusEmojis = {
                  active: "✅",
                  expired: "⏰",
                  limit_reached: "📊",
                };

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-2 rounded-xl p-4 ${statusColors[user.status]}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{statusEmojis[user.status]}</span>
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-white font-semibold uppercase">
                            {user.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {user.email && (
                            <p>📧 <strong>Email:</strong> {user.email}</p>
                          )}
                          {user.phone && (
                            <p>📱 <strong>Phone:</strong> {user.phone}</p>
                          )}
                          <p>
                            📊 <strong>Cards:</strong> {user.usedCards} / {user.freeCards} used
                          </p>
                          <p>
                            ⏰ <strong>Expires:</strong> {new Date(user.expiresAt).toLocaleDateString()}
                          </p>
                          <p className="col-span-2 text-xs text-gray-600">
                            Added: {new Date(user.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveUser(user.email, user.phone)}
                        className="ml-4 px-4 py-2 bg-white hover:bg-red-50 text-red-600 rounded-full font-semibold text-sm transition"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
