export default async function TestVideos() {
  // Intentamos leer el index.json
  let videos = [];
  try {
    const res = await fetch("https://everwish.vercel.app/videos/index.json", {
      cache: "no-store",
    });
    if (res.ok) {
      videos = await res.json();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    console.error("❌ No se pudo cargar el index.json:", e);
  }

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        background: "#fff7f5",
      }}
    >
      {videos.length === 0 && (
        <p style={{ color: "#ff5050", fontSize: "18px" }}>
          ⚠️ No se encontró ningún video en /videos/index.json
        </p>
      )}
      {videos.map((v, i) => (
        <div
          key={i}
          style={{
            width: "200px",
            height: "260px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <video
            src={v.file}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
