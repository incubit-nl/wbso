"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WBSOAanvraag, CompanyData, Project, HoursCostsData } from "@/lib/types";

// Define context type
interface WBSOContextType {
  aanvraag: WBSOAanvraag;
  updateBedrijfsgegevens: (data: CompanyData) => void;
  updateProjecten: (projecten: Project[]) => void;
  updateUrenKosten: (urenKosten: HoursCostsData) => void;
  resetAanvraag: () => void;
}

// Default aanvraag data
const defaultAanvraag: WBSOAanvraag = {
  bedrijfsgegevens: {
    bedrijfsnaam: "",
    kvkNummer: "",
    contactNaam: "",
    contactEmail: "",
    typeAanvrager: "" as "onderneming" | "zzp" | "",
  },
  projecten: [],
  urenKosten: {
    totalHours: 0,
    estimatedCosts: undefined, // Optional for companies with personnel
  },
};

// Create context
const WBSOContext = createContext<WBSOContextType | undefined>(undefined);

export function WBSOProvider({ children }: { children: React.ReactNode }) {
  const [aanvraag, setAanvraag] = useState<WBSOAanvraag>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("wbsoAanvraag2025");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          return { ...defaultAanvraag, ...parsedData }; // Merge with defaults to ensure structure
        } catch (error) {
          console.error("Error parsing saved WBSO data:", error);
          return defaultAanvraag;
        }
      }
    }
    return defaultAanvraag;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("wbsoAanvraag2025", JSON.stringify(aanvraag));
  }, [aanvraag]);

  // Update bedrijfsgegevens
  const updateBedrijfsgegevens = (data: CompanyData) => {
    setAanvraag((prev) => ({
      ...prev,
      bedrijfsgegevens: { ...prev.bedrijfsgegevens, ...data },
    }));
  };

  // Update projecten
  const updateProjecten = (projecten: Project[]) => {
    setAanvraag((prev) => ({
      ...prev,
      projecten: projecten.map((p) => ({ ...p })), // Deep copy to ensure immutability
    }));
  };

  // Update uren en kosten
  const updateUrenKosten = (urenKosten: HoursCostsData) => {
    setAanvraag((prev) => ({
      ...prev,
      urenKosten: { ...prev.urenKosten, ...urenKosten },
    }));
  };

  // Reset aanvraag with confirmation
  const resetAanvraag = () => {
    if (typeof window !== "undefined" && window.confirm("Weet je zeker dat je de aanvraag wilt resetten? Alle ingevoerde gegevens worden verwijderd.")) {
      setAanvraag(defaultAanvraag);
      localStorage.removeItem("wbsoAanvraag2025");
    }
  };

  return (
    <WBSOContext.Provider
      value={{
        aanvraag,
        updateBedrijfsgegevens,
        updateProjecten,
        updateUrenKosten,
        resetAanvraag,
      }}
    >
      {children}
    </WBSOContext.Provider>
  );
}

export function useWBSO() {
  const context = useContext(WBSOContext);
  if (context === undefined) {
    throw new Error("useWBSO must be used within a WBSOProvider");
  }
  return context;
}