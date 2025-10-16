"use client";
import React, { useState } from "react";

export function CheckoutPopup({ selectedGift, plan, price, onPlanChange, onClose }) {
  const [buyer, setBuyer] = useState("");
  const [receiver, setReceiver] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-3 text-center text-gray-800">
          Checkout 🛒
        </h2>

        <div className="space-y-2 text-sm">
          <input
            type="text"
            placeholder="Your Name"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Receiver Name"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="email"
            placeholder="Receiver Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="tel"
            placeholder="Receiver Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="mt-4 text-sm">
          <p className="mb-1">
            Plan:{" "}
            <select
              value={plan}
              onChange={(e) => onPlanChange(e.target.value)}
              className="border rounded-lg p-1 ml-1"
            >
              <option value="Heartfelt">Heartfelt – $3.99</option>
              <option value="Signature">Signature – $7.99</option>
            </select>
          </p>
          {selectedGift && (
            <p className="text-gray-600">
              Gift: {selectedGift.name} (${selectedGift.amount})
            </p>
          )}
          <p className="font-semibold mt-2">Total: ${price.toFixed(2)}</p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full text-sm"
          >
            Cancel
          </button>
          <button className="bg-green-400 hover:bg-green-500 text-gray-900 px-4 py-2 rounded-full text-sm">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
              }
