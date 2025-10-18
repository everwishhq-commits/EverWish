"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getAnimationsForSlug,
  getAnimationOptionsForSlug,
  AnimationOverlay,
} from "@/lib/animations";
import { getMessageForSlug } from "@/lib/messages";
import GiftCardPopup from "@/lib/giftcard";
import CheckoutModal from "@/lib/checkout";
import CropperModal from "@/lib/croppermodal";

export default function EditPage({ params }) {
  const slug = params.slug;
  const [stage, setStage] = useState("expanded");
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("");
  const [animationOptions, setAnimationOptions] = useState([]);
  const [videoSrc, setVideoSrc] = useState("");

  const [gift, setGift] = useState(null);
  const [showGift, setShowGift] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [total, setTotal] = useState(5);

  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    setMessage(getMessageForSlug(slug));
    const opts = getAnimationOptionsForSlug(slug);
    setAnimationOptions(opts);
    setAnimation(opts.find((a) => !a.includes("None")) || opts[0]);
    setVideoSrc(`/videos/${slug}.mp4`);
  }, [slug]);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1;
      setProgress(v);
      if (v >= 100) {
        clearInterval(id);
        setStage("editor");
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const updateGift = (data) => {
    setGift(data);
    setShowGift(false);
    setTotal(5 + (data?.amount || 0));
  };

  const removeGift = () => {
    setGift(null);
    setTotal(5);
  };

  const handleCardClick = () => {
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3500);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.download = `${slug}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const category = useMemo(() => getAnimationsForSlug(slug), [slug]);
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey(Date.now());
  }, [animation, category]);

  return (
    <div className="relative min-h-[100dvh] bg-[#fff7f5] flex flex-col items-center overflow-hidden">
      {stage === "expanded" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fff7f5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-8 w-2/3 h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.03, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {stage === "editor" && (
        <>
          <AnimationOverlay key={animKey} slug={slug} animation={animation} />

          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-[200] w-full max-w-md rounded-3xl bg-white p-5 shadow-xl mt-6 mb-10"
          >
            {/* Tarjeta principal */}
            <div
              className="relative mb-4 overflow-hidden rounded-2xl border bg-gray-50"
              onClick={handleCardClick}
            >
              <video
                src={videoSrc}
                className="w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Mensaje */}
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-700">
              ✨ Customize your message ✨
            </h3>
            <textarea
              className="w-full rounded-2xl border p-3 text-center text-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Imagen del usuario (si hay) */}
            {userImage && (
              <div className="my-4">
                <img
                  src={userImage}
                  alt="User upload"
                  className="w-full rounded-2xl border border-gray-200 shadow-sm"
                />
              </div>
            )}

            {/* Selector de animación */}
            <div className="my-3">
              <select
                className="w-full rounded-xl border p-3 text-center font-medium text-gray-600 focus:border-pink-400 focus:ring-pink-400"
                value={animation}
                onChange={(e) => setAnimation(e.target.value)}
              >
                {animationOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowCrop(true)}
                className="z-[210] flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
              >
                📸 Add Image
              </button>
              <button
                onClick={() => setShowGift(true)}
                className="z-[210] flex items-center gap-2 rounded-full bg-pink-200 px-5 py-3 font-semibold text-pink-700 hover:bg-pink-300"
              >
                🎁 Gift Card
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="z-[210] flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-600"
              >
                💳 Checkout
              </button>
            </div>

            {/* Botón de descarga */}
            {showDownload && (
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleDownload}
                className="fixed bottom-10 right-6 z-[400] rounded-full bg-[#ff7b00] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#ff9f33]"
              >
                ⬇️ Download
              </motion.button>
            )}
          </motion.div>
        </>
      )}

      {/* Popups */}
      {showGift && (
        <GiftCardPopup
          initial={gift}
          onSelect={updateGift}
          onClose={() => setShowGift(false)}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          total={total}
          gift={gift}
          onGiftChange={() => setShowGift(true)}
          onGiftRemove={removeGift}
          onClose={() => setShowCheckout(false)}
        />
      )}
      {showCrop && (
        <CropperModal
          open={showCrop}
          onClose={() => setShowCrop(false)}
          onDone={(img) => {
            setUserImage(img);
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
       }
