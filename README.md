# Scaler BDA Sales Agent

**Live:** https://scaler-bda-agent.vercel.app

---

## What I built

A two-flow tool for Scaler BDAs. Before a call, the BDA gets a WhatsApp brief with a persona read on the lead, two or three angles likely to land, objections to expect with one-line handles, and a suggested opening — all pulled from the lead's profile and intent. After the call, they paste the transcript or upload the recording, the agent extracts what the lead didn't get answered, and generates a 3-page PDF addressed to that specific person's situation. The BDA reviews it, edits the covering message if needed, approves, and it goes to the lead's WhatsApp. Three PDF variants with different visual design and framing — fresher, switcher, senior — so the content matches where the lead actually is. Scaler curriculum and outcomes are grounded in data scraped from scaler.com, not fabricated.

---

## One failure I found

Meera (0 YoE, final-year student) was getting the switcher PDF — built for mid-career service engineers — because "product company" in her intent triggered the keyword match before the YoE check. She'd have received transition framing that had nothing to do with her situation. Fixed, but I only caught it running QA after the fact, not during design.

---

## Scale plan

The two real constraints at 100k leads/month: first, PDF generation makes two sequential Claude calls and takes ~15 seconds per lead — that's fine synchronously at low volume but needs to go async at scale (accept request, generate in background, push to WhatsApp on completion). Second, the knowledge base is a static JSON scraped once from scaler.com. At volume, stale curriculum data — wrong module names, outdated salary figures — becomes a trust problem with leads. Fix is a weekly diff job that flags changes for manual review, not a full RAG pipeline.

---

## Three product questions

**1. Where does the nudge actually land in the BDA's workflow?**
The current flow assumes the BDA checks WhatsApp 10 minutes before the call. But if they're back-to-back on calls, the brief arrives and gets buried. Have you mapped what BDAs actually do in the 5-10 minutes before a dial? If not, I'd want to watch 3-4 BDAs prep for calls before deciding whether WhatsApp is the right delivery channel — or whether it should surface inside whatever CRM they're already staring at.

**2. What does "good call" look like in your data, and are we optimizing for the right moment?**
The PDF addresses objections the lead raised on the call. But if leads who don't take the entrance test are dropping because of trust, not information, a polished PDF might not move the needle. I'd want to know: do leads who take the test do so because they got more information, or because the BDA built enough rapport? The answer changes whether the post-call artifact should be a PDF at all, or just a personalized voice note from the BDA.

**3. Are you capturing which PDFs actually converted?**
Right now the agent generates a PDF and sends it. But there's no signal on whether leads who received a PDF took the entrance test at a higher rate than those who didn't. Without that, you can't tune the prompts, the variant logic, or even validate the hypothesis that a personalized PDF helps. The most valuable thing you could build alongside this is a lightweight outcome tracker — even just a BDA marking "took test / didn't" on each send. Without it, you're optimizing blind.

---

## Setup

Both numbers (BDA + lead) need to opt into the Twilio sandbox before any WhatsApp message lands. Send `join plenty-grand` from each number to **+1 415 523 8886** on WhatsApp.

Then open the app, enter your number in the header, pick a lead, and run either flow. The app accepts any custom lead profile — nothing is hardcoded to the three sample personas.
