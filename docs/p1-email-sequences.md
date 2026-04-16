# SignalARC — P1 Outbound Email Sequences

**Last updated:** April 2026
**Companion file:** `signalarc-p1-email-sequences.xlsx` (paste-ready formatting)

Three 5-email outbound sequences customized to SignalARC's P1 personas — Financial Services, Healthcare, and HR Tech. Each sequence is ready to deploy in Apollo, Instantly, Smartlead, or any modern ESP.

---

## Deployment checklist

- [ ] Apollo list built using filters from `docs/personas.md` for the target persona
- [ ] ESP configured with `{{first_name}}` and `{{company}}` merge tags
- [ ] **Stop-on-reply enabled** (non-negotiable — never send emails 2–5 after a reply)
- [ ] Domain warmed (new domains should warm for 2–4 weeks before sending at volume)
- [ ] Schedule: Day 0, Day 3, Day 8, Day 14, Day 21 — weekdays only, 9–11am recipient timezone
- [ ] Campaign logged in `signalarc-personas-apollo.xlsx` > Campaign Tracker tab

---

## Benchmarks to beat

| Metric | Floor | Good | Great | Action if below floor |
|---|---|---|---|---|
| Open rate (if tracked) | 25% | 35% | 50%+ | Rewrite subject line; check domain warm-up |
| Reply rate | 1% | 2% | 4%+ | Rewrite email 2's question; narrow persona |
| Positive reply rate | 40% | 60% | 75%+ | Fix ICP — you're hitting wrong titles |
| Meeting booked rate | 0.5% | 1% | 2%+ | Rewrite email 5 CTA; add social proof |

---

# 🏦 Financial Services — The Compliance-Minded CMO

---

### Email 1 — Day 0
**Subject:** Your 2026 Benchmark Report (FinServ edition)

```
Hi {{first_name}},

Our team just published the 2026 B2B Content Syndication Benchmark Report — here's the page: https://signalarc.io/benchmark-report.html

The part most financial services marketers find useful is the CPL table on page 3 — average cost-per-lead for FinServ is $55, and the compliance-ready content formats section on page 5.

Figured it might be relevant if you're planning 2026 lead gen at {{company}}.

If anything in there surprises you, just hit reply. I read every one.

— Josh
SignalARC
```

**Goal:** Value delivery. Deliver something useful immediately. No pitch.

---

### Email 2 — Day 3
**Subject:** One question about compliance approval

```
Hi {{first_name}},

Quick one: when you're running a B2B lead gen campaign at {{company}}, where does compliance approval usually bottleneck you?

Most FinServ marketers we talk to say it's one of two places: (1) legal reviewing every content asset from scratch, or (2) the landing page copy needing full disclosures that kill conversion rates.

Curious which one costs your team more time — and if there's a third version I'm missing.

(One-line answers are fine.)

— Josh
```

**Goal:** Establish the pain. Invite a reply with a specific, answerable question.

---

### Email 3 — Day 8
**Subject:** How a regional credit union generated 140 leads without legal review drama

```
Hi {{first_name}},

A regional credit union we worked with was stuck in the same compliance-approval loop most FinServ marketers run into. They fixed it by doing three things:

→ Pre-approved content asset (one whitepaper, legal signed off once)
→ Pre-approved audience filters (titles + company size agreed with legal upfront)
→ Weekly lead delivery in fixed CSV format (no case-by-case review)

Result: 140 verified leads over 90 days, zero custom compliance reviews per lead.

Full playbook (no gate): https://signalarc.io/b2b-lead-gen-playbook.html

Worth 8 minutes if 2026 planning is on your desk.

— Josh
```

**Goal:** Social proof through a concrete case. Specific industry-adjacent.

---

### Email 4 — Day 14
**Subject:** The thing most FinServ marketing teams get wrong about content syndication

```
Hi {{first_name}},

Most financial services marketing teams approach content syndication the same way they approach LinkedIn Ads — chase volume, optimize on CPL.

That's backwards for FinServ.

What actually works: narrow the audience more than feels comfortable (title + seniority + AUM/revenue band), pay a higher per-lead rate, then pair it with a proper 5-email nurture. Your CAC lands 40-60% below LinkedIn Ads, your MQL-to-SQL rate hits 20%+, and legal sleeps better.

Our ROI calculator plugs your numbers into this exact model: https://signalarc.io/roi-calculator.html

Two minutes to see if the math works for {{company}}.

— Josh
```

