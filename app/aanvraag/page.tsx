"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building2, User, Mail, FileCheck, Briefcase, Clock, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf"; // For PDF generation

// Define types for form data
interface CompanyData {
  bedrijfsnaam: string;
  kvkNummer: string;
  contactNaam: string;
  contactEmail: string;
  typeAanvrager: "onderneming" | "zzp" | "";
}

interface ProjectData {
  title: string;
  description: {
    what: string;
    new: string;
    challenges: string;
  };
  activities: string;
  hours: number;
  startDate: string;
  endDate: string;
  type: "development" | "research" | "";
}

interface HoursCostsData {
  totalHours: number;
  estimatedCosts?: number; // Optional for bedrijven met personeel
}

export default function AanvraagPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(1);
  const [formData, setFormData] = useState<{
    company: CompanyData;
    projects: ProjectData[];
    hoursCosts: HoursCostsData;
  }>({
    company: {
      bedrijfsnaam: "",
      kvkNummer: "",
      contactNaam: "",
      contactEmail: "",
      typeAanvrager: "",
    },
    projects: [],
    hoursCosts: { totalHours: 0, estimatedCosts: undefined },
  });
  const [currentProject, setCurrentProject] = useState<ProjectData>({
    title: "",
    description: { what: "", new: "", challenges: "" },
    activities: "",
    hours: 0,
    startDate: "",
    endDate: "",
    type: "",
  });

  // Handle input changes
  const handleInputChange = (section: keyof typeof formData, field: string, value: string | number) => {
    if (section === "company") {
      setFormData((prev) => ({
        ...prev,
        company: { ...prev.company, [field]: value },
      }));
    } else if (section === "hoursCosts") {
      setFormData((prev) => ({
        ...prev,
        hoursCosts: { ...prev.hoursCosts, [field]: value },
      }));
    } else if (section === "projects" && field in currentProject.description) {
      setCurrentProject((prev) => ({
        ...prev,
        description: { ...prev.description, [field]: value },
      }));
    } else if (section === "projects") {
      setCurrentProject((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Add project to list
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, currentProject],
    }));
    setCurrentProject({
      title: "",
      description: { what: "", new: "", challenges: "" },
      activities: "",
      hours: 0,
      startDate: "",
      endDate: "",
      type: "",
    });
  };

  // Generate PDF
  const generatePDF = () => {
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
    doc.text(`Bedrijfsnaam: ${formData.company.bedrijfsnaam}`, 20, yOffset);
    yOffset += 5;
    doc.text(`KvK-nummer: ${formData.company.kvkNummer}`, 20, yOffset);
    yOffset += 5;
    doc.text(`Contactpersoon: ${formData.company.contactNaam}`, 20, yOffset);
    yOffset += 5;
    doc.text(`E-mail: ${formData.company.contactEmail}`, 20, yOffset);
    yOffset += 5;
    doc.text(`Type aanvrager: ${formData.company.typeAanvrager === "onderneming" ? "Onderneming met personeel" : "Zzp’er"}`, 20, yOffset);
    yOffset += 15;

    // Projecten
    doc.setFontSize(12);
    doc.text("Ingediende Projecten", 20, yOffset);
    yOffset += 10;
    formData.projects.forEach((project, index) => {
      doc.setFontSize(10);
      doc.text(`Project ${index + 1}: ${project.title}`, 20, yOffset);
      yOffset += 5;
      doc.text(`Wat: ${project.description.what}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Nieuw: ${project.description.new}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Knelpunten: ${project.description.challenges}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Werkzaamheden: ${project.activities}`, 25, yOffset);
      yOffset += 5;
      doc.text(`S&O-uren: ${project.hours}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Looptijd: ${project.startDate} tot ${project.endDate}`, 25, yOffset);
      yOffset += 5;
      doc.text(`Type: ${project.type === "development" ? "Technische ontwikkeling" : "Technisch-wetenschappelijk onderzoek"}`, 25, yOffset);
      yOffset += 10;
    });

    // Uren en kosten
    doc.setFontSize(12);
    doc.text("Uren en Kosten", 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    doc.text(`Totaal S&O-uren: ${formData.hoursCosts.totalHours}`, 20, yOffset);
    yOffset += 5;
    if (formData.hoursCosts.estimatedCosts) {
      doc.text(`Geschatte kosten: €${formData.hoursCosts.estimatedCosts}`, 20, yOffset);
      yOffset += 5;
    }

    // Verklaring
    yOffset += 10;
    doc.text("Verklaring: Ik verklaar dat de ingevulde gegevens juist en volledig zijn.", 20, yOffset);
    yOffset += 5;
    doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 20, yOffset);

    doc.save("WBSO_Aanvraag_2025.pdf");
  };

  // Handle form submission and navigation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === 1) {
      setPhase(2); // Move to projects
    } else if (phase === 2) {
      addProject(); // Add current project
    } else if (phase === 3) {
      generatePDF(); // Generate PDF and finish
      router.push('/'); // Redirect to home or confirmation page
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar home
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">WBSO Aanvraag 2025</h1>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-8 rounded ${phase >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-8 rounded ${phase >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`h-2 w-8 rounded ${phase >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
          </div>
          <h2 className="text-xl text-gray-600">
            {phase === 1 ? "Fase 1: Bedrijfsgegevens" : phase === 2 ? "Fase 2: Projecten" : "Fase 3: Uren en Kosten"}
          </h2>
        </div>

        {/* Form Card */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {phase === 1 && (
              <>
                {/* Bedrijfsnaam */}
                <div className="space-y-2">
                  <Label htmlFor="bedrijfsnaam" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bedrijfsnaam
                  </Label>
                  <Input
                    id="bedrijfsnaam"
                    placeholder="Voer de naam van uw bedrijf in"
                    value={formData.company.bedrijfsnaam}
                    onChange={(e) => handleInputChange("company", "bedrijfsnaam", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Vul de officiële naam in zoals geregistreerd bij de KvK.</p>
                </div>

                {/* KvK-nummer */}
                <div className="space-y-2">
                  <Label htmlFor="kvkNummer" className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    KvK-nummer
                  </Label>
                  <Input
                    id="kvkNummer"
                    placeholder="12345678"
                    value={formData.company.kvkNummer}
                    onChange={(e) => handleInputChange("company", "kvkNummer", e.target.value)}
                    required
                    pattern="[0-9]{8}"
                    title="Vul een geldig KvK-nummer in (8 cijfers)"
                  />
                  <p className="text-sm text-gray-500">Vind uw KvK-nummer op uw KvK-uittreksel (zie pagina 13).</p>
                </div>

                {/* Contactpersoon */}
                <div className="space-y-2">
                  <Label htmlFor="contactNaam" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Naam contactpersoon
                  </Label>
                  <Input
                    id="contactNaam"
                    placeholder="Volledige naam"
                    value={formData.company.contactNaam}
                    onChange={(e) => handleInputChange("company", "contactNaam", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Degene die RVO mag contacteren over deze aanvraag.</p>
                </div>

                {/* E-mailadres */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mailadres
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="naam@bedrijf.nl"
                    value={formData.company.contactEmail}
                    onChange={(e) => handleInputChange("company", "contactEmail", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Gebruik een zakelijk e-mailadres voor officiële communicatie.</p>
                </div>

                {/* Type aanvrager */}
                <div className="space-y-2">
                  <Label htmlFor="typeAanvrager">Type aanvrager</Label>
                  <Select
                    value={formData.company.typeAanvrager}
                    onValueChange={(value) => handleInputChange("company", "typeAanvrager", value)}
                  >
                    <SelectTrigger id="typeAanvrager">
                      <SelectValue placeholder="Selecteer type aanvrager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onderneming">Onderneming met personeel</SelectItem>
                      <SelectItem value="zzp">Zzp&apos;er</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Kies uw bedrijfstype (zie pagina 9-10).</p>
                </div>
              </>
            )}

            {phase === 2 && (
              <>
                {/* Projecttitel */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Projecttitel
                  </Label>
                  <Input
                    id="title"
                    placeholder="Bijv. Ontwikkeling AI-yoga-app"
                    value={currentProject.title}
                    onChange={(e) => handleInputChange("projects", "title", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Geef een korte, specifieke titel (zie pagina 15).</p>
                </div>

                {/* Beschrijving */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Beschrijving
                  </Label>
                  <Input
                    id="what"
                    placeholder="Wat ga je doen?"
                    value={currentProject.description.what}
                    onChange={(e) => handleInputChange("projects", "what", e.target.value)}
                    required
                  />
                  <Input
                    id="new"
                    placeholder="Wat is technisch nieuw?"
                    value={currentProject.description.new}
                    onChange={(e) => handleInputChange("projects", "new", e.target.value)}
                    required
                  />
                  <Input
                    id="challenges"
                    placeholder="Welke technische problemen los je op?"
                    value={currentProject.description.challenges}
                    onChange={(e) => handleInputChange("projects", "challenges", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Leg uit wat je maakt, wat nieuw is en welke uitdagingen je hebt (zie pagina 15-16).</p>
                </div>

                {/* Werkzaamheden */}
                <div className="space-y-2">
                  <Label htmlFor="activities" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Werkzaamheden
                  </Label>
                  <Input
                    id="activities"
                    placeholder="Bijv. Prototyping, testen"
                    value={currentProject.activities}
                    onChange={(e) => handleInputChange("projects", "activities", e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Beschrijf je S&O-werk, geen marketing (zie pagina 16).</p>
                </div>

                {/* S&O-uren */}
                <div className="space-y-2">
                  <Label htmlFor="hours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Geschatte S&O-uren
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    placeholder="Bijv. 200"
                    value={currentProject.hours || ""}
                    onChange={(e) => handleInputChange("projects", "hours", parseInt(e.target.value) || 0)}
                    required
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Schatting van technisch werk in uren (zie pagina 17).</p>
                </div>

                {/* Looptijd */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Looptijd
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={currentProject.startDate}
                    onChange={(e) => handleInputChange("projects", "startDate", e.target.value)}
                    required
                    min="2025-01-01"
                  />
                  <Input
                    id="endDate"
                    type="date"
                    value={currentProject.endDate}
                    onChange={(e) => handleInputChange("projects", "endDate", e.target.value)}
                    required
                    min={currentProject.startDate || "2025-01-01"}
                  />
                  <p className="text-sm text-gray-500">Kies een periode in 2025 na aanvraagdatum (zie pagina 8).</p>
                </div>

                {/* Type S&O-werk */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type S&O-werk</Label>
                  <Select
                    value={currentProject.type}
                    onValueChange={(value) => handleInputChange("projects", "type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Technische ontwikkeling</SelectItem>
                      <SelectItem value="research">Technisch-wetenschappelijk onderzoek</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Ontwikkeling voor producten, TWO voor onderzoek (zie pagina 11-12).</p>
                </div>

                {/* Project List */}
                {formData.projects.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Ingediende Projecten</h3>
                    <ul className="list-disc list-inside">
                      {formData.projects.map((p, i) => (
                        <li key={i}>{p.title} - {p.hours} uur</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {phase === 3 && (
              <>
                {/* Totaal S&O-uren */}
                <div className="space-y-2">
                  <Label htmlFor="totalHours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Totaal S&O-uren
                  </Label>
                  <Input
                    id="totalHours"
                    type="number"
                    placeholder="Bijv. 500"
                    value={formData.hoursCosts.totalHours || ""}
                    onChange={(e) => handleInputChange("hoursCosts", "totalHours", parseInt(e.target.value) || 0)}
                    required
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Som van alle projecturen (zie pagina 19).</p>
                </div>

                {/* Geschatte kosten (alleen voor bedrijven met personeel) */}
                {formData.company.typeAanvrager === "onderneming" && (
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCosts" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Geschatte S&O-kosten
                    </Label>
                    <Input
                      id="estimatedCosts"
                      type="number"
                      placeholder="Bijv. 25000"
                      value={formData.hoursCosts.estimatedCosts || ""}
                      onChange={(e) => handleInputChange("hoursCosts", "estimatedCosts", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <p className="text-sm text-gray-500">Optioneel: schat je S&O-kosten in euro’s (zie pagina 20).</p>
                  </div>
                )}
              </>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Hulp nodig?</h3>
              <p className="text-sm text-blue-700">
                {phase === 1
                  ? "Vul je officiële bedrijfsgegevens in zoals bij de KvK geregistreerd (zie pagina 13)."
                  : phase === 2
                  ? "Voeg je S&O-projecten toe. Wees specifiek over wat je doet en welke technische problemen je oplost (zie pagina 14-18)."
                  : "Geef het totaal aantal uren en optioneel kosten. Dit meld je na goedkeuring (zie pagina 19-20)."}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {phase === 1 ? (
                <Link href="/">
                  <Button variant="outline" type="button">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Terug
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" type="button" onClick={() => setPhase(phase - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vorige
                </Button>
              )}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {phase === 2 && formData.projects.length === 0 ? "Voeg Project Toe" : phase < 3 ? "Volgende stap" : "Download PDF"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            {phase === 2 && formData.projects.length > 0 && (
              <Button type="button" onClick={() => setPhase(3)} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Naar Fase 3
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </form>
        </Card>
      </div>
    </main>
  );
}