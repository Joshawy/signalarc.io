// Cloudflare Pages Function — send AI Assessment confirmation email
// Path: /functions/api/send-assessment-confirmation.js
// Endpoint: https://signalarc.io/api/send-assessment-confirmation
//
// Called by /thank-you.html on page load with ?session_id=cs_xxx
// 1. Verifies the Stripe session is paid
// 2. Sends confirmation email to buyer via Resend
// 3. Sends internal notification to joshua@signalarc.io
// 4. Idempotent: Stripe session metadata flag prevents double-sends

const FROM_ADDRESS = 'Josh at Signal Arc <joshua@signalarc.io>';
const REPLY_TO = 'joshua@signalarc.io';
const INTERNAL_NOTIFY = 'joshua@signalarc.io';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id || !session_id.startsWith('cs_')) {
      return json({ error: 'Invalid session_id' }, 400);
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return json({ error: 'Payment not confirmed yet', status: session.payment_status }, 402);
    }

    // Idempotency: only send once per session
    if (session.metadata?.confirmation_sent === 'true') {
      return json({ ok: true, already_sent: true });
    }

    const email = session.customer_email || session.metadata?.email;
    const name = session.metadata?.name || '';
    const company = session.metadata?.company || '';
    const businessType = session.metadata?.business_type || '';
    const teamSize = session.metadata?.team_size || '';
    const biggestPain = session.metadata?.biggest_pain || '';

    if (!email) return json({ error: 'No email on session' }, 400);

    // 1. Send buyer confirmation
    const buyerRes = await sendBuyerEmail(env.RESEND_API_KEY, email, name, session.id);

    // 2. Send internal notification (non-blocking — don't fail the request if this fails)
    sendInternalEmail(env.RESEND_API_KEY, {
      name, email, company, businessType, teamSize, biggestPain,
      sessionId: session.id,
      amount: (session.amount_total || 0) / 100
    }).catch(e => console.error('Internal notify failed:', e));

    // 3. Mark session so we don't re-send
    await stripe.checkout.sessions.update(session.id, {
      metadata: { ...session.metadata, confirmation_sent: 'true' }
    });

    return json({ ok: true, resend_id: buyerRes?.id });
  } catch (err) {
    console.error('send-assessment-confirmation error:', err);
    return json({ error: err.message || 'Could not send confirmation' }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function sendBuyerEmail(apiKey, toEmail, fullName, assessmentNumber) {
  const firstName = (fullName || 'there').split(' ')[0];

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
      <p>Hey ${escapeHtml(firstName)},</p>
      <p>You're all set. Your AI Assessment is confirmed and we're ready to go.</p>
      <p><strong>Here's how it works:</strong></p>
      <p><strong>1.</strong> Call Andrew at <strong>+1 (978) 510-6633</strong> — he'll walk you through a 20–25 minute discovery call. No pitch, just questions.</p>
      <p><strong>2.</strong> Within 48 hours of your call, Josh will have your custom report in your inbox. It'll show you exactly where AI can give you time back — with tools, costs and a 4-day action plan.</p>
      <p><strong>3.</strong> Once you've had some time to review the report and Josh's walkthrough, book a quick call to discuss next steps and any questions you have.</p>
      <p style="color: #888; font-size: 13px;">Your assessment number: ${escapeHtml(assessmentNumber)}</p>
      <p>If you have any issues, reply to this email and Josh will sort it out.</p>
      <p>Talk soon,<br><strong>Josh</strong><br>Signal Arc<br><a href="https://signalarc.io">signalarc.io</a></p>
    </div>
  `.trim();

  const text = `Hey ${firstName},

You're all set. Your AI Assessment is confirmed and we're ready to go.

Here's how it works:

1. Call Andrew at +1 (978) 510-6633 — he'll walk you through a 20–25 minute discovery call. No pitch, just questions.

2. Within 48 hours of your call, Josh will have your custom report in your inbox. It'll show you exactly where AI can give you time back — with tools, costs and a 4-day action plan.

3. Once you've had some time to review the report and Josh's walkthrough, book a quick call to discuss next steps and any questions you have.

Your assessment number: ${assessmentNumber}

If you have any issues, reply to this email and Josh will sort it out.

Talk soon,
Josh
Signal Arc
https://signalarc.io
`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: toEmail,
      reply_to: REPLY_TO,
      subject: "You're booked — here's everything you need",
      html,
      text
    })
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Resend buyer email error:', data);
    throw new Error(data.message || 'Resend failed');
  }
  return data;
}

async function sendInternalEmail(apiKey, info) {
  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; color: #1a1a1a; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">🎉 New AI Assessment booked</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Name:</strong></td><td>${escapeHtml(info.name)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Email:</strong></td><td>${escapeHtml(info.email)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Company:</strong></td><td>${escapeHtml(info.company)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Business:</strong></td><td>${escapeHtml(info.businessType)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Team size:</strong></td><td>${escapeHtml(info.teamSize)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Biggest pain:</strong></td><td>${escapeHtml(info.biggestPain)}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Amount paid:</strong></td><td>$${info.amount}</td></tr>
        <tr><td style="padding: 6px 12px 6px 0;"><strong>Session:</strong></td><td><code>${escapeHtml(info.sessionId)}</code></td></tr>
      </table>
      <p style="margin-top: 24px; color: #666;">Watch for them to call Andrew at +1 (978) 510-6633.</p>
    </div>
  `.trim();

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: INTERNAL_NOTIFY,
      reply_to: info.email || REPLY_TO,
      subject: `🎉 New Assessment booked: ${info.name || info.email}`,
      html
    })
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