**Goal:** Teach. Position SignalARC as the expert, not a vendor.

---

### Email 5 — Day 21
**Subject:** Worth a 15-min conversation?

```
Hi {{first_name}},

I've sent you a few things over the last three weeks — hoping at least one was useful for whatever's on your 2026 plan.

If B2B lead gen in financial services is something you're actively figuring out, I'd love 15 minutes to compare notes. No demo, no pitch — just a conversation about what's working (and what isn't) for FinServ marketers this year.

Calendar: https://signalarc.io/#contact

And if now's not the right time, totally understood. I'll stay out of your inbox.

— Josh
```

**Goal:** Soft ask. No demo. No pressure.

---

# 🏥 Healthcare & Medical Devices — The Clinical-Buyer Targeting Marketer

---

### Email 1 — Day 0
**Subject:** Your 2026 Benchmark Report (Healthcare edition)

```
Hi {{first_name}},

We just published the 2026 B2B Content Syndication Benchmark Report: https://signalarc.io/benchmark-report.html

For healthcare/medtech marketers, the two pages worth skimming are the CPL benchmarks (healthcare averages $62/lead, highest of any industry we track) and the content format section — clinical case studies outperform generic "buyer's guides" by a wide margin.

Thought it might be useful for whatever you're planning at {{company}} in 2026.

Hit reply if anything surprises you. I read every response.

— Josh
SignalARC
```

**Goal:** Value delivery. Signal you understand their world.

---

### Email 2 — Day 3
**Subject:** One question about reaching clinicians

```
Hi {{first_name}},

Quick one: when you're running lead gen at {{company}}, what's the hardest audience to actually reach — clinicians themselves, hospital administrators, or the procurement/IT side?

Most healthcare marketers we talk to say clinicians are the toughest: they're not on LinkedIn much, they don't click display ads, and they're skeptical of marketing content by default.

Curious if that matches your reality — or if it's actually administrators that are harder in your category.

(One-line reply is plenty.)

— Josh
```

**Goal:** Establish the specific pain. Invite a real reply.

---

### Email 3 — Day 8
**Subject:** How a medtech company filled their pipeline without touching LinkedIn Ads

```
Hi {{first_name}},

A medtech company we worked with had the same problem you probably have: clinicians won't click on LinkedIn Ads, and hospital marketing restrictions limit what they can publish.

Their fix was content syndication with three specific filters:

→ Clinical titles only (no marketing titles in the list)
→ Gated peer-reviewed format whitepaper (not a sales deck dressed up)
→ Delivered via publisher network that clinicians actually read

Result: 180 qualified clinician leads in 6 months at a $45 effective CPL — compared to $200+ they were paying on LinkedIn.

Full playbook: https://signalarc.io/b2b-lead-gen-playbook.html

Worth a read if clinician lead gen is on your 2026 roadmap.

— Josh
```

**Goal:** Social proof. Specific outcome. Healthcare-adjacent.

---

### Email 4 — Day 14
**Subject:** The thing most healthcare marketing teams get wrong

```
Hi {{first_name}},

Most healthcare marketing teams try to produce content that looks like B2B SaaS content — bright colors, buzzwords, "10 reasons why" lists.

That's wrong for healthcare buyers.

Clinicians and hospital administrators are trained skeptics. They respond to content that looks like what they already read: white papers with citations, data tables, peer case studies with real outcomes. Anything that looks "marketed" gets ignored.

Our 2026 playbook goes deep on the clinical-credibility format — page 6: https://signalarc.io/b2b-lead-gen-playbook.html

Two-minute skim, might save you a quarter of wasted content production.

— Josh
```

**Goal:** Teach. Position as the expert, not a vendor.

---

### Email 5 — Day 21
**Subject:** Worth a 15-min conversation?

```
Hi {{first_name}},

I've sent a few things over the last three weeks — thanks for reading (if you did).

If B2B lead gen in healthcare is on your 2026 plan, I'd love 15 minutes to compare notes. No demo, no pitch — just a conversation about what's working (and what isn't) for healthcare marketers right now.

Calendar: https://signalarc.io/#contact

And if now's not the right time, totally fine — I'll stay out of your inbox.

— Josh
```

**Goal:** Soft ask. No demo. Respect their time.

---

# 👥 HR & Workforce Management — The Committee-Navigating Marketer

---

### Email 1 — Day 0
**Subject:** Your 2026 Benchmark Report (HR tech edition)

