import { everwishDrive } from '@/lib/everwish-drive';

export async function POST(req) {
  try {
    const { 
      paymentIntentId, 
      sender, 
      recipient, 
      cardData,
      amount,
    } = await req.json();

    console.log('💾 Saving card after payment:', paymentIntentId);

    const cardId = `EW${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // ========================================
    // CREAR LINK DE LA TARJETA
    // ========================================
    const cardLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://everwish.cards'}/view/${cardId}`;
    console.log('🔗 Card link:', cardLink);

    // ========================================
    // GUARDAR TARJETA EN DRIVE
    // ========================================
    const cardInfo = {
      id: cardId,
      slug: cardData.slug || 'custom-card',
      message: cardData.message || '',
      animation: cardData.animation || '',
      link: cardLink, // 🔗 Link de la tarjeta
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

    const cardResult = await everwishDrive.saveCard(cardInfo);

    if (!cardResult) {
      throw new Error('Failed to save card to Drive');
    }

    console.log('✅ Card saved successfully:', cardId);

    // ========================================
    // GUARDAR/ACTUALIZAR USUARIO
    // ========================================
    let user = await everwishDrive.getUserByEmail(sender.email);
    const everwishId = cardId.substring(0, 12);

    if (!user) {
      user = {
        email: sender.email,
        phone: sender.phone || '',
        name: sender.name,
        everwishId: everwishId,
        cards: [cardId],
        createdAt: new Date().toISOString(),
      };
    } else {
      user.cards = user.cards || [];
      if (!user.cards.includes(cardId)) {
        user.cards.push(cardId);
      }
      user.name = sender.name;
      user.phone = sender.phone || user.phone;
    }

    await everwishDrive.saveUser(user);

    console.log('✅ User updated successfully');

    // ========================================
    // AQUÍ DEBERÍAS ENVIAR EL EMAIL/SMS
    // ========================================
    console.log('📧 TODO: Send card link to recipient');
    console.log(`   To: ${recipient.email}`);
    console.log(`   Link: ${cardLink}`);

    // TODO: Implementar envío con Resend o Twilio
    // await sendEmail({
    //   to: recipient.email,
    //   subject: `${sender.name} sent you a special card! 💌`,
    //   html: `
    //     <h1>You received a card from ${sender.name}!</h1>
    //     <p>${cardData.message}</p>
    //     <a href="${cardLink}">View your card</a>
    //   `
    // });

    return Response.json({
      success: true,
      cardId,
      everwishId,
      cardLink, // 🔗 Incluir link en la respuesta
    });

  } catch (error) {
    console.error('❌ Error saving card:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
