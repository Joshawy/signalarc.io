const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, company, business_type, team_size, biggest_pain } = body;

    if (!email || !name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and email are required.' }) };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Please enter a valid email address.' }) };
    }

    const siteUrl = process.env.URL || 'https://signalarc.io';

    // Stripe metadata values max 500 chars; truncate long fields
    const clip = (s, n) => (s || '').toString().slice(0, n);

    const metadata = {
      type: 'ai_assessment',
      product: 'SignalARC AI Tools Assessment',
      name: clip(name, 100),
      email: clip(email, 100),
      company: clip(company, 100),
      business_type: clip(business_type, 150),
      team_size: clip(team_size, 50),
      biggest_pain: clip(biggest_pain, 450)
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'SignalARC AI Tools Assessment',
            description: '45-min workflow audit + 10–15 page custom AI Action Plan + prompt library + 30-day Loom support. Delivered within 48 hours of the call. 100% money-back guarantee if we don\'t identify 5+ hrs/week of savings.'
          },
          unit_amount: 99900 // $999.00 in cents
        },
        quantity: 1
      }],
      customer_email: email,
      metadata,
      payment_intent_data: {
        description: `SignalARC AI Assessment — ${name} (${company || email})`,
        metadata, // mirrors onto the PaymentIntent so the existing webhook sees it
        receipt_email: email
      },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/thank-you.html?type=assessment&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#book`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('create-assessment-checkout error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Could not start checkout. Please try again.' })
    };
  }
};
