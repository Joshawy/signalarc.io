const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { amount, currency = 'usd', description, metadata } = JSON.parse(event.body);

    if (!amount || amount < 625) {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({ error: 'Minimum order is $625 (25 leads).' })
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      description,
      metadata,
      automatic_payment_methods: { enabled: true }
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
    };
  } catch (err) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
