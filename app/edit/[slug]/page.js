"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// 🎃 Auto message generator
function defaultMessageFromSlug(slug) {
  const s = (slug || "").toLowerCase();
  if (/halloween/.test(s) && /love/.test(s))
    return "Between scares and sighs, my heart still chooses you. 🖤🎃";
  if (/halloween/.test(s) && /birthday/.test(s))
    return "May your day rise again with pumpkin magic and sweet joy! 🎃🎂";
  if (/zombie/.test(s) && /birthday/.test(s))
    return "Wishing you laughs, brains, and cake on your special day! 🧟‍♂️🎂";
  if (/ghost/.test(s) && /love/.test(s))
    return "Sending ghostly hugs and endless love from the beyond. 👻💞";
  if (/pumpkin/.test(s) && /halloween/.test(s))
    return "May your night glow with magic and endless treats. ✨🍬";
  if (/love/.test(s))
    return "Thank you for existing. Let love’s magic wrap around you today. 💖";
  if (/birthday/.test(s))
    return "Happy Birthday! Wishing you a day full of joy and surprises. 🎉";
  return "Celebrate this moment with a smile. Wishing you peace and light. ✨";
}

export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("sparkles");
  const [showEdit, setShowEdit] = useState(false);

  // 🧾 GiftCard + Customer popups
  const [giftCard, setGiftCard] = useState(null);
  const [showGCModal, setShowGCModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));

        // Pantalla completa temporal
        const el = document.documentElement;
        const goFull = async () => {
          try {
            if (el.requestFullscreen) await el.requestFullscreen();
            else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
          } catch {}
        };
        goFull();
        setTimeout(async () => {
          if (document.fullscreenElement) await document.exitFullscreen();
          setShowEdit(true);
        }, 3000);
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  // ✨ Animaciones visuales
  const renderEffect = () => {
    if (anim === "sparkles")
      return Array.from({ length: 15 }).map((_, i) => (
        <motion.span key={i} className="absolute text-yellow-300 text-xl"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -80], x: [0, Math.random()*100-50], scale: [0.6, 1.2, 0] }}
          transition={{ duration: 3 + Math.random()*2, repeat: Infinity, delay: i*0.3 }}
          style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}>✨</motion.span>
      ));
    if (anim === "hearts")
      return Array.from({ length: 12 }).map((_, i) => (
        <motion.span key={i} className="absolute text-pink-400 text-2xl"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -100], x: [0, Math.random()*80-40], scale: [0.8, 1.2, 0] }}
          transition={{ duration: 3 + Math.random()*2, repeat: Infinity, delay: i*0.4 }}
          style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}>💖</motion.span>
      ));
    if (anim === "confetti")
      return Array.from({ length: 20 }).map((_, i) => (
        <motion.span key={i} className="absolute text-lg"
          initial={{ opacity: 0, y: -10, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 120], rotate: [0, 360] }}
          transition={{ duration: 3 + Math.random()*2, repeat: Infinity, delay: i*0.2 }}
          style={{
            color: ["#ff80b5", "#ffd700", "#4dd4ff", "#baffc9"][Math.floor(Math.random()*4)],
            left: `${Math.random()*100}%`,
          }}>•</motion.span>
      ));
    return null;
  };

  if (!item) return null;

  // 🟣 Vista inicial fullscreen
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item.src?.endsWith(".mp4") ? (
          <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={item.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  // ✅ Checkout handler
  const handleCheckout = async () => {
    if (!email || !phone) return setShowCustomerModal(true);
    alert(`Checkout:\nGiftCard: ${giftCard?.brand || "none"} $${giftCard?.amount || 0}\nEmail: ${email}\nPhone: ${phone}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">{renderEffect()}</div>

      <div className="relative z-10">
        <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white">
          {item.src?.endsWith(".mp4") ? (
            <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
          ) : (
            <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
          )}
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">{renderEffect()}</div>

          <h2 className="text-xl font-semibold text-center mb-4 relative z-10">Customize your message ✨</h2>
          <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={3}
            className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400 relative z-10" />

          {/* ✨ Animation */}
          <select value={anim} onChange={(e)=>setAnim(e.target.value)}
            className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400 relative z-10">
            <option value="sparkles">✨ Sparkles</option>
            <option value="confetti">🎉 Confetti</option>
            <option value="hearts">💖 Hearts</option>
            <option value="none">❌ None</option>
          </select>

          {/* 💳 Gift Card */}
          <button
            onClick={() => setShowGCModal(true)}
            className="w-full mt-4 rounded-2xl border border-gray-300 py-3 text-gray-700 hover:bg-pink-50 relative z-10"
          >
            {giftCard ? `${giftCard.brand} $${giftCard.amount}` : "Add Gift Card"}
          </button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCheckout}
            className="w-full mt-5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 transition relative z-10"
          >
            Checkout 💳
          </motion.button>
        </section>
      </div>

      {/* 💳 GiftCard Modal */}
      {showGCModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-3">Choose Gift Card</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {["Amazon","Walmart","Target","Apple","Starbucks","Google Play"].map((brand)=>(
                <button key={brand}
                  onClick={()=>setGiftCard((prev)=>({...prev, brand}))}
                  className={`border py-3 rounded-xl ${giftCard?.brand===brand?"border-pink-500 bg-pink-50":"border-gray-300"}`}>
                  {brand}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[10,25,50,100].map((amt)=>(
                <button key={amt}
                  onClick={()=>setGiftCard((prev)=>({...prev, amount:amt}))}
                  className={`px-4 py-2 rounded-xl border ${giftCard?.amount===amt?"border-pink-500 bg-pink-50":"border-gray-300"}`}>
                  ${amt}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowGCModal(false)} className="w-full bg-pink-500 text-white py-3 rounded-xl">Done</button>
          </div>
        </div>
      )}

      {/* 👤 Customer Info Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-3">Enter Your Info</h3>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email" className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-pink-400"/>
            <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)}
              placeholder="Phone number" className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-pink-400"/>
            <button onClick={()=>setShowCustomerModal(false)} className="w-full bg-pink-500 text-white py-3 rounded-xl">Continue</button>
          </div>
        </div>
      )}
    </main>
  );
            }
