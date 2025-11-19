import { everwishDrive } from '@/lib/everwish-drive';

export async function POST(req) {
  try {
    const { 
      paymentIntentId, 
      sender, 
      recipient, 
      cardData,
      amount 
    } = await req.json();

    console.log('💾 Saving card after payment:', paymentIntentId);

    // Generar ID único
    const cardId = `EW${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Preparar datos de la tarjeta
    const cardInfo = {
      id: cardId,
      slug: cardData.slug || 'custom-card',
      message: cardData.message || '',
      animation: cardData.animation || '',
      sender: {
        name: sender.name,
        email: sender.email,
        phone: sender.phone || '',
      },
      recipient: {
        name: recipient.name,
        email: recipient.email,
        phone: recipient.phone || '',
      },
      payment: {
        intentId: paymentIntentId,
        amount: amount,
        status: 'succeeded',
      },
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    // Guardar tarjeta en Drive
    const cardResult = await everwishDrive.saveCard(cardInfo);

    if (!cardResult) {
      throw new Error('Failed to save card to Drive');
    }

    // Obtener o crear usuario
    let user = await everwishDrive.getUserByEmail(sender.email);

    const everwishId = cardId.substring(0, 12);

    if (!user) {
      // Crear nuevo usuario
      user = {
        email: sender.email,
        phone: sender.phone || '',
        name: sender.name,
        everwishId: everwishId,
        cards: [cardId],
        createdAt: new Date().toISOString(),
      };
    } else {
      // Actualizar usuario existente
      user.cards = user.cards || [];
      if (!user.cards.includes(cardId)) {
        user.cards.push(cardId);
      }
      user.name = sender.name; // Actualizar nombre por si cambió
      user.phone = sender.phone || user.phone; // Actualizar teléfono
    }

    // Guardar usuario
    await everwishDrive.saveUser(user);

    console.log('✅ Card saved successfully:', cardId);

    return Response.json({ 
      success: true, 
      cardId,
      everwishId,
    });

  } catch (error) {
    console.error('❌ Error saving card:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
