import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { COLORS, STYLES_TEAL, PDFHeader, PDFFooter } from "./PDFBase";
import type { LeadProfile, PDFContent } from "@/types";

const s = STYLES_TEAL;
const BADGE = "CAREER TRANSITION";

const ALUMNI_QUOTES = [
  { name: "Rohan D., ex-Infosys → Razorpay SDE-2", quote: "I was stuck in CRUD work for 3 years. Scaler gave me the foundation to compete with IIT grads in product company interviews." },
  { name: "Meghna S., ex-Cognizant → Swiggy", quote: "The switch felt impossible until I saw the system design and DSA depth Scaler covers. Six months later, I had three product company offers." },
];

interface Props { lead: LeadProfile; content: PDFContent; }

export function SwitcherVariant({ lead: _lead, content }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <PDFHeader headline={content.headline} subheadline={content.subheadline} s={s} programBadge={BADGE} />
        <View style={s.body}>
          <Text style={s.sectionTitle}>Where you are — and where you could be</Text>
          <Text style={s.paragraph}>{content.executiveSummary}</Text>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Why this switch is possible — for you</Text>
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
          <Text style={s.sectionTitle}>Skills that make the switch stick</Text>
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
          <Text style={s.sectionTitle}>Your doubts, addressed</Text>
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
          <Text style={s.sectionTitle}>People who made the same switch</Text>
          {ALUMNI_QUOTES.map((q, i) => (
            <View key={i} style={[s.card, { marginBottom: 10 }]}>
              <Text style={[s.cardBody, { marginBottom: 6 }]}>"{q.quote}"</Text>
              <Text style={s.cardTitleAccent}>{q.name}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <Text style={s.sectionTitle}>The salary math</Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {[
              { label: "Service company avg", value: "8-14 LPA" },
              { label: "Product company avg", value: "18-30 LPA" },
              { label: "Typical delta", value: "10-16 LPA" },
            ].map((stat, i) => (
              <View key={i} style={[s.statBox, { marginRight: i < 2 ? 8 : 0 }]}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Your next step</Text>
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
