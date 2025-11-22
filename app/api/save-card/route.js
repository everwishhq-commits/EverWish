// app/api/save-card/route.js
import { r2Storage } from '@/lib/r2-storage';

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
    // GUARDAR TARJETA EN R2
    // ========================================
    const cardInfo = {
      id: cardId,
      slug: cardData.slug || 'custom-card',
      message: cardData.message || '',
      animation: cardData.animation || '',
      link: cardLink,
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

    const cardResult = await r2Storage.saveCard(cardInfo);
    if (!cardResult.success) {
      throw new Error('Failed to save card to R2');
    }

    console.log('✅ Card saved successfully:', cardId);

    // ========================================
    // GUARDAR/ACTUALIZAR USUARIO
    // ========================================
    let user = await r2Storage.getUserByEmail(sender.email);
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

    await r2Storage.saveUser(user);
    console.log('✅ User updated successfully');

    // ========================================
    // ENVIAR EMAIL CON EL LINK
    // ========================================
    try {
      const { sendCardEmail } = await import('@/lib/email-sender');
      
      const emailResult = await sendCardEmail({
        to: recipient.email,
        from: '[email protected]',
        cardLink,
        message: cardData.message,
        senderName: sender.name,
        recipientName: recipient.name,
      });

      if (emailResult.success) {
        console.log('✅ Email sent successfully');
      } else {
        console.warn('⚠️ Email failed to send:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
    }

    return Response.json({
      success: true,
      cardId,
      everwishId,
      cardLink,
    });
  } catch (error) {
    console.error('❌ Error saving card:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
