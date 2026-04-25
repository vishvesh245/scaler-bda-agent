import { NextRequest } from "next/server";
import { getAnthropicClient, MODEL } from "@/lib/anthropic";
import { getRelevantContext, selectVariant } from "@/lib/knowledge";
import { EXTRACT_SYSTEM, extractUserMessage } from "@/lib/prompts/extract-questions";
import { PDF_SYSTEM, pdfUserMessage } from "@/lib/prompts/pdf-content";
import { renderPDF } from "@/lib/pdf-renderer";
import { uploadPDF } from "@/lib/blob";
import type { LeadProfile, PDFContent } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { lead, transcript }: { lead: LeadProfile; transcript: string } = await req.json();
    if (!lead?.name || !lead?.role) {
      return Response.json({ error: "lead.name and lead.role are required" }, { status: 400 });
    }
    if (!transcript?.trim()) {
      return Response.json({ error: "transcript is required" }, { status: 400 });
    }
    const client = getAnthropicClient();
    const context = getRelevantContext(lead);

    // Step 1: Extract open questions from transcript
    const extractMsg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: EXTRACT_SYSTEM,
      messages: [{ role: "user", content: extractUserMessage(transcript) }],
    });
    const extractText = extractMsg.content[0].type === "text" ? extractMsg.content[0].text : "[]";
    let openQuestions: string[] = [];
    try {
      // Strip markdown code fences if present
      const clean = extractText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      openQuestions = JSON.parse(clean);
    } catch {
      openQuestions = ["What makes Scaler different from free resources?", "What salary growth can I expect?"];
    }

    // Step 2: Generate full PDF content
    const pdfMsg = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: PDF_SYSTEM,
      messages: [{ role: "user", content: pdfUserMessage(lead, openQuestions, context) }],
    });
    const pdfText = pdfMsg.content[0].type === "text" ? pdfMsg.content[0].text : "{}";
    let pdfContent: PDFContent;
    try {
      const clean = pdfText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      const required = ["headline", "subheadline", "executiveSummary", "whyScalerForYou", "curriculumHighlights", "addressedConcerns", "nextSteps", "closingNote"];
      const missing = required.filter((k) => !parsed[k]);
      if (missing.length) throw new Error(`Missing fields: ${missing.join(", ")}`);
      pdfContent = parsed;
    } catch (e) {
      return Response.json({ error: `Failed to parse PDF content: ${e instanceof Error ? e.message : e}` }, { status: 500 });
    }

    // Step 3: Render PDF
    const variant = selectVariant(lead);
    const pdfBuffer = await renderPDF(lead, pdfContent, variant);

    // Step 4: Upload to Vercel Blob
    const filename = `scaler-${lead.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;
    const blobUrl = await uploadPDF(filename, pdfBuffer);

    return Response.json({ blobUrl, pdfContent, variant, openQuestions });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("generate-pdf error:", err instanceof Error ? err.stack : message);
    return Response.json({ error: message }, { status: 500 });
  }
}
