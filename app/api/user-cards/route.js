// app/api/user-cards/route.js
import { NextResponse } from "next/server";

// Marcar como dynamic route para evitar error de build
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // TODO: Conectar con tu base de datos real
    // Por ahora retornamos un array vacío
    // En producción, esto debería hacer una query a PostgreSQL:
    // SELECT * FROM cards WHERE customer_email = $1 ORDER BY created_at DESC

    const cards = [];
    
    // Ejemplo de cómo debería verse la respuesta con datos reales:
    /*
    const cards = [
      {
        id: "card_123",
        slug: "EW1763785804331XK9CU2OEQ",
        recipientName: "María García",
        recipientEmail: "maria@example.com",
        recipientPhone: "+1234567890",
        category: "Birthday",
        message: "¡Feliz cumpleaños!",
        videoUrl: "https://cloudinary.com/video.mp4",
        imageName: "birthday-cake.mp4",
        status: "sent", // "sent" o "pending"
        orientation: "vertical", // "vertical" o "horizontal"
        createdAt: "2024-01-15T10:30:00Z"
      }
    ];
    */

    return NextResponse.json({
      success: true,
      cards,
      total: cards.length
    });

  } catch (error) {
    console.error("Error fetching user cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