```
Hi {{first_name}},

Just published the 2026 B2B Content Syndication Benchmark Report: https://signalarc.io/benchmark-report.html

For HR tech marketers, two sections are worth your time: the CPL benchmarks (HR tech averages $48/lead — lower than FinServ/healthcare, higher than manufacturing) and the conversion data, which shows HR buying committees are the longest in B2B (9-12 months) but have the highest MQL-to-SQL rates when nurtured properly.

Figured it might fit {{company}}'s 2026 planning.

Hit reply if anything in there surprises you.

— Josh
SignalARC
```

**Goal:** Value delivery. Frame it for HR tech specifically.

---

### Email 2 — Day 3
**Subject:** One question about buying committees

```
Hi {{first_name}},

Quick one: when you're running demand gen at {{company}}, where does the buying committee cost you the most time — getting in front of the CHRO, navigating the evaluation from HRBP + IT + finance, or the internal champion needing ammunition to sell it up?

Most HR tech marketers we talk to say it's the ammunition problem — the champion is sold, but they don't have the right materials to convince the CFO.

Curious which one is hitting you hardest right now. (Even a one-word reply helps.)

— Josh
```

**Goal:** Lean into the HR-specific pain: long committees.

---

### Email 3 — Day 8
**Subject:** How an HR tech startup shortened their sales cycle from 11 months to 6

```
Hi {{first_name}},

An HR tech startup we worked with was getting demos with CHROs, losing them to the finance review, and running 11-month sales cycles.

They fixed it by building three pieces of content specifically for the buying committee:

→ A VP-level ROI calculator (champion sends to CFO on demo day)
→ A 6-page IT implementation spec (champion sends to IT before objections start)
→ A 2-page "risk of doing nothing" brief (champion uses in the final committee review)

All three syndicated to HRBPs and HR ops managers, not just CHROs, to seed champions earlier.

Sales cycle dropped to 6 months. Full playbook: https://signalarc.io/b2b-lead-gen-playbook.html

Worth a skim if committee drag is slowing {{company}} down.

— Josh
```

**Goal:** Social proof with a specific, believable outcome.

---

### Email 4 — Day 14
**Subject:** The thing most HR tech marketing teams get wrong

```
Hi {{first_name}},

Most HR tech marketing teams target the CHRO. That's actually wrong for most deal sizes.

In HR tech, the CHRO is the approver. The HRBP, HR ops manager, or talent director is the champion — and champions drive deals. Content that positions them as internal experts (and arms them with ammo for the committee) consistently outperforms CHRO-targeted content.

One 6-page "how to build the business case for [X]" guide aimed at the HRBP tier will out-convert a CHRO-targeted whitepaper 3:1 in our data.

Our playbook has the breakdown: https://signalarc.io/b2b-lead-gen-playbook.html

Worth a coffee's worth of reading.

— Josh
```

**Goal:** Teach. Contrarian take to earn attention.

---

### Email 5 — Day 21
**Subject:** Worth a 15-min conversation?

```
Hi {{first_name}},

I've sent a few things over the last three weeks — hoping something in there was useful.

If HR tech lead gen is on your 2026 plan, I'd love 15 minutes to compare notes. No demo, no pitch — just a conversation about what's working in the category right now.

Calendar: https://signalarc.io/#contact

And if timing's off, no worries — I'll stay out of your inbox.

— Josh
```

**Goal:** Soft ask. Respect their time.

---

## Customization notes

Every sequence references:
- **Your Benchmark Report:** `https://signalarc.io/benchmark-report.html`
- **Your Playbook:** `https://signalarc.io/b2b-lead-gen-playbook.html`
- **Your ROI Calculator:** `https://signalarc.io/roi-calculator.html`
- **Your Contact Page:** `https://signalarc.io/#contact`

These are already correct. No [brackets] to fill in before sending — the sequences are ready to deploy.

Change these only if the URLs change on the site, or if you want to swap in a dedicated booking link (Calendly, Chili Piper, etc.) for email 5.

---

## When to rewrite

Watch the Campaign Tracker tab of `signalarc-personas-apollo.xlsx` after every 50 sends:

- **Reply rate < 1%:** Email 2's question is wrong. Rewrite it to be more specific to their day-to-day.
- **Open rate < 25% (if tracked):** Email 1's subject line is weak. A/B test against "Quick question about {{company}}'s 2026 demand gen plan."
- **Reply rate solid, but 0 meetings booked:** Email 5's CTA is too soft or too hard. Test "Worth 15 minutes before your Q2 planning kicks off?" as a variant.
