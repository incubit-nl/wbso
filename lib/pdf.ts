"use client";

import { jsPDF } from "jspdf";
import type { WBSOAanvraag } from "./types";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export function generateWBSOPDF(aanvraag: WBSOAanvraag): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  const lineHeight = 7;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(text, margin, y);
    y += lineHeight * 1.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  };

  const addSubtitle = (text: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(text, margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  };

  const addField = (label: string, value: string) => {
    doc.text(`${label}: ${value}`, margin, y);
    y += lineHeight;
  };

  const addText = (text: string) => {
    const splitText = doc.splitTextToSize(text, contentWidth);
    doc.text(splitText, margin, y);
    y += lineHeight * splitText.length;
  };

  const addSpacer = () => {
    y += lineHeight;
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("WBSO Aanvraag 2025", margin, y);
  y += lineHeight * 2;

  // Bedrijfsgegevens
  addTitle("1. Bedrijfsgegevens");
  addField("Bedrijfsnaam", aanvraag.bedrijfsgegevens.bedrijfsnaam);
  addField("KvK-nummer", aanvraag.bedrijfsgegevens.kvkNummer);
  addField("Contactpersoon", aanvraag.bedrijfsgegevens.contactNaam);
  addField("E-mailadres", aanvraag.bedrijfsgegevens.contactEmail);
  addField("Type aanvrager", aanvraag.bedrijfsgegevens.typeAanvrager);
  addSpacer();

  // Projecten
  addTitle("2. Projecten");
  aanvraag.projecten.forEach((project, index) => {
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }

    addSubtitle(`Project ${index + 1}: ${project.titel}`);
    
    addField("Type S&O-werk", project.typeSOWerk === "technische-ontwikkeling" 
      ? "Technische ontwikkeling" 
      : "Technisch-wetenschappelijk onderzoek"
    );
    
    addField("Looptijd", `${format(new Date(project.looptijd.startDatum), "d MMMM yyyy", { locale: nl })} tot ${format(new Date(project.looptijd.eindDatum), "d MMMM yyyy", { locale: nl })}`);
    addField("Geschatte S&O-uren", `${project.soUren} uur`);
    
    addSubtitle("Projectbeschrijving");
    addText(`Wat ga je doen?\n${project.beschrijving.watGaJeDoen}`);
    addSpacer();
    addText(`Wat is nieuw?\n${project.beschrijving.watIsNieuw}`);
    addSpacer();
    addText(`Welke problemen los je op?\n${project.beschrijving.welkeProblemenLosJeOp}`);
    addSpacer();
    
    addSubtitle("Werkzaamheden");
    addText(project.werkzaamheden);
    addSpacer();
    addSpacer();
  });

  // Totaal S&O-uren
  if (y > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    y = 20;
  }

  addTitle("3. Totaal S&O-uren");
  const totaalUren = aanvraag.projecten.reduce((sum, project) => sum + project.soUren, 0);
  addField("Totaal aantal S&O-uren", `${totaalUren} uur`);
  addSpacer();

  // Verklaring
  addTitle("4. Verklaring");
  const today = format(new Date(), "d MMMM yyyy", { locale: nl });
  addText("Ondergetekende verklaart dat alle gegevens in deze aanvraag naar waarheid zijn ingevuld en dat alle werkzaamheden zullen worden uitgevoerd conform de voorwaarden van de WBSO-regeling.");
  addSpacer();
  addField("Datum", today);
  addSpacer();
  addField("Naam", aanvraag.bedrijfsgegevens.contactNaam);

  // Save the PDF
  doc.save(`WBSO-aanvraag-${aanvraag.bedrijfsgegevens.bedrijfsnaam.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}