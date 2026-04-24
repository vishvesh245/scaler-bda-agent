export const EXTRACT_SYSTEM = `You are an expert at analysing sales call transcripts.
Extract only the genuine open questions or unresolved concerns the LEAD expressed.
Ignore everything the BDA said. Ignore rhetorical statements.
Return a JSON array of strings — each a concise restatement of one concern or question.
Max 6 items. No commentary outside the JSON array.`;

export function extractUserMessage(transcript: string): string {
  return `<transcript>
${transcript}
</transcript>

Return a JSON array of the lead's open questions and unresolved concerns.`;
}
