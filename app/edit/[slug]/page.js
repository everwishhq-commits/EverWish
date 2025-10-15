"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Cropper from "react-easy-crop";
import { defaultMessageFromSlug, getAnimationsForSlug } from "@/lib/everwishUtils";

/* ========= Stripe Config ========= */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

/* ========= Main Page ========= */
export default function EditPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  // Message + Animation
  const [message, setMessage] = useState("");
  const [animOptions, setAnimOptions] = useState([]);
  const [anim, setAnim] = useState("");

  // Image Upload
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  // GiftCard & Checkout
  const [gift, setGift] = useState({ brand: "", amount: 0 });
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const CARD_PRICE = 5;

  /* ========= Load Video / Image ========= */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const list = await res.json();
      const found = list.find((v) => v.slug === slug);
      setItem(found || null);

      const msg = defaultMessageFromSlug(slug);
      setMessage(msg);
      const opts = getAnimationsForSlug(slug);
      setAnimOptions(opts);
      setAnim(opts[0] || "❌ None");
    })();
  }, [slug]);

  /* ========= Fullscreen Intro ========= */
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

  /* ========= Image Cropper Functions ========= */
  const onCropComplete = (croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels);

  const getCroppedImage = async () => {
    const image = await createCroppedImage(imageSrc, croppedArea);
    setFinalImage(image);
    setShowCropper(false);
  };

  const createCroppedImage = (imageSrc, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = crop.width;
        canvas.height = crop.height;
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  /* ========= Render Fullscreen Intro ========= */
  if (!showEdit) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        {item?.src?.endsWith(".mp4") ? (
          <>
            <video src={item.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div className="h-full bg-white" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <img src={item?.src} alt={slug} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  /* ========= Render Crop Editor ========= */
  if (showCropper) {
    return (
      <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
        <div className="relative w-80 h-80 bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            cropShape="rect"
            aspect={1}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button onClick={getCroppedImage} className="px-4 py-2 bg-green-500 text-white rounded-full">Save</button>
          <button onClick={() => setShowCropper(false)} className="px-4 py-2 bg-gray-400 text-white rounded-full">Cancel</button>
        </div>
      </div>
    );
  }

  /* ========= Main Editor ========= */
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 bg-[#fff8f5] min-h-screen relative">
      {/* Media Section */}
      <div className="rounded-3xl overflow-hidden bg-white shadow-md relative">
        {item?.src?.endsWith(".mp4") ? (
          <video src={item.src} muted loop autoPlay playsInline className="w-full h-[420px] object-contain" />
        ) : (
          <img src={item.src} alt={slug} className="w-full h-[420px] object-contain" />
        )}
      </div>

      {/* Editor Section */}
      <section className="mt-6 bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Customize your message ✨</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border p-4 text-center"
        />

        {/* Upload Image */}
        <div className="mt-4 flex flex-col items-center">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="upload-img" />
          <label htmlFor="upload-img" className="cursor-pointer bg-yellow-300 px-5 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 transition">
            📸 Upload Image
          </label>
        </div>

        {finalImage && (
          <div className="mt-4 flex justify-center">
            <img src={finalImage} alt="Uploaded" className="max-h-48 rounded-lg shadow" />
          </div>
        )}

        {/* Animation Selector */}
        <select
          value={anim}
          onChange={(e) => setAnim(e.target.value)}
          className="w-full mt-4 rounded-2xl border p-3 text-center"
        >
          {animOptions.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
          <option value="❌ None">❌ None</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setShowGiftPopup(true)}
            className="w-[48%] rounded-full py-3 font-semibold text-[#3b2b1f] bg-yellow-300 hover:bg-yellow-400"
          >
            🎁 Choose Gift Card
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-[48%] bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full"
          >
            Checkout 💳
          </button>
        </div>

        {gift.brand && (
          <div className="mt-3 text-center text-sm text-gray-600">
            Selected: <strong>{gift.brand}</strong> — ${gift.amount.toFixed(2)}
          </div>
        )}
      </section>

      {/* TODO: Aquí puedes agregar el modal de GiftCard y Stripe (idénticos a los que ya tienes en tu versión actual). */}
    </main>
  );
          }
