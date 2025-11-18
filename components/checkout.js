import React, { useState } from 'react';
import { Heart, X, Sparkles, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function EverwishQuickCheckout() {
  const [selectedPlan, setSelectedPlan] = useState('wonderdream');
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);

  const [showSnapwishDetails, setShowSnapwishDetails] = useState(false);
  const [showWonderDetails, setShowWonderDetails] = useState(false);

  const plans = {
    snapwish: { name: 'SnapWish', price: 3.99 },
    wonderdream: { name: 'WonderDream', price: 7.99 }
  };

  const giftCards = [
    { id: 'amazon', name: 'Amazon', icon: '🛒', amounts: [10, 25, 50, 100] },
    { id: 'starbucks', name: 'Starbucks', icon: '☕', amounts: [5, 10, 15, 25] },
    { id: 'target', name: 'Target', icon: '🎯', amounts: [10, 20, 25, 50] },
    { id: 'apple', name: 'Apple', icon: '🍎', amounts: [15, 25, 50, 100] },
    { id: 'walmart', name: 'Walmart', icon: '🏪', amounts: [10, 25, 50, 100] },
    { id: 'visa', name: 'Visa', icon: '💳', amounts: [25, 50, 100, 200], premium: true },
  ];

  const handleGiftCardSelect = (card, amount) => {
    setSelectedGiftCard({ ...card, amount });
    setShowGiftCardModal(false);
  };

  const getTotalPrice = () => {
    let total = plans[selectedPlan].price;
    if (selectedGiftCard) total += selectedGiftCard.amount;
    return total.toFixed(2);
  };

  const handleCheckout = async () => {
    alert(`Processing $${getTotalPrice()} payment via Stripe...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Checkout 💜
          </h1>
          <p className="text-gray-600">Complete your order in seconds</p>
        </div>

        {/* PLAN SELECTOR */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Choose your plan:</label>
          
          <div className="grid grid-cols-2 gap-3">

            {/* SNAPWISH */}
            <div>
              <button
                onClick={() => setSelectedPlan('snapwish')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === 'snapwish'
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <p className="font-bold text-gray-800">SnapWish</p>

                <p className="text-2xl font-bold text-pink-500">${plans.snapwish.price}</p>

                {/* VIEW DETAILS BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSnapwishDetails(!showSnapwishDetails);
                  }}
                  className="text-xs text-pink-500 font-semibold mt-1 flex items-center gap-1 mx-auto"
                >
                  {showSnapwishDetails ? "Hide details" : "View details"}
                  {showSnapwishDetails ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>

                {showSnapwishDetails && (
                  <div className="text-xs text-gray-600 mt-2 leading-4 px-2">
                    ✓ Static card  
                    <br />✓ Personalized message  
                    <br />✓ Optional digital gift card  
                    <br />✓ Quick delivery  
                  </div>
                )}
              </button>
            </div>


            {/* WONDERDREAM */}
            <div>
              <button
                onClick={() => setSelectedPlan('wonderdream')}
                className={`w-full p-4 rounded-xl border-2 transition-all relative ${
                  selectedPlan === 'wonderdream'
                    ? 'border-purple-600 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
                  BEST
                </span>

                <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="font-bold text-gray-800">WonderDream</p>
                
                <p className="text-2xl font-bold text-purple-600">${plans.wonderdream.price}</p>

                {/* VIEW DETAILS BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWonderDetails(!showWonderDetails);
                  }}
                  className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1 mx-auto"
                >
                  {showWonderDetails ? "Hide details" : "View details"}
                  {showWonderDetails ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>

                {showWonderDetails && (
                  <div className="text-xs text-gray-600 mt-2 leading-4 px-2">
                    ✓ Premium animated card  
                    <br />✓ Personalized message  
                    <br />✓ Upload your photo  
                    <br />✓ Optional digital gift card  
                    <br />✓ Magic emoji animations  
                    <br />✓ Full immersive experience  
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* GIFT CARDS (igual que antes, no modificado) */}
        {/* ——————————————————————————————————————— */}
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Gift Card (optional):
          </label>

          {selectedGiftCard ? (
            <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGiftCard.icon}</span>
                <div>
                  <p className="font-bold text-gray-800">{selectedGiftCard.name}</p>
                  <p className="text-sm text-gray-600">${selectedGiftCard.amount}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGiftCardModal(true)}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  Change
                </button>
                <button
                  onClick={() => setSelectedGiftCard(null)}
                  className="text-pink-500 hover:text-pink-700 font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowGiftCardModal(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-all font-semibold"
            >
              🎁 + Add Gift Card
            </button>
          )}
        </div>

        {/* TOTAL SUMMARY + PAY BUTTON */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">{plans[selectedPlan].name}</span>
            <span className="font-semibold">${plans[selectedPlan].price}</span>
          </div>

          {selectedGiftCard && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{selectedGiftCard.name}</span>
              <span className="font-semibold">${selectedGiftCard.amount}</span>
            </div>
          )}

          <div className="border-t-2 border-purple-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-3xl font-bold text-purple-600">${getTotalPrice()}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mb-4">🔒 Secure payment powered by Stripe</p>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-5 rounded-xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
        >
          <Send className="w-6 h-6" />
          Pay ${getTotalPrice()} now
        </button>
      </div>

      {/* GIFT CARD MODAL (igual) */}
      {showGiftCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🎁 Select Gift Card</h2>
              <button
                onClick={() => setShowGiftCardModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {giftCards.map((card) => (
                <div key={card.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{card.icon}</div>
                    <h3 className="font-bold text-gray-800 text-sm">{card.name}</h3>

                    {card.premium && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full mt-1 inline-block">
                        Coming soon
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {card.amounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => !card.premium && handleGiftCardSelect(card, amount)}
                        disabled={card.premium}
                        className={`py-2 rounded-lg font-bold text-sm transition-all ${
                          card.premium
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transform hover:scale-105'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGiftCardModal(false)}
              className="w-full mt-6 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
                  }
