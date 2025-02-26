"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, FileText, Building2, User, Mail, Clock, Calculator } from "lucide-react";
import Link from "next/link";
import { useWBSO } from "@/lib/context/WBSOContext";
import { generateWBSOPDF } from "@/lib/pdf";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default function OverzichtPage() {
  const { aanvraag } = useWBSO();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      generateWBSOPDF(aanvraag);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsGeneratingPDF(false);
  };

  const totaalUren = aanvraag.projecten.reduce((sum, project) => sum + project.soUren, 0);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <Link href="/aanvraag/projecten" className="text-blue-600 hover:text-blue-700 flex items-center mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar projecten
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">WBSO Aanvraag 2025</h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded bg-blue-600"></div>
              <div className="h-2 w-8 rounded bg-blue-600"></div>
              <div className="h-2 w-8 rounded bg-blue-600"></div>
            </div>
          </div>
          <h2 className="text-xl text-gray-600">Fase 3: Overzicht en Indienen</h2>
        </div>

        {/* Bedrijfsgegevens */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Bedrijfsgegevens
            </h3>
            <Link href="/aanvraag">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Bewerken
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bedrijfsnaam</p>
              <p className="font-medium">{aanvraag.bedrijfsgegevens.bedrijfsnaam}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">KvK-nummer</p>
              <p className="font-medium">{aanvraag.bedrijfsgegevens.kvkNummer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contactpersoon</p>
              <p className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {aanvraag.bedrijfsgegevens.contactNaam}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">E-mailadres</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {aanvraag.bedrijfsgegevens.contactEmail}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type aanvrager</p>
              <p className="font-medium">{aanvraag.bedrijfsgegevens.typeAanvrager}</p>
            </div>
          </div>
        </Card>

        {/* Projecten */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projecten
            </h3>
            <Link href="/aanvraag/projecten">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Bewerken
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {aanvraag.projecten.map((project, index) => (
              <div key={project.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <h4 className="font-semibold mb-4">Project {index + 1}: {project.titel}</h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Type S&O-werk</p>
                    <p className="font-medium">{
                      project.typeSOWerk === "technische-ontwikkeling" 
                        ? "Technische ontwikkeling" 
                        : "Technisch-wetenschappelijk onderzoek"
                    }</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Geschatte S&O-uren</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      {project.soUren} uur
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Looptijd</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(project.looptijd.startDatum), "d MMMM yyyy", { locale: nl })} tot{" "}
                      {format(new Date(project.looptijd.eindDatum), "d MMMM yyyy", { locale: nl })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Wat ga je doen?</p>
                    <p className="bg-gray-50 p-3 rounded">{project.beschrijving.watGaJeDoen}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Wat is nieuw?</p>
                    <p className="bg-gray-50 p-3 rounded">{project.beschrijving.watIsNieuw}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Welke problemen los je op?</p>
                    <p className="bg-gray-50 p-3 rounded">{project.beschrijving.welkeProblemenLosJeOp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Werkzaamheden</p>
                    <p className="bg-gray-50 p-3 rounded">{project.werkzaamheden}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Totaal aantal S&O-uren</p>
              <p className="font-semibold">{totaalUren} uur</p>
            </div>
          </div>
        </Card>

        {/* Download PDF */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-100">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-2">Klaar om in te dienen?</h3>
            <p className="text-gray-600 mb-4">
              Download je complete WBSO-aanvraag als PDF. Controleer alle gegevens nog een keer voordat je de aanvraag indient bij RVO.
            </p>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "PDF wordt gegenereerd..." : "Download WBSO-aanvraag als PDF"}
            </Button>
          </div>
        </Card>

        {/* Help Text */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">Volgende stappen</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>1. Download de PDF en controleer alle gegevens</li>
            <li>2. Dien je aanvraag in via het eLoket van RVO</li>
            <li>3. Je ontvangt binnen 3 maanden bericht over je aanvraag</li>
            <li>4. Na goedkeuring kun je beginnen met je project</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}