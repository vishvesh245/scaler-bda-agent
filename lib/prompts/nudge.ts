import type { LeadProfile } from "@/types";

export const NUDGE_SYSTEM = `You are a sharp sales coach helping a Scaler BDA prep for a discovery call.
Your output is a WhatsApp message the BDA reads on their phone 10 minutes before dialling.
Tone: like a smart teammate texting you — direct, warm, no corporate language.
Max 180 words. Hard limit — do not exceed. No headers. No bullet symbols unless it genuinely helps scannability.
Be honest about what's inferred vs confirmed. Write like you know this person.`;

export function nudgeUserMessage(lead: LeadProfile, context: string): string {
  return `Lead profile:
- Name: ${lead.name}
- Current role: ${lead.role} at ${lead.company}
- Years of experience: ${lead.yoe}
- Stated intent: "${lead.intent}"
- LinkedIn / notes: ${lead.linkedinNotes || "nothing provided"}

Relevant Scaler program details:
<scaler_context>
${context}
</scaler_context>

Write the BDA prep nudge. Cover:
1. One-line persona read (who this person actually is, plain English)
2. 2-3 angles that'll resonate with them specifically (each tied to something real from their profile)
3. 2-3 objections they're likely to raise, each with a one-line handle
4. A suggested opening hook — the first sentence the BDA can use to open the call (make it specific, not generic)

Flag anything that's inferred vs confirmed. Do NOT fabricate specific numbers or outcomes not in the Scaler context.`;
}
