export class TremendousClient {
  constructor() {
    this.apiKey = process.env.TREMENDOUS_API_KEY;
    this.apiUrl = process.env.TREMENDOUS_API_URL || 'https://testflight.tremendous.com/api/v2';
    
    if (!this.apiKey) {
      console.warn('⚠️ Tremendous API key not configured');
    }
  }

  async createOrder(data) {
    if (!this.apiKey) {
      throw new Error('Tremendous API key not configured');
    }

    const { 
      amount, 
      recipientEmail, 
      recipientName,
      senderEmail,
      senderName,
      message 
    } = data;

    try {
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: {
            funding_source_id: 'BALANCE',
          },
          rewards: [
            {
              value: {
                denomination: amount,
                currency_code: 'USD',
              },
              recipient: {
                email: recipientEmail,
                name: recipientName,
              },
              delivery: {
                method: 'EMAIL',
              },
              products: [],
            },
          ],
          external_id: `everwish-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create gift card');
      }

      const result = await response.json();
      return {
        success: true,
        orderId: result.order.id,
        rewardLink: result.order.rewards[0]?.delivery?.link,
      };
    } catch (error) {
      console.error('Tremendous API Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getBalance() {
    if (!this.apiKey) {
      throw new Error('Tremendous API key not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/funding_sources`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get balance');
      }

      const result = await response.json();
      const balance = result.funding_sources.find(fs => fs.method === 'balance');
      
      return {
        success: true,
        balance: balance?.meta?.available_cents / 100 || 0,
      };
    } catch (error) {
      console.error('Tremendous Balance Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const tremendous = new TremendousClient();
