import { everwishDrive } from './everwish-drive';

/**
 * 🎯 PROCESADOR DE TARJETAS
 * Maneja el procesamiento después del pago exitoso
 */
export async function processCard({
  paymentIntentId,
  sender,
  recipient,
  cardData,
  amount,
  giftAmount = 0,
}) {
  try {
    console.log('💳 Processing card after payment:', paymentIntentId);

    // Generar ID único de tarjeta
    const cardId = `EW${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Crear link de la tarjeta
    const cardLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://everwish.cards'}/view/${cardId}`;

    // Guardar tarjeta en Drive
    const cardInfo = {
      id: cardId,
      slug: cardData.slug || 'custom-card',
      message: cardData.message || '',
      animation: cardData.type || '',
      link: cardLink,
      sender: {
        name: sender.name,
        email: sender.email,
        phone: sender.phone || '',
      },
      recipient: {
        name: recipient.name,
        email: recipient.email || '',
        phone: recipient.phone || '',
      },
      payment: {
        intentId: paymentIntentId,
        amount: amount,
        status: 'succeeded',
      },
      giftCard: giftAmount > 0 ? { amount: giftAmount } : null,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    const cardResult = await everwishDrive.saveCard(cardInfo);

    if (!cardResult) {
      throw new Error('Failed to save card to Drive');
    }

    console.log('✅ Card saved:', cardId);

    // Actualizar usuario
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
    console.log('✅ User updated');

    // Enviar email
    try {
      const { sendCardEmail } = await import('./email-sender');
      
      const emailResult = await sendCardEmail({
        to: recipient.email || recipient.phone, // Fallback a phone si no hay email
        from: '[email protected]',
        cardLink,
        message: cardData.message,
        senderName: sender.name,
        recipientName: recipient.name,
      });

      if (emailResult.success) {
        console.log('✅ Email sent');
      } else {
        console.warn('⚠️ Email failed:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError);
    }

    return {
      success: true,
      cardId,
      everwishId,
      cardLink,
    };

  } catch (error) {
    console.error('❌ Error processing card:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
