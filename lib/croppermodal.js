"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";

/**
 * Utilidad: convierte un File a DataURL
 */
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/**
 * Utilidad: crea un Image() a partir de una URL/dataURL
 */
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

/**
 * Recorta la imagen en canvas y devuelve dataURL (jpg)
 * @param {string} imageSrc - dataURL o URL
 * @param {{x:number,y:number,width:number,height:number}} pixelCrop - zona a recortar en px
 * @param {number} rotation - en grados
 * @param {number} maxWidth - opcional, redimensiona salida si es mayor
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, maxWidth = 1600) {
  const image = await createImage(imageSrc);

  const rot = rotation * Math.PI / 180;
  const sin = Math.abs(Math.sin(rot));
  const cos = Math.abs(Math.cos(rot));

  // canvas provisional para rotar la imagen completa
  const tmpCanvas = document.createElement("canvas");
  const tmpCtx = tmpCanvas.getContext("2d");
  const w = image.width;
  const h = image.height;

  // dimensiones tras rotación
  const bBoxW = Math.floor(w * cos + h * sin);
  const bBoxH = Math.floor(w * sin + h * cos);
  tmpCanvas.width = bBoxW;
  tmpCanvas.height = bBoxH;

  // trasladar al centro y rotar
  tmpCtx.translate(bBoxW / 2, bBoxH / 2);
  tmpCtx.rotate(rot);
  tmpCtx.drawImage(image, -w / 2, -h / 2);

  // ahora recorte real desde el canvas rotado
  const outCanvas = document.createElement("canvas");
  const outCtx = outCanvas.getContext("2d");
  outCanvas.width = pixelCrop.width;
  outCanvas.height = pixelCrop.height;

  outCtx.drawImage(
    tmpCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // redimensionado final si excede maxWidth
  if (outCanvas.width > maxWidth) {
    const scale = maxWidth / outCanvas.width;
    const rw = Math.round(outCanvas.width * scale);
    const rh = Math.round(outCanvas.height * scale);

    const resized = document.createElement("canvas");
    const rctx = resized.getContext("2d");
    resized.width = rw;
    resized.height = rh;
    rctx.drawImage(outCanvas, 0, 0, rw, rh);
    return resized.toDataURL("image/jpeg", 0.92);
  }

  return outCanvas.toDataURL("image/jpeg", 0.92);
}

/**
 * CropperModal
 * Props:
 * - onClose(): void
 * - onSave(dataURL: string): void
 * - aspect?: number  (por defecto 16/9)
 * - title?: string   (encabezado opcional)
 */
export default function CropperModal({
  onClose,
  onSave,
  aspect = 16 / 9,
  title = "Adjust your photo",
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const canSave = useMemo(() => !!(imageSrc && croppedAreaPixels), [imageSrc, croppedAreaPixels]);

  const onCropComplete = useCallback((_, areaPx) => {
    setCroppedAreaPixels(areaPx);
  }, []);

  const openFile = () => inputRef.current?.click();

  const onFileChange = async (e) => {
    const f = e?.target?.files?.[0];
    if (!f) return;
    // Limitamos a ~8MB para no saturar memoria
    if (f.size > 8 * 1024 * 1024) {
      alert("Image too large. Please choose one under 8MB.");
      e.target.value = "";
      return;
    }
    try {
      const dataURL = await fileToDataURL(f);
      setImageSrc(dataURL);
    } catch (err) {
      alert("Could not load the image. Try another file.");
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    try {
      setLoading(true);
      const dataUrl = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, 1600);
      onSave?.(dataUrl);
      onClose?.();
    } catch (e) {
      alert("Could not crop the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="relative bg-white w-[92%] max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-[101]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-pink-600">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close cropper"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {!imageSrc ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-600 mb-2 font-medium">
                Upload an image to fit your card
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Tip: use a high-resolution photo to avoid blur.
              </p>
              <button
                onClick={openFile}
                className="rounded-full px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold transition"
              >
                Choose Image
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          ) : (
            <>
              {/* Área de recorte */}
              <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden" style={{ height: 360 }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  restrictPosition={true}
                  objectFit="cover"
                />
              </div>

              {/* Controles */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 border p-4">
                  <label className="text-sm text-gray-600 font-medium">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
                <div className="rounded-xl bg-gray-50 border p-4">
                  <label className="text-sm text-gray-600 font-medium">Rotation</label>
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(parseFloat(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Aspect ratio: <span className="font-semibold">{aspect.toFixed(2)}</span> • Output: JPG (Base64)
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-full px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
            >
              Cancel
            </button>
            <button
              disabled={!canSave || loading}
              onClick={handleSave}
              className={`rounded-full px-5 py-2.5 font-semibold text-white transition ${
                !canSave || loading
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
