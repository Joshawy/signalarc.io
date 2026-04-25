// Cloudflare Pages Function for creating Stripe checkout sessions
// Path: /functions/api/create-assessment-checkout.js
// Endpoint: https://signalarc.io/api/create-assessment-checkout

import Stripe from 'stripe';

// Pricing variants for the AI Assessment
const VARIANTS = {
  founding: {
    amount_cents: 25000,
    display_price: '$250',
    label: 'SignalARC AI Tools Assessment — Founding Cohort',
    metadata_type: 'ai_assessment_founding'
  },
  regular: {
    amount_cents: 99900,
    display_price: '$999',
    label: 'SignalARC AI Tools Assessment',
    metadata_type: 'ai_assessment'
  }
};

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { name, email, company, business_type, team_size, biggest_pain, variant } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Name and email are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tier = VARIANTS[variant] || VARIANTS.regular;
    const siteUrl = 'https://signalarc.io';

    const clip = (s, n) => (s || '').toString().slice(0, n);

    const metadata = {
      type: tier.metadata_type,
      variant: variant || 'regular',
      product: tier.label,
      display_price: tier.display_price,
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
            name: tier.label,
            description: 'Client-paced workflow audit call (8–12 min, longer if you want) + 10–15 page custom AI Action Plan + prompt library + 30-day Loom support. Delivered within 48 hours of the call. 100% money-back guarantee if we don\'t identify 5+ hrs/week of savings.'
          },
          unit_amount: tier.amount_cents
        },
        quantity: 1
      }],
      customer_email: email,
      metadata,
      payment_intent_data: {
        description: `${tier.label} — ${name} (${company || email})`,
        metadata,
        receipt_email: email
      },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/thank-you.html?type=assessment&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#book`
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('create-assessment-checkout error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Could not start checkout. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
