// ❌ Este endpoint ha sido ELIMINADO
// Las gift cards ya no están disponibles

export async function GET() {
  return Response.json({ 
    success: false,
    error: 'Gift card service is not available',
    balance: 0
  }, { status: 410 }); // 410 = Gone
}
