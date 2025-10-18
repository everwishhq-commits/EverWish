"use client";
import { useEffect, useState } from "react";
import { getMessageForSlug } from "@/lib/messages";
import { AnimationOverlay } from "@/lib/animations";
import Image from "next/image";

export default function EditPage({ params }) {
  const { slug } = params;
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("none");
  const [photo, setPhoto] = useState(null);
  const [gift, setGift] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    const msg = getMessageForSlug(slug);
    setMessage(msg);
  }, [slug]);

  const handleAnimationChange = (value) => {
    setAnimation(value);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {animation !== "none" && (
        <AnimationOverlay slug={slug}>
          <p className="text-xl font-semibold text-white drop-shadow-lg">
            {animation}
          </p>
        </AnimationOverlay>
      )}

      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-2xl relative z-10">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold capitalize">{slug}</h2>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-md p-2 text-sm mb-4"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Animation Style
          </label>
          <select
            value={animation}
            onChange={(e) => handleAnimationChange(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="none">No Animation</option>
            <option value="fade">Fade</option>
            <option value="float">Float</option>
            <option value="blink">Blink</option>
            <option value="confetti">Confetti</option>
            <option value="hearts">Hearts</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
            className="w-full border rounded-md p-2 text-sm"
          />
          {photo && (
            <Image
              src={photo}
              alt="Preview"
              width={300}
              height={300}
              className="rounded-md mt-2 object-cover"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Signature</label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Your name or note..."
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Giftcard</label>
          <select
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">No Giftcard</option>
            <option value="amazon">Amazon</option>
            <option value="target">Target</option>
            <option value="starbucks">Starbucks</option>
            <option value="more">See more options...</option>
          </select>
        </div>

        <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Save and Continue
        </button>
      </div>
    </div>
  );
            }
