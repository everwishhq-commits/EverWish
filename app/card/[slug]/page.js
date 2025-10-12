"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CardPreview() {
  const { slug } = useParams(); // viene del archivo clickeado (ej: pumpkin_halloween_general_1A)
  const router = useRouter();
  const [item, setItem] = useState(null);

  // Carga el listado y encuentra el ítem por slug
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch("/api/videos", { cache: "no-store" });
        const list = await res.json();
        const found = list.find((v) => v.slug === slug);
        if (isMounted) setItem(found || null);
      } catch (e) {
        console.error("No se pudo cargar /api/videos", e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Redirige a /edit/[slug] después de 3s
  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => router.push(`/edit/${encodeURIComponent(slug)}`), 3000);
    return () => clearTimeout(t);
  }, [item, slug, router]);

  // Estilos de full-bleed
  const wrapperCls = useMemo(
    () =>
      "fixed inset-0 bg-black/90 flex items-center justify-center p-0 m-0 z-50",
    []
  );

  if (!item) {
    return (
      <div className={wrapperCls}>
        <div className="text-white/80 text-lg">Cargando…</div>
      </div>
    );
  }

  const isVideo = String(item.src).toLowerCase().endsWith(".mp4");

  return (
    <div className={wrapperCls}>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => router.push(`/edit/${encodeURIComponent(slug)}`)}
          className="px-4 py-2 rounded-full bg-white text-black font-medium shadow"
        >
          Saltar → Editar
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        {isVideo ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={item.src}
            alt={item.title || item.slug}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
    }
