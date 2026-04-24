# Scaler BDA Sales Agent

An AI-powered sales assistant that supercharges two moments in Scaler's phone-call sales funnel:

1. **Pre-call nudge** — BDA gets a personalised WhatsApp brief 10 minutes before a call (lead context, resonance angles, objection handles, opening hook)
2. **Post-call PDF** — After the call, upload the transcript → Claude generates a 3-page personalised PDF → BDA approves → PDF delivered to lead's WhatsApp
3. **In-call assist** *(bonus)* — Live Q&A tool BDA uses during the call at `/in-call`

**Live app:** https://scaler-bda-agent.vercel.app

---

## Demo setup (required before testing)

### 1. Twilio WhatsApp Sandbox opt-in

Both your number (BDA) and the lead's number must opt in to the Twilio sandbox before receiving any WhatsApp messages.

Send this WhatsApp message from each number to **+1 415 523 8886**:

```
join plenty-grand
```

You should receive a confirmation message. Once done, the app can send WhatsApp messages to those numbers.

### 2. Use the app

1. Open https://scaler-bda-agent.vercel.app/dashboard
2. Enter your WhatsApp number (E.164 format, e.g. `+919876543210`) in the **Your WA** field in the header
3. Select a persona from the dropdown (Rohan Sharma, Karthik Iyer, Meera Patel) or fill a custom lead
4. Fill in the lead's WhatsApp number in the lead profile form

**Pre-call nudge tab:**
- Click **Generate nudge** → personalised WhatsApp brief appears
- Click **Send to BDA →** → message delivered to your WhatsApp

**Post-call PDF tab:**
- Paste a call transcript (or upload an audio recording)
- Click **Generate personalised PDF →** → 3-page PDF generated
- Review in the iframe → **Approve & Send** / **Edit message** / **Skip**
- On approve, PDF is sent to the lead's WhatsApp

**In-call assist:**
- Open `/in-call` on your phone during a live call
- Type a BDA question → get a grounded 2-3 sentence answer instantly

---

## Sample personas

| Name | Role | Company | YoE | PDF variant |
|---|---|---|---|---|
| Rohan Sharma | SDE-2 | TCS | 4 | Switcher (teal) |
| Karthik Iyer | Senior SWE | Google | 9 | Senior (gold) |
| Meera Patel | B.Tech student | College | 0 | Fresher (red) |

---

## Architecture

```
Browser → Next.js App Router (Vercel, Node.js runtime)
              ↓
         Claude Sonnet 4.6 (Anthropic)   — nudge + PDF content generation
         AssemblyAI                        — audio transcription
         @react-pdf/renderer              — PDF rendering (server-side)
         Vercel Blob                      — PDF hosting (public URL)
         Twilio WhatsApp Sandbox          — message delivery
         lib/scaler-knowledge.json        — pre-scraped Scaler curriculum + outcomes
```

**PDF variant selection:**
- YoE = 0 → Fresher (red, placement-focused)
- "switch"/"transition"/"product company" in intent → Switcher (teal, transition framing)
- YoE ≥ 5, no switch keywords → Senior (gold, ROI/career acceleration)

**Claude pipeline (PDF flow):**
1. Extract open questions from transcript → `string[]`
2. Generate full `PDFContent` JSON using lead profile + extracted questions + Scaler knowledge base

---

## Local development

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, ASSEMBLYAI_API_KEY, TWILIO_ACCOUNT_SID,
#          TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, BLOB_READ_WRITE_TOKEN

# Run dev server
npm run dev
```

### Required environment variables

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `ASSEMBLYAI_API_KEY` | assemblyai.com/dashboard |
| `TWILIO_ACCOUNT_SID` | console.twilio.com |
| `TWILIO_AUTH_TOKEN` | console.twilio.com |
| `TWILIO_WHATSAPP_FROM` | `+14155238886` (Twilio sandbox number) |
| `BLOB_READ_WRITE_TOKEN` | Vercel dashboard → Storage → Blob |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| LLM | Claude Sonnet 4.6 via `@anthropic-ai/sdk` |
| Transcription | AssemblyAI |
| WhatsApp | Twilio WhatsApp Sandbox |
| PDF generation | `@react-pdf/renderer` (Node.js runtime) |
| PDF hosting | Vercel Blob (public access) |
| Deployment | Vercel |
