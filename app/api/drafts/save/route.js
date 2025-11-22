// app/api/drafts/save/route.js
// API endpoint para sincronizar drafts con Neon

import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  try {
    const draft = await request.json();
    
    // Validar datos requeridos
    if (!draft.id || !draft.slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Upsert en Neon (insertar o actualizar)
    const result = await sql`
      INSERT INTO drafts (
        id,
        temp_user_id,
        user_email,
        slug,
        message,
        animation,
        user_image,
        intensity,
        emoji_count,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${draft.id},
        ${draft.tempUserId || null},
        ${draft.userEmail || null},
        ${draft.slug},
        ${draft.message || ''},
        ${draft.animation || ''},
        ${draft.userImage || null},
        ${draft.intensity || 'normal'},
        ${draft.emojiCount || 20},
        'draft',
        ${draft.createdAt},
        ${draft.updatedAt}
      )
      ON CONFLICT (id) 
      DO UPDATE SET
        message = EXCLUDED.message,
        animation = EXCLUDED.animation,
        user_image = EXCLUDED.user_image,
        intensity = EXCLUDED.intensity,
        emoji_count = EXCLUDED.emoji_count,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `;
    
    console.log("✅ Draft sincronizado con Neon:", draft.id);
    
    return NextResponse.json({
      success: true,
      draft: result[0]
    });
    
  } catch (error) {
    console.error("❌ Error sincronizando draft:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// GET: Cargar drafts de un usuario desde Neon
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const tempId = searchParams.get('tempId');
    
    if (!email && !tempId) {
      return NextResponse.json(
        { error: "Email or tempId required" },
        { status: 400 }
      );
    }
    
    // Buscar drafts del usuario
    const drafts = await sql`
      SELECT * FROM drafts
      WHERE (user_email = ${email} OR temp_user_id = ${tempId})
        AND status = 'draft'
      ORDER BY updated_at DESC
    `;
    
    return NextResponse.json({
      success: true,
      drafts: drafts
    });
    
  } catch (error) {
    console.error("❌ Error cargando drafts:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
