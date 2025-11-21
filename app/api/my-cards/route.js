export const dynamic = "force-dynamic"; // ⬅️ evita prerender y elimina el error

import { everwishDrive } from '@/lib/everwish-drive';

export async function GET(req) {
  try {
    // ⬅️ Esto corrige el WARNING de Next.js
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return Response.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    console.log('📂 Loading cards for:', email);

    const cards = await everwishDrive.getCardsByEmail(email);

    console.log(`✅ Found ${cards.length} cards`);

    return Response.json({ 
      success: true,
      cards 
    });

  } catch (error) {
    console.error('❌ Error loading cards:', error);
    return Response.json({ 
      success: false,
      error: error.message,
      cards: []
    }, { status: 500 });
  }
}
