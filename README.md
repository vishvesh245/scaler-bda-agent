# Scaler BDA Sales Agent

## What I built

A Next.js app that supercharges two drop-off points in Scaler's sales funnel. Before a call, the BDA gets a personalised WhatsApp brief — who the lead is, two or three angles that'll resonate, likely objections with one-line handles, and a suggested opening hook — so the first 30 seconds aren't generic. After the call, the BDA pastes a transcript (or uploads a recording), the agent extracts the lead's open questions, and generates a 3-page PDF personalised to that specific person's situation, goals, and doubts — grounded in real Scaler curriculum data scraped from scaler.com. The BDA reviews it, approves or edits the covering message, and the PDF lands on the lead's WhatsApp. Three PDF variants (Fresher / Switcher / Senior) with different visual design, framing, and content so Meera's PDF doesn't read like Rohan's.

---

## One failure I found

When a fresher (0 YoE) mentions "product company" in their intent, the variant selector classified them as Switcher instead of Fresher — because keyword matching ran before the YoE check. Meera was getting the career-transition framing designed for 4-year service engineers, not the placement-focused fresher PDF. Fixed by checking `yoe === 0` first.

---

## Scale plan

At 100k leads/month, two things break. First, Claude latency — each PDF flow makes two sequential Anthropic calls (~15s total). At scale that's fine per-lead but the PDF queue needs to move async: accept the request, generate in background, push to WhatsApp when ready rather than holding the HTTP connection. Second, the Scaler knowledge base is a static JSON file scraped once. At volume, curriculum drift (outdated module names, wrong salary figures) becomes a trust problem. The fix is a lightweight weekly scrape job that diffs against the committed version and flags changes for review — not a live RAG pipeline, just fresh ground truth.

---

## Demo setup

Both numbers (BDA + lead) must opt into the Twilio WhatsApp Sandbox before receiving messages.

Send this from each number to **+1 415 523 8886** on WhatsApp:
```
join plenty-grand
```

Then open **https://scaler-bda-agent.vercel.app/dashboard**, enter your WhatsApp number in the header, select or fill a lead profile, and run either flow.

---

## How to test with your own input

The app accepts any lead profile + transcript or audio file — nothing is hardcoded. Fill in the form fields with your own lead details, paste your transcript (or upload a recording), and click Generate PDF.

---

## Local development

```bash
npm install
cp .env.example .env.local
# fill in API keys
npm run dev
```

| Variable | Source |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `ASSEMBLYAI_API_KEY` | assemblyai.com/dashboard |
| `TWILIO_ACCOUNT_SID` | console.twilio.com |
| `TWILIO_AUTH_TOKEN` | console.twilio.com |
| `TWILIO_WHATSAPP_FROM` | `+14155238886` |
| `BLOB_READ_WRITE_TOKEN` | Vercel dashboard → Storage → Blob |

---

## Stack

Next.js 16 · Claude Sonnet 4.6 · AssemblyAI · Twilio WhatsApp Sandbox · @react-pdf/renderer · Vercel Blob
