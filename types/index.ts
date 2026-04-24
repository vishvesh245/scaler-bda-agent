export interface LeadProfile {
  name: string;
  role: string;
  company: string;
  yoe: number;
  intent: string;
  linkedinNotes: string;
  leadWhatsApp: string;
}

export interface PDFContent {
  headline: string;
  subheadline: string;
  executiveSummary: string;
  whyScalerForYou: {
    points: Array<{ heading: string; body: string }>;
  };
  curriculumHighlights: Array<{ module: string; relevance: string }>;
  addressedConcerns: Array<{ concern: string; response: string }>;
  nextSteps: string;
  closingNote: string;
}

export type PDFVariant = "senior" | "switcher" | "fresher";

export interface ScraperResult {
  url: string;
  title: string;
  excerpt: string;
}

export interface GenerateNudgeRequest {
  lead: LeadProfile;
}

export interface GeneratePDFRequest {
  lead: LeadProfile;
  transcript: string;
}

export interface SendPDFRequest {
  blobUrl: string;
  lead: LeadProfile;
  coveringMessage: string;
}
