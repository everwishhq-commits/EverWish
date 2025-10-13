"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

/* Helpers */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function defaultMessageFromSlug(slug = "") {
  const s = slug.toLowerCase();
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

/* Gift catalog */
const GIFT_CATALOG = {
  Popular: [
    { id: "amazon", name: "Amazon" },
    { id: "walmart", name: "Walmart" },
    { id: "target", name: "Target" },
    { id: "starbucks", name: "Starbucks" },
    { id: "apple", name: "Apple" },
    { id: "googleplay", name: "Google Play" },
  ],
  Lifestyle: [
    { id: "nike", name: "Nike" },
    { id: "adidas", name: "Adidas" },
    { id: "uber", name: "Uber" },
    { id: "doordash", name: "DoorDash" },
    { id: "airbnb", name: "Airbnb" },
  ],
  Digital: [
    { id: "spotify", name: "Spotify" },
    { id: "netflix", name: "Netflix" },
    { id: "xbox", name: "Xbox" },
    { id: "playstation", name: "PlayStation" },
  ],
};

const EXTRA_OPTIONS = {
  Popular: [
    { id: "bestbuy", name: "Best Buy" },
    { id: "home_depot", name: "Home Depot" },
    { id: "lowes", name: "Lowe’s" },
  ],
  Lifestyle: [
    { id: "sephora", name: "Sephora" },
    { id: "ulta", name: "Ulta" },
  ],
  Digital: [
    { id: "steam", name: "Steam" },
    { id: "disney", name: "Disney+" },
  ],
};

const AMOUNTS = [10, 25, 50, 100];

export default function EditPage() {
  const { slug } = useParams();

  /* State */
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");
  const [anim, setAnim] = useState("hearts");
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Gift
  const [giftModal, setGiftModal] = useState(false);
  const [giftTab, setGiftTab] = useState("Popular");
  const [showMore, setShowMore] = useState(false);
  const [giftBrand, setGiftBrand] = useState(null); // {id,name}
  const [giftAmount, setGiftAmount] = useState(null);

  // Checkout
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sender, setSender] = useState({ name: "", email: "", phone: "" });
  const [recipient, setRecipient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const cardPrice = 2.99;
  const giftPrice = giftAmount ? Number(giftAmount) : 0;
  const total = (cardPrice + giftPrice).toFixed(2);

  /* Load item */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        setItem(found || null);
        setMessage(defaultMessageFromSlug(slug));
      } catch (e) {
        console.error("Error loading /api/videos", e);
      }
    })();
  }, [slug]);

  /* Fullscreen intro (3s + barra) */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const start = performance.now();
        const DURATION = 3000;
        const tick = () => {
          const p = Math.min(1, (performance.now() - start) / DURATION);
          if (mounted) setProgress(Math.round(p * 100));
          if (p < 1 && mounted) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();

        await sleep(3000);

        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
        if (mounted) setShowEdit(true);
      } catch {
        setShowEdit(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* Front effects */
  const Effects = useMemo(() => {
    if (anim === "hearts") {
      return (
        <div className="pointer-events-none absolute inset-0 z-[30] overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-pink-500 text-2xl"
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -120],
                x: [0, Math.random() * 80 - 40],
                scale: [0.8, 1.2, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.25,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              💖
            </motion.span>
          ))}
        </div>
      );
    }
    if (anim === "sparkles") {
      return (
        <div className="pointer-events-none absolute inset-0 z-[30] overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-yellow-300 text-xl"
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -100],
                x: [0, Math.random() * 100 - 50],
                scale: [0.6, 1.1, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              ✨
            </motion.span>
          ))}
        </div>
      );
    }
    if (anim === "confetti") {
      return (
        <div className="pointer-events-none absolute inset-0 z-[30] overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-lg"
              initial={{ opacity: 0, y: -20, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 140],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              style={{
                color: ["#ff80b5", "#ffd700", "#4dd4ff", "#baffc9"][
                  Math.floor(Math.random() * 4)
                ],
                left: `${Math.random() * 100}%`,
              }}
            >
              •
            </motion.span>
          ))}
        </div>
      );
    }
    return null;
  }, [anim]);

  if (!item) return null;

  /* Step 1: Fullscreen preview con barra */
  if (!showEdit) {
    return (
      <div className="fixed inset-0 bg-black">
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/20">
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        {item.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.src}
            alt={slug}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  /* Gift modal */
  function GiftModal() {
    const visibleOptions = showMore
      ? [...(GIFT_CATALOG[giftTab] || []), ...(EXTRA_OPTIONS[giftTab] || [])]
      : GIFT_CATALOG[giftTab] || [];

    return (
      <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-5 relative">
          <button
            onClick={() => setGiftModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="close"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold mb-3">Choose a Gift Card</h3>

          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex gap-2">
              {Object.keys(GIFT_CATALOG).map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    giftTab === t
                      ? "bg-pink-100 text-pink-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => {
                    setGiftTab(t);
                    setShowMore(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMore((s) => !s)}
              className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
            >
              {showMore ? "Hide" : `More in ${giftTab}`}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {visibleOptions.map((opt) => {
              const active = giftBrand?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setGiftBrand(opt)}
                  className={`rounded-xl border px-4 py-3 text-center transition ${
                    active
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm font-medium text-gray-700">Amount (USD)</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            {AMOUNTS.map((a) => {
              const active = Number(giftAmount) === a;
              return (
                <button
                  key={a}
                  onClick={() => setGiftAmount(a)}
                  className={`px-4 py-2 rounded-xl border text-sm transition ${
                    active
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  ${a}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setGiftModal(false)}
            className="mt-6 w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* Checkout modal */
  function CheckoutModal() {
    const inputCls =
      "w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400";

    return (
      <div className="fixed inset-0 z-[70] bg-black/45 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 relative">
          <button
            onClick={() => setCheckoutOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="close"
          >
            ✕
          </button>

          <h3 className="text-2xl font-bold mb-4">Checkout</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Sender <span className="text-pink-600">*</span>
              </p>
              <input
                placeholder="Full name"
                className={inputCls}
                value={sender.name}
                onChange={(e) => setSender({ ...sender, name: e.target.value })}
              />
              <input
                placeholder="Email"
                type="email"
                className={`${inputCls} mt-2`}
                value={sender.email}
                onChange={(e) => setSender({ ...sender, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                className={`${inputCls} mt-2`}
                value={sender.phone}
                onChange={(e) => setSender({ ...sender, phone: e.target.value })}
              />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Recipient <span className="text-pink-600">*</span>
              </p>
              <input
                placeholder="Full name"
                className={inputCls}
                value={recipient.name}
                onChange={(e) =>
                  setRecipient({ ...recipient, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                type="email"
                className={`${inputCls} mt-2`}
                value={recipient.email}
                onChange={(e) =>
                  setRecipient({ ...recipient, email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className={`${inputCls} mt-2`}
                value={recipient.phone}
                onChange={(e) =>
                  setRecipient({ ...recipient, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 p-4">
            <p className="font-semibold mb-2">Order summary</p>
            <div className="flex justify-between text-sm">
              <span>Card</span>
              <span>${cardPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mt-1 items-center">
              <span>
                Gift Card {giftBrand ? `— ${giftBrand.name} $${giftAmount}` : "(none)"}
              </span>
              <div className="flex items-center gap-2">
                {giftBrand ? (
                  <>
                    <span>${giftPrice.toFixed(2)}</span>
                    <button
                      title="Remove gift card"
                      onClick={() => {
                        setGiftBrand(null);
                        setGiftAmount(null);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => setGiftModal(true)}
                      className="text-pink-600 hover:underline"
                    >
                      Change
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setGiftModal(true)}
                    className="text-pink-600 hover:underline"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-200 my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3"
            onClick={() => {
              if (
                !sender.name ||
                !sender.email ||
                !sender.phone ||
                !recipient.name ||
                !recipient.email ||
                !recipient.phone
              ) {
                alert("Please complete all required fields (*)");
                return;
              }
              alert(
                `Ready to pay $${total}\nGift: ${
                  giftBrand ? `${giftBrand.name} $${giftAmount}` : "none"
                }`
              );
            }}
          >
            Pay ${total}
          </button>
        </div>
      </div>
    );
  }

  /* Step 2: Editor */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative bg-[#fff8f5] min-h-screen overflow-hidden">
      {/* efectos arriba de todo */}
      {Effects}

      <div className="relative w-full rounded-3xl shadow-md overflow-hidden bg-white z-[10]">
        {item.src?.toLowerCase().endsWith(".mp4") ? (
          <video
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-[420px] object-contain"
          />
        ) : (
          <img
            src={item.src}
            alt={slug}
            className="w-full h-[420px] object-contain"
          />
        )}
      </div>

      <section className="mt-6 bg-white rounded-3xl shadow-md p-6 relative z-[20]">
        {/* efectos también dentro del cuadro */}
        <div className="absolute inset-0">{Effects}</div>

        <h2 className="text-xl font-semibold text-center mb-4 relative z-10">
          Customize your message ✨
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-gray-300 p-4 text-center focus:ring-2 focus:ring-pink-400 relative z-10 bg-white"
        />

        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-3 rounded-2xl border border-gray-300 p-3 text-center focus:ring-2 focus:ring-pink-400 relative z-10 bg-white"
        >
          <option value="hearts">💖 Hearts</option>
          <option value="sparkles">✨ Sparkles</option>
          <option value="confetti">🎉 Confetti</option>
          <option value="none">❌ None</option>
        </select>

        {/* botones principales */}
        <div className="mt-4 grid grid-cols-2 gap-3 relative z-10">
          <button
            onClick={() => setGiftModal(true)}
            className="rounded-full bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3"
          >
            🎁 Choose Gift Card
          </button>
          <button
            onClick={() => setCheckoutOpen(true)}
            className="rounded-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3"
          >
            Checkout 💜
          </button>
        </div>

        {/* seleccionado + trash */}
        {giftBrand && (
          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-gray-700">
            <span>
              Selected: <b>{giftBrand.name}</b> — ${giftAmount}.00
            </span>
            <button
              title="Remove gift card"
              onClick={() => {
                setGiftBrand(null);
                setGiftAmount(null);
              }}
              className="text-gray-500 hover:text-red-500"
            >
              🗑️
            </button>
          </div>
        )}
      </section>

      {giftModal && <GiftModal />}
      {checkoutOpen && <CheckoutModal />}
    </m
