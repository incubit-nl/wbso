"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WBSOAanvraag, CompanyData, Project } from "@/lib/types";

interface WBSOContextType {
  aanvraag: WBSOAanvraag;
  updateBedrijfsgegevens: (data: CompanyData) => void;
  updateProjecten: (projecten: Project[]) => void;
  resetAanvraag: () => void;
}

const defaultAanvraag: WBSOAanvraag = {
  bedrijfsgegevens: {
    bedrijfsnaam: "",
    kvkNummer: "",
    contactNaam: "",
    contactEmail: "",
    typeAanvrager: "",
  },
  projecten: [],
};

const WBSOContext = createContext<WBSOContextType | undefined>(undefined);

export function WBSOProvider({ children }: { children: React.ReactNode }) {
  const [aanvraag, setAanvraag] = useState<WBSOAanvraag>(defaultAanvraag);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("wbsoAanvraag");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAanvraag(parsedData);
      } catch (error) {
        console.error("Error loading saved WBSO data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("wbsoAanvraag", JSON.stringify(aanvraag));
  }, [aanvraag]);

  const updateBedrijfsgegevens = (data: CompanyData) => {
    setAanvraag((prev) => ({
      ...prev,
      bedrijfsgegevens: data,
    }));
  };

  const updateProjecten = (projecten: Project[]) => {
    setAanvraag((prev) => ({
      ...prev,
      projecten,
    }));
  };

  const resetAanvraag = () => {
    setAanvraag(defaultAanvraag);
    localStorage.removeItem("wbsoAanvraag");
  };

  return (
    <WBSOContext.Provider
      value={{
        aanvraag,
        updateBedrijfsgegevens,
        updateProjecten,
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