{stage === "expanded" && (
  <motion.div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fff7f5] overflow-hidden"
    style={{ height: "105vh" }} // 🔹 un poco más alto que la pantalla
  >
    {videoFound ? (
      <video
        src={match?.file}
        className="w-[90vw] sm:w-[380px] md:w-[420px] aspect-[4/5.2] rounded-2xl shadow-lg object-cover object-center bg-pink-50"
        autoPlay
        loop
        muted
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />
    ) : (
      <div className="text-gray-500 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-lg">Video not found: {slug}</p>
      </div>
    )}

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
