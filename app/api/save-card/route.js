import { everwishDrive } from '@/lib/everwish-drive';
import { tremendous } from '@/lib/tremendous';

export async function POST(req) {
  try {
    const { 
      paymentIntentId, 
      sender, 
      recipient, 
      cardData,
      amount,
      gift
    } = await req.json();

    console.log('💾 Saving card after payment:', paymentIntentId);

    const cardId = `EW${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // ========================================
    // GIFT CARD - AHORA CON MANEJO DE ERRORES
    // ========================================
    let giftCardResult = null;
    
    if (gift && gift.amount > 0) {
      console.log('🎁 Creating gift card:', gift);
      
      try {
        giftCardResult = await tremendous.createOrder({
          amount: gift.amount,
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          senderEmail: sender.email,
          senderName: sender.name,
          message: cardData.message || 'You received a gift card!',
        });

        if (!giftCardResult.success) {
          console.warn('⚠️ Gift card creation failed:', giftCardResult.error);
          // NO lanzar error - continuar sin gift card
          giftCardResult = {
            success: false,
            error: giftCardResult.error,
            orderId: null,
          };
        } else {
          console.log('✅ Gift card created successfully:', giftCardResult.orderId);
        }
      } catch (giftError) {
        // ✅ CAPTURAR error de Tremendous
        console.error('❌ Tremendous API Error:', giftError);
        giftCardResult = {
          success: false,
          error: giftError.message || 'Failed to create gift card',
          orderId: null,
        };
        // ✅ NO detener el proceso - continuar guardando la tarjeta
      }
    }

    // ========================================
    // GUARDAR TARJETA EN DRIVE
    // ========================================
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
      giftCard: giftCardResult ? {
        orderId: giftCardResult.orderId,
        amount: gift.amount,
        status: giftCardResult.success ? 'sent' : 'failed',
        link: giftCardResult.rewardLink || null,
        error: giftCardResult.error || null,
      } : null,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    const cardResult = await everwishDrive.saveCard(cardInfo);

    if (!cardResult) {
      throw new Error('Failed to save card to Drive');
    }

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

    console.log('✅ Card saved successfully:', cardId);

    // ========================================
    // RESPUESTA CON WARNING SI GIFT FALLÓ
    // ========================================
    const response = { 
      success: true, 
      cardId,
      everwishId,
      giftCard: giftCardResult,
    };

    // Agregar advertencia si gift card falló
    if (gift && gift.amount > 0 && (!giftCardResult || !giftCardResult.success)) {
      response.warning = 'Card saved but gift card creation failed. Contact support.';
    }

    return Response.json(response);

  } catch (error) {
    console.error('❌ Error saving card:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
