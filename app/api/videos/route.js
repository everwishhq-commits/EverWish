// 🚫 API temporalmente desactivada para pruebas en Vercel build
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "API temporalmente desactivada para pruebas.",
      videos: [],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
