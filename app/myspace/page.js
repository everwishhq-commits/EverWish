"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MySpace() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  useEffect(() => {
    // Cargar usuario desde localStorage
    const stored = localStorage.getItem("everwishUser");
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        loadCards(userData.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem("everwishUser");
      }
    }
  }, []);

  async function loadCards(email) {
    setLoading(true);
    try {
      const res = await fetch(`/api/my-cards?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.success) {
        setCards(data.cards || []);
      } else {
        console.error('Error from API:', data.error);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!loginEmail.trim()) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/my-cards?email=${encodeURIComponent(loginEmail)}`);
      const data = await res.json();

      if (data.success && data.cards && data.cards.length > 0) {
        const userData = {
          email: loginEmail,
          name: data.cards[0].sender?.name || "User",
          everwishId: data.cards[0].id?.substring(0, 12) || "",
        };
        
        localStorage.setItem("everwishUser", JSON.stringify(userData));
        setUser(userData);
        setCards(data.cards);
      } else {
        alert("No cards found for this email. Make sure you've purchased at least one card.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("everwishUser");
    setUser(null);
    setCards([]);
    setLoginEmail("");
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-pink-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
              💌 MySpace
            </h1>
            <p className="text-gray-600">Access your Everwish cards</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Access MySpace →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have any cards yet?{" "}
              <Link href="/categories" className="text-pink-500 font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // MYSPACE DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-lg mb-8 border border-pink-100"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Hi, {user.name}! 💌
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              {user.everwishId && (
                <p className="text-sm text-gray-500 mt-1">
                  Everwish ID: <span className="font-mono font-semibold">{user.everwishId}</span>
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
            >
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-lg"
          >
            <div className="text-6xl mb-4">💌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No cards yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first Everwish card
            </p>
            <Link
              href="/categories"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              Browse Cards →
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-pink-100"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Card Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {card.slug || 'Custom Card'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        card.status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {card.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {card.message || 'No message'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.animation && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          ✨ {card.animation}
                        </span>
                      )}
                      <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                        To: {card.recipient?.name || 'Unknown'}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button className="text-sm bg-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-600 transition">
                        👁️ View
                      </button>
                      <button className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-200 transition">
                        🔁 Re-send
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="md:w-48 flex flex-col justify-between">
                    <div className="text-xs text-gray-500 space-y-2">
                      <p>
                        <strong>Card ID:</strong><br/>
                        {card.id}
                      </p>
                      <p>
                        <strong>Created:</strong><br/>
                        {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Amount:</strong><br/>
                        ${(card.payment?.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
