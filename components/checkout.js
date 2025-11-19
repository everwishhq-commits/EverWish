@@ -213,118 +213,133 @@ function CheckoutForm({ total, gift, onSuccess, onError, isAdmin, cardData }) {
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isAdmin ? "Sending..." : "Processing Payment..."}
          </>
        ) : isAdmin ? (
          <>
            👑 Send FREE (Admin)
          </>
        ) : (
          <>💳 Pay ${total.toFixed(2)}</>
        )}
      </button>
    </form>
  );
}

export default function CheckoutModal({ total, gift, onClose, cardData }) {
  const [selectedPlan, setSelectedPlan] = useState("wonderdream");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGiftAmount, setSelectedGiftAmount] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeLoadError, setStripeLoadError] = useState("");

  const plans = {
    snapwish: {
      name: "SnapWish",
      price: 3.99,
      details: [
        "Static digital card",
        "Personalized message",
        "Includes optional gift card",
      ],
    },
    wonderdream: {
      name: "WonderDream",
      price: 7.99,
      details: [
        "Premium animated card",
        "Personalized message",
        "Upload your photo",
        "Gift card (optional)",
        "Magic animations included",
      ],
    },
  };

  const giftCardAmounts = [5, 10, 15, 20, 25, 50, 100];

  const getTotal = () => {
    let t = plans[selectedPlan].price;
    if (selectedGiftAmount) t += selectedGiftAmount;
    return t;
  };

  useEffect(() => {
    if (stripePromise) {
      stripePromise.then((stripe) => setStripeReady(!!stripe)).catch(() => setStripeReady(false));
      stripePromise
        .then((stripe) => {
          setStripeReady(!!stripe);
          setStripeLoadError("");
        })
        .catch(() => {
          setStripeReady(false);
          setStripeLoadError(
            "No se pudo inicializar Stripe. Verifica la clave NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
          );
        });
    } else {
      setStripeLoadError(
        "Stripe no está configurado. Asegúrate de definir NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
      );
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAdminUser(isAdminUser(user.email, user.phone));
    }
  }, []);

  const handleSuccess = (result) => {
    if (result.type === "payment") {
      alert("🎉 Payment successful! Your card will be sent shortly.");
      window.location.href = "/success";
    } else {
      alert("✅ Card sent successfully!");
      onClose();
    }
  };

  const handleError = (error) => console.error("❌ Error:", error);

  if (!stripeReady && !isAdminUser) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-500" />
          <h3 className="text-xl font-bold mb-2">Loading Payment System...</h3>
          <p className="text-gray-600 text-sm mb-4">Initializing secure payment with Stripe</p>

          {!stripeKey && (
          {stripeLoadError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
              <strong>Configuration Error:</strong> Stripe key is missing.
              <strong>Configuration Error:</strong> {stripeLoadError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
          {isAdminUser ? "👑 Admin Checkout" : "Checkout"}
        </h2>

        {!isAdminUser && (
          <div className="grid grid-cols-2 gap-3 mb-4">

            {/* SNAPWISH */}
            <button
              type="button"
