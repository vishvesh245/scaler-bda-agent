"use client";
import { useState } from "react";
import { TranscriptInput } from "./TranscriptInput";
import { PDFPreview } from "./PDFPreview";
import type { LeadProfile, PDFContent, PDFVariant } from "@/types";

interface Props {
  lead: LeadProfile;
}

export function PDFFlow({ lead }: Props) {
  const [transcript, setTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [resultCache, setResultCache] = useState<Record<string, {
    blobUrl: string;
    pdfContent: PDFContent;
    variant: PDFVariant;
  }>>({});
  const result = resultCache[lead.name] ?? null;
  const setResult = (r: { blobUrl: string; pdfContent: PDFContent; variant: PDFVariant } | null) =>
    setResultCache((prev) => r ? { ...prev, [lead.name]: r } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== lead.name)));
  const [pdfSent, setPdfSent] = useState(false);

  async function generatePDF() {
    if (!lead.name || !lead.role) {
      setError("Please fill in the lead profile first.");
      return;
    }
    if (!transcript.trim()) {
      setError("Please provide a call transcript or upload an audio recording.");
      return;
    }
    setError("");
    setGenerating(true);
    setResult(null);
    setPdfSent(false);

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ blobUrl: data.blobUrl, pdfContent: data.pdfContent, variant: data.variant });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#1a1a2e]">Post-call personalised PDF</h3>
          <p className="text-sm text-gray-500">BDA approves before it reaches the lead.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call transcript
        </label>
        <TranscriptInput
          transcript={transcript}
          onTranscriptChange={setTranscript}
          disabled={generating}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {!result && (
        <button
          onClick={generatePDF}
          disabled={generating || !transcript.trim()}
          className="w-full bg-[#1a1a2e] text-white font-semibold py-3 rounded-lg hover:bg-[#2d2d4e] transition disabled:opacity-60"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating PDF... (takes ~15s)
            </span>
          ) : (
            "Generate personalised PDF →"
          )}
        </button>
      )}

      {result && (
        <PDFPreview
          blobUrl={result.blobUrl}
          pdfContent={result.pdfContent}
          lead={lead}
          variant={result.variant}
          onSent={() => setPdfSent(true)}
        />
      )}

      {result && !pdfSent && (
        <button
          onClick={() => {
            setResult(null);
            setTranscript("");
          }}
          className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
        >
          Start over with new transcript
        </button>
      )}
    </div>
  );
}
