import { isAdminUser } from "@/lib/admin-config";

export async function POST(req) {
  try {
    const body = await req.json();
    const { senderEmail, senderPhone, isAdminSend } = body;

    if (!isAdminSend || !isAdminUser(senderEmail, senderPhone)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Enviar email aquí
    console.log("📧 Admin send:", body);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
