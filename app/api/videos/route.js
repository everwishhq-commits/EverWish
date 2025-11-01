export const dynamic = "force-dynamic";

// 🚫 Versión temporal sin lectura de archivos ni dependencias de fs
export async function GET() {
  try {
    // 🎞️ Datos simulados del carrusel
    const videos = [
      {
        slug: "pumpkin_halloween_1A",
        src: "/videos/pumpkin_halloween_1A.mp4",
        name: "Pumpkin Halloween",
        category: "Halloween",
      },
      {
        slug: "ghost_halloween_1A",
        src: "/videos/ghost_halloween_1A.mp4",
        name: "Ghost Halloween",
        category: "Halloween",
      },
      {
        slug: "unicorn_birthday_1A",
        src: "/videos/unicorn_birthday_1A.mp4",
        name: "Unicorn Birthday",
        category: "Birthday",
      },
      {
        slug: "elephant_baby_1A",
        src: "/videos/elephant_baby_1A.mp4",
        name: "Elephant Baby",
        category: "Baby Shower",
      },
      {
        slug: "love_besos_abrazos_1A",
        src: "/videos/love_besos_abrazos_1A.mp4",
        name: "Besos y Abrazos",
        category: "Love",
      },
    ];

    // ✅ Devuelve el JSON de prueba
    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Error simulado en API:", err);
    return new Response(
      JSON.stringify({ error: "Error interno de simulación", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
