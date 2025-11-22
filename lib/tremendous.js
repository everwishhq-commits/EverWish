// ❌ TREMENDOUS HA SIDO ELIMINADO
// Esta funcionalidad ya no está disponible

export class TremendousClient {
  constructor() {
    console.warn('⚠️ Tremendous has been removed from this application');
  }

  async createOrder(data) {
    console.warn('⚠️ Gift cards are not available');
    return {
      success: false,
      error: 'Gift card service is not available',
      orderId: null,
    };
  }

  async getBalance() {
    return {
      success: false,
      error: 'Service not available',
      balance: 0,
    };
  }
}

export const tremendous = new TremendousClient();
