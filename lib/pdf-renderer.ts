import React from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { SeniorVariant } from "@/components/pdf-templates/SeniorVariant";
import { SwitcherVariant } from "@/components/pdf-templates/SwitcherVariant";
import { FresherVariant } from "@/components/pdf-templates/FresherVariant";
import type { LeadProfile, PDFContent, PDFVariant } from "@/types";

export async function renderPDF(
  lead: LeadProfile,
  content: PDFContent,
  variant: PDFVariant
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let element: React.ReactElement<any>;

  switch (variant) {
    case "senior":
      element = React.createElement(SeniorVariant, { lead, content });
      break;
    case "switcher":
      element = React.createElement(SwitcherVariant, { lead, content });
      break;
    case "fresher":
    default:
      element = React.createElement(FresherVariant, { lead, content });
  }

  const { renderToBuffer } = await import("@react-pdf/renderer");
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}
