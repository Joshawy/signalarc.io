/**
 * Cloudflare Worker for SignalARC
 * Handles assessment checkout and quiz email sending via Resend
 */

import { Router } from 'itty-router';

const router = Router();

// POST /api/send-quiz-email
router.post('/api/send-quiz-email', async (request, env) => {
  try {
    const body = await request.json();
    const { name, email, company, business_type, team_size, biggest_pain } = body;

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format the quiz results for the email
    const quizSummary = `
      <strong>Your Business:</strong> ${business_type || 'Not specified'}<br>
      <strong>Team Size:</strong> ${team_size || 'Not specified'}<br>
      <strong>Biggest Time Leak:</strong> ${biggest_pain || 'Not specified'}
    `;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
        <p>Hi ${(name || 'there').split(' ')[0]},</p>
        <p>Thanks for taking the SignalARC AI Assessment quiz. Here's what you told us:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${quizSummary}
        </div>
        
        <p><strong>Ready to see your custom AI action plan?</strong></p>
        <p>You've been approved for the $999 AI Assessment. This includes:</p>
        <ul>
          <li>8–12 minute workflow audit call</li>
          <li>Custom AI action plan (delivered in 48 hours)</li>
          <li>Personalized prompt library</li>
          <li>30 days of implementation support</li>
          <li>100% money-back guarantee</li>
        </ul>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://signalarc.io#book" style="background: #00d4a8; color: #071012; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
            Continue to Payment →
          </a>
        </p>
        
        <p style="color: #888; font-size: 13px;">
          Questions? Reply to this email or contact josh@signalarc.io
        </p>
        
        <p>Talk soon,<br><strong>Josh</strong><br>SignalARC<br><a href="https://signalarc.io">signalarc.io</a></p>
      </div>
    `;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Josh at SignalARC <josh@signalarc.io>',
        to: email,
        subject: 'Your AI Assessment Quiz Results → Ready to Book',
        html: emailHtml
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Could not send email. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Quiz email sent successfully',
        email_id: resendData.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404 }));

export default router;
