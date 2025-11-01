export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 📂 Lee directamente el index.json generado por el script
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/videos/index.json`);

    // Si falla el fetch (por ejemplo, en local), intenta ruta relativa
    if (!res.ok) {
      const fallback = await fetch("/videos/index.json");
      const data = await fallback.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Error leyendo index.json:", err);
    return new Response(
      JSON.stringify({
        error: "No se pudo leer el index.json",
        details: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
