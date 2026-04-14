const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const sig = event.headers['stripe-signature'];
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: 'Webhook Error: ' + err.message };
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    const email = pi.metadata?.email;
    const amount = pi.amount / 100;
    const type = pi.metadata?.type || 'standard';

    if (!email) return { statusCode: 200, body: 'No email' };

    const { data: existing } = await supabase.from('credit_accounts').select('*').eq('email', email).single();

    if (type === 'prepay_credits') {
      if (existing) {
        await supabase.from('credit_accounts').update({
          credit_balance: parseFloat(existing.credit_balance) + amount,
          total_purchased: parseFloat(existing.total_purchased) + amount,
          updated_at: new Date().toISOString()
        }).eq('email', email);
      } else {
        await supabase.from('credit_accounts').insert({ email, credit_balance: amount, total_purchased: amount, total_used: 0 });
      }
    }

    await supabase.from('transactions').insert({ email, type: 'purchase', amount, description: pi.description || 'Lead order', stripe_payment_id: pi.id });
    await supabase.from('clients').upsert({ email }, { onConflict: 'email' });
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};