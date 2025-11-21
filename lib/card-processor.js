// Este endpoint ya no se usa - el webhook de Stripe maneja todo
export async function POST(req) {
  console.log('⚠️ /api/save-card está deprecado - usar webhook de Stripe');
  
  return Response.json({ 
    success: false,
    error: 'This endpoint is deprecated. Use Stripe webhooks instead.',
    message: 'Card processing is now handled automatically via Stripe webhooks'
  }, { status: 410 }); // 410 = Gone
}
