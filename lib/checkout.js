"use client";

/**
 * CheckoutModal.js
 * Muestra el resumen de pago y permite agregar o quitar Gift Card.
 */
export default function CheckoutModal({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md text-center">
        <h3 className="text-lg font-semibold mb-3 text-purple-600">💳 Checkout</h3>
        <p className="text-gray-700 mb-2">Base Price: $5.00</p>
        {gift && (
          <p className="text-gray-700 mb-2">
            Gift Card: +${gift.amount.toFixed(2)}
          </p>
        )}
        <p className="text-xl font-bold text-purple-700 mb-4">
          Total: ${(5 + (gift?.amount || 0)).toFixed(2)}
        </p>

        <div className="flex justify-center gap-3">
          {gift ? (
            <button
              onClick={onGiftRemove}
              className="rounded-full bg-pink-100 px-4 py-2 text-pink-700 font-medium hover:bg-pink-200"
            >
              Remove Gift
            </button>
          ) : (
            <button
              onClick={onGiftChange}
              className="rounded-full bg-pink-200 px-4 py-2 text-pink-700 font-medium hover:bg-pink-300"
            >
              Add Gift
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 rounded-full bg-purple-500 px-6 py-2 text-white font-semibold hover:bg-purple-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
