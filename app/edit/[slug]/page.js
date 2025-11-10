"use client";

export default function EditPage() {
  const match = { file: "/videos/sample.mp4" }; // 🔹 usa tu video o endpoint real

  return (
    <div
      className="relative w-full flex justify-center items-center bg-[#fff7f5]"
      style={{
        height: "460px",     // 🔹 altura del contenedor del video
        marginTop: "2vh",    // 🔹 espacio superior
        marginBottom: "2vh", // 🔹 espacio inferior
      }}
    >
      <video
        src={match.file}
        autoPlay
        loop
        muted
        playsInline
        controlsList="nodownload noplaybackrate"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        className="
          w-[300px] sm:w-[320px] md:w-[340px]
          h-[430px]
          aspect-[4/5]
          rounded-2xl shadow-lg
          object-cover object-center
          bg-pink-50 overflow-hidden
        "
      />
    </div>
  );
}
