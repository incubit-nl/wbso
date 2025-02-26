export interface CompanyData {
  bedrijfsnaam: string;
  kvkNummer: string;
  contactNaam: string;
  contactEmail: string;
  typeAanvrager: string;
}

export interface Project {
  id: string;
  titel: string;
  beschrijving: {
    watGaJeDoen: string;
    watIsNieuw: string;
    welkeProblemenLosJeOp: string;
  };
  werkzaamheden: string;
  soUren: number;
  looptijd: {
    startDatum: string;
    eindDatum: string;
  };
  typeSOWerk: "technische-ontwikkeling" | "technisch-wetenschappelijk-onderzoek";
}

export interface WBSOAanvraag {
  bedrijfsgegevens: CompanyData;
  projecten: Project[];
}