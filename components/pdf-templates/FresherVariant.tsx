import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { COLORS, STYLES_RED, PDFHeader, PDFFooter } from "./PDFBase";
import type { LeadProfile, PDFContent } from "@/types";

const s = STYLES_RED;
const BADGE = "LAUNCH TRACK";

const ALUMNI_QUOTES = [
  { name: "Anika R., Tier-3 college → Juspay SDE-1", quote: "My college brand meant nothing in product company interviews. Scaler gave me the skills and confidence to compete anyway. First attempt, two offers." },
  { name: "Kiran P., 0 YoE → Urban Company", quote: "I was terrified of the entrance test. Scaler's prep resources made it manageable. Three months of focused work changed my entire trajectory." },
];

interface Props { lead: LeadProfile; content: PDFContent; }

export function FresherVariant({ lead: _lead, content }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFHeader headline={content.headline} subheadline={content.subheadline} s={s} programBadge={BADGE} />
        <View style={s.body}>
          <Text style={s.sectionTitle}>Where you are starting from</Text>
          <Text style={s.paragraph}>{content.executiveSummary}</Text>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Why Scaler is built for exactly your situation</Text>
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
          <Text style={s.sectionTitle}>What you will learn — step by step</Text>
          {(content.curriculumHighlights ?? []).slice(0, 4).map((c, i) => (
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
        </View>
        <PDFFooter s={s} />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.headerSub}>
          <Text style={s.headerBrandNoMargin}>SCALER · {BADGE}</Text>
        </View>
        <View style={s.body}>
          <Text style={s.sectionTitle}>Your questions, honestly answered</Text>
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
          <Text style={s.sectionTitle}>People who started exactly where you are</Text>
          {ALUMNI_QUOTES.map((q, i) => (
            <View key={i} style={[s.card, { marginBottom: 10 }]}>
              <Text style={[s.cardBody, { marginBottom: 6 }]}>"{q.quote}"</Text>
              <Text style={s.cardTitleAccent}>{q.name}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <Text style={s.sectionTitle}>First job salary range (Scaler alumni)</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {[
              { label: "Product company entry", value: "8-15 LPA" },
              { label: "vs typical campus avg", value: "3-4 LPA" },
              { label: "Hiring partners", value: "900+" },
            ].map((stat, i) => (
              <View key={i} style={[s.statBox, { marginRight: i < 2 ? 8 : 0 }]}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>What happens next</Text>
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
