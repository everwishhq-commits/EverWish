"use client";

/**
 * ✅ CheckoutModal.js
 * Muestra el resumen de pago y permite agregar o quitar Gift Card.
 */
export default function CheckoutModal({
  total = 5,
  gift,
  onGiftChange,
  onGiftRemove,
  onClose,
}) {
  const finalTotal = (5 + (gift?.amount || 0)).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md text-center animate-fadeIn">
        <h3 className="text-lg font-semibold mb-3 text-pink-600">
          💳 Checkout
        </h3>

        {/* Base price */}
        <p className="text-gray-700 mb-2">Base Price: $5.00</p>

        {/* Gift details */}
        {gift && (
          <p className="text-gray-700 mb-2">
            Gift Card: +${gift.amount.toFixed(2)}
          </p>
        )}

        {/* Total */}
        <p className="text-xl font-bold text-pink-700 mb-4">
          Total: ${finalTotal}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {gift ? (
            <button
              onClick={onGiftRemove}
              className="rounded-full bg-pink-100 px-4 py-2 text-pink-700 font-medium hover:bg-pink-200 transition-all"
            >
              Remove Gift
            </button>
          ) : (
            <button
              onClick={onGiftChange}
              className="rounded-full bg-pink-200 px-4 py-2 text-pink-700 font-medium hover:bg-pink-300 transition-all"
            >
              Add Gift
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-5 rounded-full bg-pink-500 px-6 py-2 text-white font-semibold hover:bg-pink-600 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
