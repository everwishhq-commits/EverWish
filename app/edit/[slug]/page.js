<div
  className="relative w-full flex justify-center items-center"
  style={{
    height: "440px",      // 🔹 Altura visual del contenedor (puedes subir a 460px o 480px)
    marginTop: "0vh",     // 🔹 Si quieres subir toda la tarjeta, pon negativo: "-2vh"
    marginBottom: "0vh",  // 🔹 Si quieres bajarla, pon positivo: "2vh"
  }}
>
  <video
    src={match.file}  // 🔹 Usa directamente el archivo del video actual
    autoPlay
    loop
    muted
    playsInline
    controlsList="nodownload noplaybackrate"
    draggable="false"
    onContextMenu={(e) => e.preventDefault()}
    className="
      w-[300px] sm:w-[320px] md:w-[340px]
      h-[420px]
      aspect-[4/5]
      rounded-2xl shadow-lg
      object-cover object-center
      bg-pink-50 overflow-hidden
    "
  />
</div>
