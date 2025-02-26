// lib/types.ts

// Type for company data (Fase 1: Bedrijfsgegevens)
export interface CompanyData {
  bedrijfsnaam: string;
  kvkNummer: string;
  contactNaam: string;
  contactEmail: string;
  typeAanvrager: "onderneming" | "zzp" | ""; // Matches options in aanvraag/page.tsx
}

// Type for project description subfields (Fase 2: Projecten)
export interface ProjectDescription {
  watGaJeDoen: string; // Wat ga je doen?
  watIsNieuw: string;  // Wat is technisch nieuw?
  welkeProblemenLosJeOp: string; // Welke technische problemen los je op?
}

// Type for project duration (looptijd)
export interface ProjectDuration {
  startDatum: string; // ISO date string (e.g., "2025-03-01")
  eindDatum: string;  // ISO date string (e.g., "2025-06-30")
}

// Type for a single project (Fase 2: Projecten)
export interface Project {
  id: string; // Unique identifier for each project
  titel: string;
  beschrijving: ProjectDescription;
  werkzaamheden: string;
  soUren: number; // S&O-uren
  looptijd: ProjectDuration;
  typeSOWerk: "technische-ontwikkeling" | "technisch-wetenschappelijk-onderzoek";
}

// Type for hours and costs data (Fase 3: Uren en Kosten)
export interface HoursCostsData {
  totalHours: number; // Total S&O-uren across all projects
  estimatedCosts?: number; // Optional, only for bedrijven met personeel
}

// Combined type for the entire WBSO application
export interface WBSOApplication {
  company: CompanyData;
  projecten: Project[];
  hoursCosts: HoursCostsData;
}

export interface WBSOAanvraag {
  bedrijfsgegevens: CompanyData;
  projecten: Project[];
  urenKosten: HoursCostsData;
}