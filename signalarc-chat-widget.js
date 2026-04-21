(function() {
  'use strict';
  if (window.__signalArcChatLoaded) return;
  window.__signalArcChatLoaded = true;

  const STYLES = `
    #sa-chat-bubble, #sa-chat-panel, #sa-chat-panel * {
      box-sizing: border-box;
      font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #sa-chat-bubble {
      position: fixed; bottom: 24px; right: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: #00d4a8; color: #071012;
      border: none; cursor: pointer; z-index: 99998;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(0,212,168,0.35);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #sa-chat-bubble:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,212,168,0.5); }
    #sa-chat-bubble svg { width: 28px; height: 28px; }
    #sa-chat-bubble.sa-hidden { display: none; }
    #sa-chat-badge {
      position: absolute; top: -4px; right: -4px;
      background: #fff; color: #071012;
      font-size: 11px; font-weight: 700;
      min-width: 20px; height: 20px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 6px; border: 2px solid #00d4a8;
      animation: sa-bounce 0.5s ease;
    }
    @keyframes sa-bounce { 0%{transform:scale(0)} 60%{transform:scale(1.15)} 100%{transform:scale(1)} }
    #sa-chat-panel {
      position: fixed; bottom: 24px; right: 24px;
      width: 380px; height: 580px; max-height: calc(100vh - 48px);
      background: #0d1c20; border: 1px solid rgba(0,212,168,0.25);
      border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      z-index: 99999; display: flex; flex-direction: column; overflow: hidden;
      color: #f0f8f6; opacity: 0; transform: translateY(20px);
      transition: opacity 0.25s, transform 0.25s; pointer-events: none;
    }
    #sa-chat-panel.sa-open { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .sa-chat-header {
      background: linear-gradient(135deg, #0d1c20 0%, #112228 100%);
      padding: 16px 20px; border-bottom: 1px solid rgba(0,212,168,0.15);
      display: flex; align-items: center; justify-content: space-between;
    }
    .sa-header-left { display: flex; align-items: center; gap: 12px; }
    .sa-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #00d4a8; color: #071012;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 15px;
    }
    .sa-header-title { font-weight: 700; font-size: 15px; color: #f0f8f6; line-height: 1.2; }
    .sa-header-sub { font-size: 12px; color: #7a9e98; line-height: 1.2; margin-top: 2px; }
    .sa-status-dot { width: 8px; height: 8px; background: #00d4a8; border-radius: 50%; display: inline-block; margin-right: 5px; }
    .sa-close-btn {
      background: none; border: none; color: #7a9e98;
      font-size: 22px; cursor: pointer; padding: 4px 8px; line-height: 1;
      transition: color 0.2s;
    }
    .sa-close-btn:hover { color: #f0f8f6; }
    .sa-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
    }
    .sa-messages::-webkit-scrollbar { width: 6px; }
    .sa-messages::-webkit-scrollbar-thumb { background: rgba(0,212,168,0.2); border-radius: 3px; }
    .sa-msg {
      max-width: 88%; padding: 10px 14px; border-radius: 14px;
      font-size: 14px; line-height: 1.5; animation: sa-fade-up 0.3s ease;
      word-wrap: break-word;
    }
    @keyframes sa-fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .sa-msg-bot { background: #112228; color: #f0f8f6; align-self: flex-start; border-bottom-left-radius: 4px; }
    .sa-msg-user { background: #00d4a8; color: #071012; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 600; }
    .sa-msg a { color: #00d4a8; text-decoration: underline; font-weight: 600; }
    .sa-msg-user a { color: #071012; }
    .sa-msg strong { font-weight: 700; }
    .sa-typing { display: inline-flex; gap: 4px; padding: 4px 0; }
    .sa-typing span { width: 6px; height: 6px; border-radius: 50%; background: #7a9e98; animation: sa-pulse 1.2s infinite; }
    .sa-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sa-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sa-pulse { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
    .sa-quick-replies {
      padding: 10px 14px 14px; border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-wrap: wrap; gap: 7px; background: #0d1c20;
    }
    .sa-qr-btn {
      background: rgba(0,212,168,0.1); border: 1px solid rgba(0,212,168,0.3);
      color: #00d4a8; font-family: inherit; font-size: 13px; font-weight: 600;
      padding: 7px 13px; border-radius: 100px; cursor: pointer; transition: all 0.15s;
    }
    .sa-qr-btn:hover { background: rgba(0,212,168,0.22); transform: translateY(-1px); }
    .sa-qr-btn.sa-primary { background: #00d4a8; color: #071012; border-color: #00d4a8; }
    .sa-qr-btn.sa-primary:hover { background: #00e0b4; }
    .sa-input-bar {
      padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.06);
      display: none; gap: 8px; background: #0d1c20;
    }
    .sa-input-bar.sa-show { display: flex; }
    .sa-input-bar input {
      flex: 1; background: #112228; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; color: #f0f8f6; font-family: inherit; font-size: 14px;
      padding: 10px 12px; outline: none;
    }
    .sa-input-bar input:focus { border-color: #00d4a8; }
    .sa-input-bar input::placeholder { color: rgba(255,255,255,0.3); }
    .sa-input-bar button {
      background: #00d4a8; color: #071012; border: none; border-radius: 8px;
      padding: 0 16px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 14px;
    }
    .sa-footer-note {
      text-align: center; font-size: 11px; color: #7a9e98;
      padding: 7px 0 9px; border-top: 1px solid rgba(255,255,255,0.04); background: #0d1c20;
    }
    .sa-footer-note a { color: #00d4a8; text-decoration: none; }
    @media (max-width: 480px) {
      #sa-chat-panel { width: calc(100vw - 16px); height: calc(100vh - 16px); right: 8px; bottom: 8px; border-radius: 12px; }
      #sa-chat-bubble { bottom: 16px; right: 16px; }
    }
  `;

  const FLOWS = {
    start: {
      messages: [
        "👋 Hey! I'm the SignalARC bot.",
        "I can walk you through the **$999 AI Assessment**, pricing, or connect you with our team. What are you here for?"
      ],
      replies: [
        { text: "💰 Pricing", next: "pricing" },
        { text: "⚙️ How it works", next: "how_it_works" },
        { text: "📋 What's included", next: "included" },
        { text: "🎯 Is this right for me?", next: "right_for_me" },
        { text: "🧠 Try the free 2-min quiz", action: "open_quiz" },
        { text: "📅 Book the Assessment", next: "book", primary: true },
        { text: "👋 Talk to a human", next: "human_name" }
      ]
    },
    pricing: {
      messages: [
        "**Straight-up pricing:**\n\n• **$999** — AI Tools Assessment (one-time, no subscription)\n• **48-hour turnaround** on your custom action plan\n• **100% money-back** if we don't find 5+ hrs/week of time to return\n• Optional done-for-you implementation: **$1,500–$5,000**, quoted after the audit"
      ],
      replies: [
        { text: "📅 Book now", action: "open_book", primary: true },
        { text: "📋 What's included", next: "included" },
        { text: "💬 Talk to someone", next: "human_name" },
        { text: "← Back", next: "start" }
      ]
    },
    how_it_works: {
      messages: [
        "**The SignalARC Method: Audit → Optimize → Automate (AOA)**",
        "**1. Audit** (45-min call) — we map every repeatable workflow in your business and find the 5–10 hour/week time leaks.\n\n**2. Optimize** — we simplify broken processes first. Automating a messy 12-step workflow just creates a faster mess.\n\n**3. Automate** — you get the exact AI stack, prompts, and automations tailored to your business. Each one installable in under 60 minutes.",
        "The full action plan is delivered as a written PDF within **48 hours** of the call."
      ],
      replies: [
        { text: "📅 Book the Assessment", action: "open_book", primary: true },
        { text: "📋 What's included", next: "included" },
        { text: "💰 See pricing", next: "pricing" },
        { text: "← Back", next: "start" }
      ]
    },
    included: {
      messages: [
        "**In the $999 Assessment, you get:**\n\n✓ 45-minute live workflow audit call\n✓ Custom AI Action Plan (10–15 page PDF)\n✓ Personalized prompt library for your top 5 workflows\n✓ Exact tool stack recommendations — no affiliate hype\n✓ 30 days of Loom support for implementation questions\n✓ Optional done-for-you build (priced separately)"
      ],
      replies: [
        { text: "📅 Book now", action: "open_book", primary: true },
        { text: "💰 See pricing", next: "pricing" },
        { text: "🎯 Is it right for me?", next: "right_for_me" },
        { text: "← Back", next: "start" }
      ]
    },
    right_for_me: {
      messages: [
        "**You'll get the most out of this if you...**\n\n✓ Run a solo or small business and wear every hat\n✓ Have tried ChatGPT but don't have a real system\n✓ Want practical wins this week, not another 10-hour course\n✓ Are willing to spend 30–60 min implementing quick wins\n✓ Don't already have a full-time AI team",
        "If that sounds like you, the Assessment is a no-brainer — especially with the money-back guarantee."
      ],
      replies: [
        { text: "📅 Sounds like me — book", action: "open_book", primary: true },
        { text: "💬 Not sure — talk to someone", next: "human_name" },
        { text: "← Back", next: "start" }
      ]
    },
    book: {
      messages: [
        "Nice. Two ways to go from here:",
        "👉 [**Request your Assessment**](/#book) — quick form, we reply with a booking link within one business day.\n\nOr chat with a human first if you have questions."
      ],
      replies: [
        { text: "📅 Go to booking form", action: "open_book", primary: true },
        { text: "💬 Quick question first", next: "human_name" },
        { text: "← Back", next: "start" }
      ]
    },
    human_name: {
      messages: [
        "Happy to connect you. Just need a few quick details.",
        "**What's your name?**"
      ],
      input: { field: "name", placeholder: "Your name", next: "human_email" }
    },
    human_email: {
      messages: [ "Thanks {name}! **What's your work email?**" ],
      input: { field: "email", placeholder: "you@company.com", validate: "email", next: "human_msg" }
    },
    human_msg: {
      messages: [ "Got it. Last one — **what can we help you with?** (your business, biggest time leak, or any questions)" ],
      input: { field: "message", placeholder: "Tell us about your business and goals...", next: "human_submit" }
    },
    human_submit: { action: "submit_lead" },
    thanks: {
      messages: [
        "🎉 Got it — we'll be in touch within **one business day** at {email}.",
        "In the meantime, want to go straight to booking or read more?"
      ],
      replies: [
        { text: "📅 Book the Assessment", action: "open_book", primary: true },
        { text: "📋 What's included", next: "included" },
        { text: "← Main menu", next: "start" }
      ]
    },
    error: {
      messages: [
        "Hmm, something went wrong sending your message. Please email **joshua@signalarc.io** directly or use the contact form at the bottom of the page."
      ],
      replies: [ { text: "← Main menu", next: "start" } ]
    }
  };

  const state = { open: false, currentStep: 'start', userData: {}, hasInteracted: false };
  let els = {};

  function init() {
    injectStyles(); buildUI(); bindEvents();
    setTimeout(() => { if (!state.hasInteracted) showBadge(); }, 8000);
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  function buildUI() {
    const bubble = document.createElement('button');
    bubble.id = 'sa-chat-bubble';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
    document.body.appendChild(bubble);

    const panel = document.createElement('div');
    panel.id = 'sa-chat-panel';
    panel.innerHTML = `
      <div class="sa-chat-header">
        <div class="sa-header-left">
          <div class="sa-avatar">SA</div>
          <div>
            <div class="sa-header-title">SignalARC</div>
            <div class="sa-header-sub"><span class="sa-status-dot"></span>Online · Replies in minutes</div>
          </div>
        </div>
        <button class="sa-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="sa-messages" id="sa-messages"></div>
      <div class="sa-quick-replies" id="sa-quick-replies"></div>
      <div class="sa-input-bar" id="sa-input-bar">
        <input type="text" id="sa-input" autocomplete="off">
        <button id="sa-send">Send</button>
      </div>
      <div class="sa-footer-note">Powered by <a href="https://signalarc.io" target="_blank">SignalARC</a></div>
    `;
    document.body.appendChild(panel);

    els = {
      bubble, panel,
      messages: panel.querySelector('#sa-messages'),
      replies: panel.querySelector('#sa-quick-replies'),
      inputBar: panel.querySelector('#sa-input-bar'),
      input: panel.querySelector('#sa-input'),
      send: panel.querySelector('#sa-send'),
      close: panel.querySelector('.sa-close-btn')
    };
  }

  function bindEvents() {
    els.bubble.addEventListener('click', openPanel);
    els.close.addEventListener('click', closePanel);
    els.send.addEventListener('click', handleInputSubmit);
    els.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleInputSubmit(); });
  }

  function openPanel() {
    state.open = true; state.hasInteracted = true; hideBadge();
    els.bubble.classList.add('sa-hidden');
    els.panel.classList.add('sa-open');
    if (els.messages.children.length === 0) goToStep('start');
  }

  function closePanel() {
    state.open = false;
    els.panel.classList.remove('sa-open');
    els.bubble.classList.remove('sa-hidden');
  }

  function showBadge() {
    if (document.getElementById('sa-chat-badge')) return;
    const b = document.createElement('span');
    b.id = 'sa-chat-badge'; b.textContent = '1';
    els.bubble.appendChild(b);
  }
  function hideBadge() { const b = document.getElementById('sa-chat-badge'); if (b) b.remove(); }

  function interpolate(str, data) { return str.replace(/\{(\w+)\}/g, (_, k) => data[k] || ''); }

  function renderMessage(text, sender) {
    const html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
    const m = document.createElement('div');
    m.className = 'sa-msg sa-msg-' + sender;
    m.innerHTML = html;
    els.messages.appendChild(m);
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function showTyping() {
    const m = document.createElement('div');
    m.className = 'sa-msg sa-msg-bot'; m.id = 'sa-typing-msg';
    m.innerHTML = '<span class="sa-typing"><span></span><span></span><span></span></span>';
    els.messages.appendChild(m);
    els.messages.scrollTop = els.messages.scrollHeight;
  }
  function hideTyping() { const t = document.getElementById('sa-typing-msg'); if (t) t.remove(); }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function clearReplies() { els.replies.innerHTML = ''; els.replies.style.display = 'none'; }
  function showReplies(replies) {
    els.replies.innerHTML = ''; els.replies.style.display = 'flex';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'sa-qr-btn' + (r.primary ? ' sa-primary' : '');
      btn.textContent = r.text;
      btn.addEventListener('click', () => handleReply(r));
      els.replies.appendChild(btn);
    });
  }
  function hideInput() { els.inputBar.classList.remove('sa-show'); }
  function showInput(placeholder) {
    els.inputBar.classList.add('sa-show');
    els.input.placeholder = placeholder || 'Type here...';
    els.input.value = '';
    setTimeout(() => els.input.focus(), 100);
  }

  async function handleReply(r) {
    renderMessage(r.text, 'user');
    clearReplies();
    if (r.action) await handleAction(r.action);
    else if (r.next) await goToStep(r.next);
  }

  async function handleInputSubmit() {
    const val = els.input.value.trim();
    if (!val) return;
    const step = FLOWS[state.currentStep];
    if (!step || !step.input) return;
    if (step.input.validate === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      renderMessage("Hmm, that doesn't look like a valid email. Mind trying again?", 'bot');
      return;
    }
    renderMessage(val, 'user');
    state.userData[step.input.field] = val;
    hideInput(); els.input.value = '';
    await goToStep(step.input.next);
  }

  async function handleAction(action) {
    if (action === 'open_book') window.location.href = '/#book';
    else if (action === 'open_quiz') window.location.href = '/quiz.html';
    else if (action === 'open_order') window.location.href = '/order.html';
    else if (action === 'open_blog') window.location.href = '/blog/';
    else if (action === 'open_calculator') window.location.href = '/roi-calculator.html';
    else if (action === 'submit_lead') await submitLead();
  }

  async function submitLead() {
    showTyping();
    let ok = false;
    try {
      const res = await fetch('https://formspree.io/f/xojneaal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: state.userData.name,
          email: state.userData.email,
          message: state.userData.message,
          source: 'chat-widget',
          _subject: 'New chat lead: ' + state.userData.name
        })
      });
      ok = res.ok;
    } catch (e) { console.warn('Chat lead submit failed', e); }
    await sleep(500); hideTyping();
    await goToStep(ok ? 'thanks' : 'error');
  }

  async function goToStep(stepName) {
    state.currentStep = stepName;
    const step = FLOWS[stepName]; if (!step) return;
    hideInput(); clearReplies();
    if (step.action && !step.messages) { await handleAction(step.action); return; }
    if (step.messages) {
      for (let i = 0; i < step.messages.length; i++) {
        showTyping();
        await sleep(600 + Math.min(step.messages[i].length * 6, 700));
        hideTyping();
        renderMessage(interpolate(step.messages[i], state.userData), 'bot');
        await sleep(180);
      }
    }
    if (step.replies) showReplies(step.replies);
    else if (step.input) showInput(step.input.placeholder);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();