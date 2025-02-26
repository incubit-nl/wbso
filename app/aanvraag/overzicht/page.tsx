"use client";

import { Key, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, FileText, Building2, User, Mail, Clock, Calculator } from "lucide-react";
import Link from "next/link";
import { useWBSO } from "@/lib/context/WBSOContext";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf"; // For PDF generation
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export default function OverzichtPage() {
  const { aanvraag } = useWBSO();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Calculate total S&O hours
  const totaalUren = aanvraag.projecten.reduce((sum: any, project: { soUren: any; }) => sum + (project.soUren || 0), 0);

  // Generate PDF
  const generateWBSOPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yOffset = 20;

    // Header
    doc.setFontSize(16);
    doc.text("WBSO Aanvraag 2025", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 10;

    // Bedrijfsgegevens
    doc.setFontSize(12);
    doc.text("Bedrijfsgegevens", 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.text(`Bedrijfsnaam: ${aanvraag.bedrijfsgegevens.bedrijfsnaam || "Niet ingevuld"}`, 20, yOffset);
    yOffset += 5;
    doc.text(`KvK-nummer: ${aanvraag.bedrijfsgegevens.kvkNummer || "Niet ingevuld"}`, 20, yOffset);
    yOffset += 5;
    doc.text(`Contactpersoon: ${aanvraag.bedrijfsgegevens.contactNaam || "Niet ingevuld"}`, 20, yOffset);
    yOffset += 5;
    doc.text(`E-mail: ${aanvraag.bedrijfsgegevens.contactEmail || "Niet ingevuld"}`, 20, yOffset);
    yOffset += 5;
    doc.text(`Type aanvrager: ${aanvraag.bedrijfsgegevens.typeAanvrager === "onderneming" ? "Onderneming met personeel" : aanvraag.bedrijfsgegevens.typeAanvrager === "zzp" ? "Zzp’er" : "Niet ingevuld"}`, 20, yOffset);
    yOffset += 15;

    // Projecten
    doc.setFontSize(12);
    doc.text("Ingediende Projecten", 20, yOffset);
    yOffset += 10;
    aanvraag.projecten.forEach((project: { titel: any; beschrijving: { watGaJeDoen: any; watIsNieuw: any; welkeProblemenLosJeOp: any; }; werkzaamheden: any; soUren: any; looptijd: { startDatum: any; eindDatum: any; }; typeSOWerk: string; }, index: number) => {
      doc.setFontSize(10);
      doc.text(`Project ${index + 1}: ${project.titel || "Geen titel"}`, 20, yOffset);
      yOffset += 5;
      doc.text(`Wat ga je doen?: ${project.beschrijving.watGaJeDoen || "Niet ingevuld"}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Wat is technisch nieuw?: ${project.beschrijving.watIsNieuw || "Niet ingevuld"}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Technische knelpunten: ${project.beschrijving.welkeProblemenLosJeOp || "Niet ingevuld"}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Werkzaamheden: ${project.werkzaamheden || "Niet ingevuld"}`, 25, yOffset);
      yOffset += 5;
      doc.text(`S&O-uren: ${project.soUren || 0}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Looptijd: ${project.looptijd.startDatum || "Niet ingevuld"} tot ${project.looptijd.eindDatum || "Niet ingevuld"}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Type S&O-werk: ${project.typeSOWerk === "technische-ontwikkeling" ? "Technische ontwikkeling" : "Technisch-wetenschappelijk onderzoek"}`, 25, yOffset);
      yOffset += 10;
      if (yOffset > 250) { // Add new page if needed
        doc.addPage();
        yOffset = 20;
      }
    });

    // Totaal S&O-uren
    doc.setFontSize(12);
    doc.text("Totaal S&O-uren", 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.text(`Totaal aantal S&O-uren: ${totaalUren}`, 20, yOffset);
    yOffset += 15;

    // Verklaring en Datum
    doc.setFontSize(12);
    doc.text("Verklaring", 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.text("Ik verklaar dat de ingevulde gegevens juist en volledig zijn.", 20, yOffset);
    yOffset += 5;
    doc.text(`Datum: ${format(new Date(), "d MMMM yyyy", { locale: nl })}`, 20, yOffset);

    doc.save("WBSO_Aanvraag_2025.pdf");
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (!aanvraag.bedrijfsgegevens.bedrijfsnaam || aanvraag.projecten.length === 0) {
        toast({
          title: "Onvolledige aanvraag",
          description: "Vul bedrijfsgegevens en minimaal één project in.",
          variant: "destructive",
        });
        return;
      }
      generateWBSOPDF();
      toast({
        title: "PDF gegenereerd",
        description: "Je WBSO-aanvraag is succesvol gedownload.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Fout bij PDF-generatie",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
              <p className="font-medium">{aanvraag.bedrijfsgegevens.bedrijfsnaam || "Niet ingevuld"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">KvK-nummer</p>
              <p className="font-medium">{aanvraag.bedrijfsgegevens.kvkNummer || "Niet ingevuld"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contactpersoon</p>
              <p className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {aanvraag.bedrijfsgegevens.contactNaam || "Niet ingevuld"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">E-mailadres</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {aanvraag.bedrijfsgegevens.contactEmail || "Niet ingevuld"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type aanvrager</p>
              <p className="font-medium">{aanvraag.bedrijfsgegevens.typeAanvrager === "onderneming" ? "Onderneming met personeel" : aanvraag.bedrijfsgegevens.typeAanvrager === "zzp" ? "Zzp’er" : "Niet ingevuld"}</p>
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
            {aanvraag.projecten.length === 0 ? (
              <p className="text-gray-500">Geen projecten ingediend. Voeg minimaal één project toe.</p>
            ) : (
              aanvraag.projecten.map((project: { id: Key | null | undefined; titel: any; typeSOWerk: string; soUren: any; looptijd: { startDatum: string | number | Date; eindDatum: string | number | Date; }; beschrijving: { watGaJeDoen: any; watIsNieuw: any; welkeProblemenLosJeOp: any; }; werkzaamheden: any; }, index: number) => (
                <div key={project.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <h4 className="font-semibold mb-4">Project {index + 1}: {project.titel || "Geen titel"}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Type S&O-werk</p>
                      <p className="font-medium">
                        {project.typeSOWerk === "technische-ontwikkeling" ? "Technische ontwikkeling" : "Technisch-wetenschappelijk onderzoek"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Geschatte S&O-uren</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        {project.soUren || 0} uur
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Looptijd</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {project.looptijd.startDatum && project.looptijd.eindDatum
                          ? `${format(new Date(project.looptijd.startDatum), "d MMMM yyyy", { locale: nl })} tot ${format(new Date(project.looptijd.eindDatum), "d MMMM yyyy", { locale: nl })}`
                          : "Niet ingevuld"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Wat ga je doen?</p>
                      <p className="bg-gray-50 p-3 rounded">{project.beschrijving.watGaJeDoen || "Niet ingevuld"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Wat is technisch nieuw?</p>
                      <p className="bg-gray-50 p-3 rounded">{project.beschrijving.watIsNieuw || "Niet ingevuld"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Welke technische problemen los je op?</p>
                      <p className="bg-gray-50 p-3 rounded">{project.beschrijving.welkeProblemenLosJeOp || "Niet ingevuld"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Werkzaamheden</p>
                      <p className="bg-gray-50 p-3 rounded">{project.werkzaamheden || "Niet ingevuld"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {aanvraag.projecten.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Totaal aantal S&O-uren</p>
                <p className="font-semibold">{totaalUren} uur</p>
              </div>
            </div>
          )}
        </Card>

        {/* Submission Instructions */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-100">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-2">Klaar om in te dienen?</h3>
            <p className="text-gray-600 mb-4">
              Download je WBSO-aanvraag als PDF. Controleer alle gegevens en dien deze in via het eLoket van RVO vóór de deadline (31 december 2024 voor Q1 2025 bedrijven, 30 november 2024 voor zzp’ers hele jaar, zie pagina 8).
            </p>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || !aanvraag.bedrijfsgegevens.bedrijfsnaam || aanvraag.projecten.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "PDF wordt gegenereerd..." : "Download WBSO-aanvraag als PDF"}
            </Button>
          </div>
        </Card>

        {/* Help Text */}
        <Card className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">Volgende stappen (Handleiding WBSO 2025)</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>1. Controleer je PDF op volledigheid (pagina 19).</li>
            <li>2. Dien in via het eLoket van RVO (https://mijn.rvo.nl) met eHerkenning niveau eH3 (pagina 13).</li>
            <li>3. Binnen 3 maanden ontvang je een beschikking (pagina 20).</li>
            <li>4. Na goedkeuring: meld je gerealiseerde uren binnen 1 maand na de periode (pagina 19-20).</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">Hulp nodig? Zie pagina 23-25 voor FAQ of neem contact op met RVO.</p>
        </Card>
      </div>
    </main>
  );
}