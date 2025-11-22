// app/api/cards/[slug]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // TODO: Conectar con tu base de datos real
    // Por ahora retornamos un objeto de ejemplo
    // En producción, esto debería hacer una query a PostgreSQL:
    // SELECT * FROM cards WHERE slug = $1

    // Retornar 404 por ahora (hasta que conectes la DB)
    return NextResponse.json(
      { error: "Card not found" },
      { status: 404 }
    );

    // Ejemplo de cómo debería verse la respuesta con datos reales:
    /*
    const card = {
      id: "card_123",
      slug: slug,
      recipientName: "María García",
      recipientEmail: "maria@example.com",
      recipientPhone: "+1234567890",
      category: "Birthday",
      subcategory: "Adult Birthday",
      message: "¡Feliz cumpleaños!",
      videoUrl: "https://res.cloudinary.com/.../video.mp4",
      imageName: "birthday-cake.mp4",
      orientation: "vertical",
      status: "pending",
      customerEmail: "sender@example.com",
      customerPhone: "+9876543210",
      createdAt: "2024-01-15T10:30:00Z"
    };

    return NextResponse.json(card);
    */

  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Endpoint para actualizar la tarjeta
export async function PATCH(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // TODO: Conectar con tu base de datos real
    // En producción, esto debería hacer un UPDATE a PostgreSQL:
    // UPDATE cards SET 
    //   recipient_name = $1,
    //   recipient_email = $2,
    //   recipient_phone = $3,
    //   message = $4
    // WHERE slug = $5

    console.log("Updating card:", slug, body);

    return NextResponse.json({
      success: true,
      message: "Card updated successfully"
    });

  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
