"use client";

export default function Page() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-pink-50 text-gray-700 text-center"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <h1 className="text-3xl font-bold mb-4">💌 Everwish is Live!</h1>
      <p className="text-gray-500">
        Si ves esta página, tu app está funcionando correctamente.
      </p>
      <a href="/api/videos" className="mt-6 text-pink-500 underline">
        Ver JSON de videos →
      </a>
    </main>
  );
}
