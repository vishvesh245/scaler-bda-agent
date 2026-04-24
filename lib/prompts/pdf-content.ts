import type { LeadProfile } from "@/types";

export const PDF_SYSTEM = `You are creating a personalised leave-behind PDF for a Scaler sales call.
The PDF should feel written for THIS specific person — not a brochure.
Reference their background directly. Connect Scaler's program to their exact goals.
Do NOT fabricate curriculum details, alumni stats, or salary numbers not in the Scaler context.
If you are not sure, say something honest like "alumni in similar roles report..." rather than inventing specifics.

Respond ONLY with valid JSON matching this exact schema:
{
  "headline": "string (8-12 words, highly personal to this lead)",
  "subheadline": "string (15-20 words)",
  "executiveSummary": "string (60-80 words, written as if speaking directly to the lead)",
  "whyScalerForYou": {
    "points": [
      { "heading": "string", "body": "string (40-60 words)" },
      { "heading": "string", "body": "string (40-60 words)" },
      { "heading": "string", "body": "string (40-60 words)" }
    ]
  },
  "curriculumHighlights": [
    { "module": "string", "relevance": "string (why this module matters for THIS lead, 20-30 words)" }
  ],
  "addressedConcerns": [
    { "concern": "string (the lead's exact question/worry)", "response": "string (60-80 word direct answer, grounded in context)" }
  ],
  "nextSteps": "string (40-50 words, clear CTA toward the entrance test)",
  "closingNote": "string (25-30 words, warm personal sign-off)"
}`;

export function pdfUserMessage(
  lead: LeadProfile,
  openQuestions: string[],
  context: string
): string {
  return `Lead profile:
- Name: ${lead.name}
- Role: ${lead.role} at ${lead.company}
- Years of experience: ${lead.yoe}
- Intent: "${lead.intent}"
- Notes: ${lead.linkedinNotes || "none"}

Lead's open questions / concerns from the call:
${openQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Relevant Scaler program details:
<scaler_context>
${context}
</scaler_context>

Generate the personalised PDF content JSON. Make every section specific to ${lead.name}'s background and concerns.`;
}
