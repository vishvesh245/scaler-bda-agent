import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { COLORS, STYLES_GOLD, PDFHeader, PDFFooter } from "./PDFBase";
import type { LeadProfile, PDFContent } from "@/types";

const s = STYLES_GOLD;
const BADGE = "SENIOR TRACK";

const ALUMNI_QUOTES = [
  { name: "Arjun M., ex-Wipro → Amazon SDE-2", quote: "The system design curriculum is genuinely deeper than what I had seen anywhere else. Real distributed systems, not whiteboard theory." },
  { name: "Priya K., ex-TCS → Flipkart", quote: "I was skeptical at 8 YoE. But the cohort quality surprised me — I was learning from peers, not just instructors." },
];

interface Props { lead: LeadProfile; content: PDFContent; }

export function SeniorVariant({ lead: _lead, content }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFHeader headline={content.headline} subheadline={content.subheadline} s={s} programBadge={BADGE} />
        <View style={s.body}>
          <Text style={s.sectionTitle}>Your situation, honestly</Text>
          <Text style={s.paragraph}>{content.executiveSummary}</Text>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Why Scaler — for you specifically</Text>
          {(content.whyScalerForYou?.points ?? []).map((p, i) => (
            <View key={i} style={s.card}>
              <View style={s.row}>
                <View style={s.accentDot} />
                <Text style={s.cardTitle}>{p.heading}</Text>
              </View>
              <Text style={s.cardBody}>{p.body}</Text>
            </View>
          ))}
        </View>
        <PDFFooter s={s} />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerSub}>
          <Text style={s.headerBrandNoMargin}>SCALER · {BADGE}</Text>
        </View>
        <View style={s.body}>
          <Text style={s.sectionTitle}>What you will actually cover</Text>
          {(content.curriculumHighlights ?? []).map((c, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 8, alignItems: "flex-start" }}>
              <View style={s.chip}>
                <Text style={s.chipText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitleSmall}>{c.module}</Text>
                <Text style={s.cardBodyGray}>{c.relevance}</Text>
              </View>
            </View>
          ))}
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Your questions, answered</Text>
          {(content.addressedConcerns ?? []).map((ac, i) => (
            <View key={i} style={s.qaRow}>
              <Text style={s.question}>Q: {ac.concern}</Text>
              <Text style={s.answer}>{ac.response}</Text>
            </View>
          ))}
        </View>
        <PDFFooter s={s} />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerSub}>
          <Text style={s.headerBrandNoMargin}>SCALER · {BADGE}</Text>
        </View>
        <View style={s.bodyLast}>
          <Text style={s.sectionTitle}>What experienced engineers say</Text>
          {ALUMNI_QUOTES.map((q, i) => (
            <View key={i} style={[s.card, { marginBottom: 10 }]}>
              <Text style={[s.cardBody, { marginBottom: 6 }]}>"{q.quote}"</Text>
              <Text style={s.cardTitleAccent}>{q.name}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Salary trajectory (alumni data)</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {[
              { label: "Mid-level (2-5 YoE)", value: "12-18 LPA" },
              { label: "Senior (5+ YoE)", value: "20-40+ LPA" },
              { label: "Typical hike", value: "~110% median" },
            ].map((stat, i) => (
              <View key={i} style={[s.statBox, { marginRight: i < 2 ? 8 : 0 }]}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Next step</Text>
          <Text style={s.paragraph}>{content.nextSteps}</Text>
          <View style={s.card}>
            <Text style={s.cardBody}>{content.closingNote}</Text>
          </View>
        </View>
        <PDFFooter s={s} />
      </Page>
    </Document>
  );
}
