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

    let giftCardResult = null;
    if (gift && gift.amount > 0) {
      console.log('🎁 Creating gift card:', gift);
      
      giftCardResult = await tremendous.createOrder({
        amount: gift.amount,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        senderEmail: sender.email,
        senderName: sender.name,
        message: cardData.message || 'You received a gift card!',
      });

      if (!giftCardResult.success) {
        console.error('⚠️ Failed to create gift card:', giftCardResult.error);
      }
    }

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
        link: giftCardResult.rewardLink,
      } : null,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    const cardResult = await everwishDrive.saveCard(cardInfo);

    if (!cardResult) {
      throw new Error('Failed to save card to Drive');
    }

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

    return Response.json({ 
      success: true, 
      cardId,
      everwishId,
      giftCard: giftCardResult,
    });

  } catch (error) {
    console.error('❌ Error saving card:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
