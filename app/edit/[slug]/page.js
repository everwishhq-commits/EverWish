"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { defaultMessageFromSlug } from "../../lib/messages";
import { getAnimationsForSlug } from "../../lib/animations";
import CropperModal from "../../lib/croppermodal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
};

/* ---------------- Stripe inline form ---------------- */
function InlineStripeForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payment_intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) throw new Error(error || "Missing client secret");
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) } });
      if (result.error) alert(result.error.message || "Payment failed");
      else if (result.paymentIntent?.status === "succeeded") {
        alert("🎉 Payment successful!");
        onSuccess?.();
      }
    } catch {
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={submit} className="mt-4">
      <div className="border rounded-2xl p-4 bg-gray-50"><CardElement options={{ style: { base: { fontSize: "16px" } } }} /></div>
      <button type="submit" disabled={!stripe || loading} className={`mt-4 w-full rounded-full py-3 font-semibold text-white transition ${loading ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-600"}`}>{loading ? "Processing..." : `Confirm & Pay $${total.toFixed(2)} 💜`}</button>
    </form>
  );
}

/* ---------------- Gift Card Popup ---------------- */
function GiftCardPopup({ onSelect, onClose, initial }) {
  const tabs = ["Popular", "Lifestyle", "Digital"];
  const [activeTab, setActiveTab] = useState("Popular");
  const [expanded, setExpanded] = useState({});
  const [brand, setBrand] = useState(initial?.brand || "");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const cards = {
    Popular: { featured: ["Amazon", "Walmart", "Target"], more: ["Apple", "Best Buy", "Starbucks"] },
    Lifestyle: { featured: ["Nike", "H&M", "Zara"], more: ["Shein", "Etsy", "Bath & Body Works"] },
    Digital: { featured: ["Google Play", "Spotify", "Netflix"], more: ["Xbox", "PlayStation", "Disney+"] },
  };
  const quick = [5, 10, 25, 50, 100];
  const done = () => {
    if (!brand || !Number(amount)) return alert("Please select a brand and amount.");
    onSelect({ brand, amount: Number(amount) });
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="text-xl font-bold text-center text-pink-600 mb-4">Choose a Gift Card 🎁</h3>
        <div className="flex justify-center gap-6 mb-4">{tabs.map((t) => <button key={t} onClick={() => setActiveTab(t)} className={`pb-1 ${activeTab === t ? "text-pink-500 border-b-2 border-pink-500 font-semibold" : "text-gray-400"}`}>{t}</button>)}</div>
        <div className="grid grid-cols-2 gap-3 mb-3">{cards[activeTab].featured.map((b) => <button key={b} onClick={() => setBrand(b)} className={`border rounded-xl py-2 px-3 text-sm ${brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}>{b}</button>)}</div>
        {expanded[activeTab] && <div className="grid grid-cols-2 gap-3 mb-3">{cards[activeTab].more.map((b) => <button key={b} onClick={() => setBrand(b)} className={`border rounded-xl py-2 px-3 text-sm ${brand === b ? "bg-pink-100 border-pink-400 text-pink-600" : "hover:bg-gray-100"}`}>{b}</button>)}</div>}
        <button onClick={() => setExpanded((p) => ({ ...p, [activeTab]: !p[activeTab] }))} className="text-sm text-gray-600 hover:text-pink-500 mb-3">{expanded[activeTab] ? "Hide more ▲" : "More gift cards ▼"}</button>
        <h4 className="text-sm font-semibold mb-2 text-center text-gray-600">Amount (USD)</h4>
        <div className="flex gap-2 justify-center mb-4">{quick.map((a) => <button key={a} onClick={() => setAmount(a)} className={`px-3 py-1 rounded-lg border transition ${Number(amount) === a ? "bg-pink-100 border-pink-500 text-pink-600" : "hover:bg-gray-100"}`}>${a}</button>)}</div>
        <button onClick={done} className="w-full rounded-full py-3 font-semibold text-white bg-pink-500 hover:bg-pink-600 transition">Done</button>
      </motion.div>
    </div>
  );
}

/* ---------------- Checkout popup ---------------- */
function CheckoutPopup({ total, gift, onGiftChange, onGiftRemove, onClose }) {
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({ name: "", email: "", phone: "" });
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[65]">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="text-xl font-bold text-center text-purple-600 mb-1">Secure Checkout with Stripe 💜</h3>
        <p className="text-center text-sm text-gray-500 mb-4">Your information is encrypted and processed safely.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div><p className="text-sm font-medium text-gray-600">Sender *</p><input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" value={sender.name} onChange={(e) => setSender({ ...sender, name: e.target.value })} /><input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" value={sender.email} onChange={(e) => setSender({ ...sender, email: e.target.value })} /><input placeholder="Phone" className="w-full rounded-xl border p-3" value={sender.phone} onChange={(e) => setSender({ ...sender, phone: e.target.value })} /></div>
          <div><p className="text-sm font-medium text-gray-600">Recipient *</p><input placeholder="Full name" className="w-full rounded-xl border p-3 mb-2" value={recipient.name} onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} /><input placeholder="Email" className="w-full rounded-xl border p-3 mb-2" value={recipient.email} onChange={(e) => setRecipient({ ...recipient, email: e.target.value })} /><input placeholder="Phone" className="w-full rounded-xl border p-3" value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} /></div>
        </div>
        <div className="mt-5 border-t pt-4 text-gray-700 text-sm">
          <p className="font-semibold mb-1">Order summary</p>
          <div className="flex justify-between"><span>Everwish Card</span><span>$5.00</span></div>
          <div className="flex justify-between items-center mt-2"><span>Gift Card {gift?.brand ? `(${gift.brand} $${Number(gift.amount || 0)})` : "(none)"}</span><div className="flex items-center gap-3">{gift?.brand ? (<><button onClick={onGiftChange} className="text-pink-600 hover:underline">Change</button><button onClick={onGiftRemove} className="text-gray-500 hover:text-red-500" title="Remove gift card">🗑️</button></>) : (<button onClick={onGiftChange} className="text-pink-600 hover:underline">Add</button>)}</div></div>
          <div className="h-px bg-gray-200 my-2" /><div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <Elements stripe={stripePromise}><InlineStripeForm total={total} onSuccess={onClose} /></Elements>
      </motion.div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function EditPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const CARD_PRICE = 5;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));
        const opts = getAnimationsForSlug(slug);
        setAnimOptions(opts);
        setAnim(opts[0] || "❌ None");
      } catch {}
    })();
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    let timer;
    if (!showEdit) {
      const start = performance.now();
      const duration = 3000;
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      timer = setTimeout(() => setShowEdit(true), 3000);
    }
    return () => clearTimeout(timer);
  }, [item, showEdit]);

  const renderEffect = () => {
    if (!anim || /None/.test(anim)) return null;
    const emoji = anim.split(" ")[0];
    return Array.from({ length: 18 }).map((_, i) => (
      <motion.span key={i} className="absolute text-xl z-[35] pointer-events-none" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.85, 0], y: [0, -90], x: [0, Math.random() * 100 - 50], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 4.8 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}>{emoji}</motion.span>
    ));
  };

  if (!item) return null;
  if (!showEdit) return (<div className="fixed inset-0 flex justify-center items-center bg-black">{item.src?.endsWith(".mp4") ? (<><video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" /><div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"><div className="h-full bg-white transition-all duration-200" style={{ width: `${progress}%` }} /></div></>) : (<img src={item.src} alt={slug} className="w-full h-full object-cover" />)}</div>);

  const mediaHeight = isMobile ? 360 : 440;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0">{renderEffect()}</div>
      <div className="relative z-[30]">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (<video src={item.src} muted loop autoPlay playsInline style={{ height: mediaHeight }} className="w-full object-contain" />) : (<img src={item.src} alt={slug} style={{ height: mediaHeight }} className="w-full object-contain" />)}
        </div>
        <section className="mt-4 bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-3">✨ Customize your message ✨</h2>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={isMobile ? 3 : 2} className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400" />
          <select value={anim} onChange={(e) => setAnim(e.target.value)} className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400">{animOptions.map((a, i) => (<option key={i} value={a}>{a}</option>))}<option value="❌ None">❌ None</option></select>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setShowCrop(true)} className="flex-1 rounded-full py-3 font-semibold transition bg-yellow-300 hover:bg-yellow-400 text-[#3b2b1f]">📸 Add Image</button>
            <button onClick={() => setShowGiftPopup(true)} className="flex-1 rounded-full py-3 font-semibold transition bg-pink-100 hover:bg-pink-200 text-pink-700">🎁 Gift Card</button>
          </div>
          <button onClick={() => setShowCheckout(true)} className="mt-4 w-full rounded-full py-3 font-semibold transition bg-purple-500 hover:bg-purple-600 text-white">💜 Checkout</button>
        </section>
      </div>
      {showGiftPopup && <GiftCardPopup onSelect={(g) => { setGift(g); setShowGiftPopup(false); }} onClose={() => setShowGiftPopup(false)} initial={gift} />}
      {showCheckout && <CheckoutPopup total={CARD_PRICE + Number(gift.amount || 0)} gift={gift} onGiftChange={() => setShowGiftPopup(true)} onGiftRemove={() => setGift({ brand: "", amount: 0 })} onClose={() => setShowCheckout(false)} />}
      {showCrop && <CropperModal onClose={() => setShowCrop(false)} onSave={(img) => setUserImage(img)} />}
    </main>
  );
  }
