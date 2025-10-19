"use client";

import { useParams } from "next/navigation";

export default function TestSlugPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || "(no slug)";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffeef0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>🧩 Test Page</h1>
      <p>Slug recibido: <b>{slug}</b></p>
    </main>
  );
}
