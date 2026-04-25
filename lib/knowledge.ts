import knowledgeData from "./scaler-knowledge.json";
import type { LeadProfile } from "@/types";

const SWITCH_KEYWORDS = [
  "switch", "transition", "change", "move to product", "move to startup",
  "tired of service", "product company", "service to product",
];

export function selectVariant(lead: LeadProfile): "senior" | "switcher" | "fresher" {
  if (lead.yoe === 0) return "fresher";
  const intentLower = lead.intent.toLowerCase();
  const isSwitcher = SWITCH_KEYWORDS.some((k) => intentLower.includes(k));
  if (isSwitcher) return "switcher";
  if (lead.yoe >= 5) return "senior";
  return "fresher";
}

export function getRelevantContext(lead: LeadProfile): string {
  const intentLower = (lead.intent ?? "").toLowerCase();
  const notesLower = (lead.linkedinNotes ?? "").toLowerCase();
  const combined = intentLower + " " + notesLower;

  // Score each program by keyword relevance
  const programs = (knowledgeData.programs as unknown) as Array<{
    name: string;
    keywords: string[];
    curriculum_modules?: unknown[];
    differentiators?: string[];
    salary_outcomes?: Record<string, string>;
    vs_free_alternatives?: Record<string, string>;
    duration?: string;
    price?: string;
    target_yoe?: string;
  }>;

  const scored = programs.map((p) => {
    const score = p.keywords.filter((k) => combined.includes(k)).length;
    return { program: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 2).map((s) => s.program);

  const lines: string[] = [];

  for (const p of top) {
    lines.push(`## ${p.name}`);
    lines.push(`Duration: ${p.duration} | Price: ${p.price} | Target: ${p.target_yoe} YoE`);

    if (p.curriculum_modules) {
      lines.push("### Key Curriculum Modules:");
      for (const m of p.curriculum_modules as Array<{ name: string; duration?: string; topics?: string[] }>) {
        lines.push(`- ${m.name}${m.duration ? ` (${m.duration})` : ""}: ${(m.topics || []).slice(0, 5).join(", ")}`);
      }
    }

    if (p.differentiators) {
      lines.push("### What makes Scaler different:");
      for (const d of p.differentiators.slice(0, 4)) {
        lines.push(`- ${d}`);
      }
    }

    if (p.salary_outcomes) {
      lines.push("### Salary Outcomes:");
      for (const [k, v] of Object.entries(p.salary_outcomes).slice(0, 4)) {
        lines.push(`- ${k.replace(/_/g, " ")}: ${v}`);
      }
    }

    if (p.vs_free_alternatives) {
      lines.push("### vs Free Alternatives:");
      for (const [k, v] of Object.entries(p.vs_free_alternatives)) {
        lines.push(`- ${k}: ${v}`);
      }
    }

    lines.push("");
  }

  // Always append general facts + objection handles
  const general = knowledgeData.general_scaler_facts;
  lines.push("## General Scaler Facts:");
  lines.push(`- Alumni: ${general.total_alumni}, Hiring Partners: ${general.hiring_partners}`);
  lines.push(`- Faculty: ${general.faculty_background}`);
  lines.push(`- Cohort quality: ${(general as unknown as Record<string, string>).cohort_quality}`);
  lines.push(`- Entrance test: ${general.entrance_test}`);
  lines.push(`- Payment: ${general.payment_options.slice(0, 3).join("; ")}`);

  lines.push("\n## Objection Handles:");
  const obj = knowledgeData.common_objections_and_handles as Record<string, string>;
  for (const [, v] of Object.entries(obj).slice(0, 4)) {
    lines.push(`- ${v}`);
  }

  return lines.join("\n").slice(0, 3500);
}

export function getContextByKeywords(question: string): string {
  const q = question.toLowerCase();
  const fakeLead: LeadProfile = {
    name: "", role: "", company: "", yoe: 3,
    intent: q, linkedinNotes: q, leadWhatsApp: "",
  };
  return getRelevantContext(fakeLead);
}
