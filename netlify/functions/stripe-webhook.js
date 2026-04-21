const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function sendAssessmentConfirmation(email, name, orderId) {
  const firstName = (name || 'there').split(' ')[0];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Josh at Signal Arc <josh@signalarc.io>',
      to: email,
      subject: "You're booked — here's everything you need",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
          <p>Hey ${firstName},</p>
          <p>You're all set. Your AI Assessment is confirmed and we're ready to go.</p>
          <p><strong>Here's how it works:</strong></p>
          <p><strong>1.</strong> Call Andrew at <strong>+1(978)510-6633</strong> — he'll walk you through a 20–25 minute discovery call. No pitch, just questions.</p>
          <p><strong>2.</strong> Within 48 hours of your call, Josh will have your custom report in your inbox. It'll show you exactly where AI can give you time back — with tools, costs, and a 4-day action plan.</p>
          <p><strong>3.</strong> Once you've had some time to review the report and Josh's walkthrough, book a quick call to discuss next steps and any questions you have.</p>
          <p style="color: #888; font-size: 13px;">Your assessment number: ${orderId}</p>
          <p>If you have any issues, reply to this email and Josh will sort it out.</p>
          <p>Talk soon,<br><strong>Josh</strong><br>Signal Arc<br><a href="https://signalarc.io">signalarc.io</a></p>
        </div>
      `
    })
  });
  const resBody = await res.json();
  console.log('Resend response:', JSON.stringify(resBody));
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const sig = event.headers['stripe-signature'];
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature error:', err.message);
    return { statusCode: 400, body: 'Webhook Error: ' + err.message };
  }

  console.log('Event type:', stripeEvent.type);

  // Handle checkout.session.completed (fires for $0 coupon orders too)
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const email = session.customer_email || session.metadata?.email;
    const name = session.metadata?.name;
    const type = session.metadata?.type || 'standard';

    console.log('Checkout session email:', email, 'type:', type);

    if (!email) return { statusCode: 200, body: 'No email in session' };

    await supabase.from('clients').upsert({ email }, { onConflict: 'email' });

    if (type === 'ai_assessment' || type === 'ai_assessment_founding') {
      await sendAssessmentConfirmation(email, name, session.id);
    }
  }

  // Handle payment_intent.succeeded (fires for real payments > $0)
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    const email = pi.metadata?.email;
    const amount = pi.amount / 100;
    const type = pi.metadata?.type || 'standard';
    const description = pi.description || 'Lead order';

    console.log('PaymentIntent email:', email, 'type:', type, 'amount:', amount);

    if (!email) return { statusCode: 200, body: 'No email in metadata' };

    await supabase.from('clients').upsert({ email }, { onConflict: 'email' });

    const { data: existing } = await supabase
      .from('credit_accounts')
      .select('*')
      .eq('email', email)
      .single();

    if (type === 'ai_assessment' || type === 'ai_assessment_founding') {
      await sendAssessmentConfirmation(email, pi.metadata?.name, pi.id);
    } else if (type === 'prepay_credits') {
      if (existing) {
        await supabase.from('credit_accounts').update({
          credit_balance: parseFloat(existing.credit_balance) + amount,
          total_purchased: parseFloat(existing.total_purchased) + amount,
          updated_at: new Date().toISOString()
        }).eq('email', email);
      } else {
        await supabase.from('credit_accounts').insert({
          email, credit_balance: amount, total_purchased: amount, total_used: 0
        });
      }
    } else {
      if (!existing) {
        await supabase.from('credit_accounts').insert({
          email, credit_balance: 0, total_purchased: amount, total_used: amount
        });
      } else {
        await supabase.from('credit_accounts').update({
          total_purchased: parseFloat(existing.total_purchased) + amount,
          updated_at: new Date().toISOString()
        }).eq('email', email);
      }
    }

    await supabase.from('transactions').insert({
      email, type: 'purchase', amount, description, stripe_payment_id: pi.id
    });
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
