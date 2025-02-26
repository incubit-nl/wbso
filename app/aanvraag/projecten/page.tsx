"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus, Trash2, FileText, Clock, Calendar, Beaker, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWBSO } from "@/lib/context/WBSOContext";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf"; // For PDF generation
import { Project } from "@/lib/types"; // Assuming this type exists

export default function ProjectenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { aanvraag, updateProjecten } = useWBSO();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "1",
    titel: "",
    beschrijving: {
      watGaJeDoen: "",
      watIsNieuw: "",
      welkeProblemenLosJeOp: "",
    },
    werkzaamheden: "",
    soUren: 0,
    looptijd: {
      startDatum: "",
      eindDatum: "",
    },
    typeSOWerk: "technische-ontwikkeling" as "technische-ontwikkeling" | "technisch-wetenschappelijk-onderzoek",
  });

  // Load projects from context on mount
  useEffect(() => {
    if (aanvraag.projecten.length > 0) {
      setProjects(aanvraag.projecten);
    } else {
      setProjects([currentProject]); // Start with one empty project
    }
  }, [aanvraag.projecten]);

  // Handle project field changes
  const handleProjectChange = (field: keyof Project, value: any) => {
    setCurrentProject((prev) => {
      if (field === "beschrijving") {
        return { ...prev, beschrijving: { ...prev.beschrijving, ...value } };
      } else if (field === "looptijd") {
        return { ...prev, looptijd: { ...prev.looptijd, ...value } };
      }
      return { ...prev, [field]: value };
    });
  };

  // Add project to list
  const addProject = () => {
    const newProject = { ...currentProject, id: (projects.length + 1).toString() };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    updateProjecten(updatedProjects);
    setCurrentProject({
      id: (projects.length + 2).toString(),
      titel: "",
      beschrijving: {
        watGaJeDoen: "",
        watIsNieuw: "",
        welkeProblemenLosJeOp: "",
      },
      werkzaamheden: "",
      soUren: 0,
      looptijd: {
        startDatum: "",
        eindDatum: "",
      },
      typeSOWerk: "technische-ontwikkeling",
    });
    toast({ title: "Project toegevoegd", description: "Je project is opgeslagen." });
  };

  // Remove project
  const removeProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    updateProjecten(updatedProjects);
    toast({ title: "Project verwijderd", description: "Het project is uit je aanvraag gehaald." });
  };

  // Validate current project
  const validateProject = (): boolean => {
    const { titel, beschrijving, werkzaamheden, soUren, looptijd, typeSOWerk } = currentProject;
    if (!titel || !beschrijving.watGaJeDoen || !beschrijving.watIsNieuw || !beschrijving.welkeProblemenLosJeOp || !werkzaamheden || soUren <= 0 || !looptijd.startDatum || !looptijd.eindDatum || !typeSOWerk) {
      toast({ title: "Ongeldige invoer", description: "Vul alle verplichte velden correct in.", variant: "destructive" });
      return false;
    }
    const start = new Date(looptijd.startDatum);
    const end = new Date(looptijd.eindDatum);
    if (start < new Date() || end <= start || start.getFullYear() !== 2025 || end.getFullYear() !== 2025) {
      toast({ title: "Ongeldige looptijd", description: "Looptijd moet in 2025 liggen en starten na vandaag.", variant: "destructive" });
      return false;
    }
    return true;
  };

  // Save and proceed
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projects.length === 0 || !validateProject()) return;
    const updatedProjects = projects.length > 0 ? [...projects, currentProject] : [currentProject];
    updateProjecten(updatedProjects);
    toast({ title: "Projecten opgeslagen", description: "Je kunt nu verder naar het overzicht." });
    router.push("/aanvraag/overzicht");
  };

  // Save draft
  const handleSave = () => {
    const updatedProjects = projects.length > 0 && validateProject() ? [...projects, currentProject] : projects;
    updateProjecten(updatedProjects);
    toast({ title: "Voortgang opgeslagen", description: "Je projectgegevens zijn tussentijds opgeslagen." });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <Link href="/aanvraag" className="text-blue-600 hover:text-blue-700 flex items-center mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar bedrijfsgegevens
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">WBSO Aanvraag 2025</h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded bg-blue-600"></div>
              <div className="h-2 w-8 rounded bg-blue-600"></div>
              <div className="h-2 w-8 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gray-600">Fase 2: Projecten</h2>
            <Button type="button" variant="outline" onClick={handleSave} className="text-blue-600 hover:text-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Tussentijds opslaan
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Projects */}
          {projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Project: {project.titel || "Nog geen titel"}</h3>
                <Button type="button" variant="outline" onClick={() => removeProject(project.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verwijder project
                </Button>
              </div>
              <p className="text-sm text-gray-500">Uren: {project.soUren} | Looptijd: {project.looptijd.startDatum} tot {project.looptijd.eindDatum}</p>
            </Card>
          ))}

          {/* Current Project Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Nieuw Project</h3>
            <div className="space-y-6">
              {/* Projecttitel */}
              <div className="space-y-2">
                <Label htmlFor="titel" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Projecttitel
                </Label>
                <Input
                  id="titel"
                  placeholder="Bijv. Ontwikkeling slimme yoga-app"
                  value={currentProject.titel}
                  onChange={(e) => handleProjectChange("titel", e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">Geef een korte, specifieke naam (zie pagina 15).</p>
              </div>

              {/* Beschrijving */}
              <div className="space-y-4">
                <h4 className="font-medium">Projectbeschrijving</h4>
                <div className="space-y-2">
                  <Label htmlFor="watGaJeDoen">Wat ga je doen?</Label>
                  <Textarea
                    id="watGaJeDoen"
                    placeholder="Bijv. Een app maken die yoga-houdingen corrigeert"
                    value={currentProject.beschrijving.watGaJeDoen}
                    onChange={(e) => handleProjectChange("beschrijving", { watGaJeDoen: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">Beschrijf wat je ontwikkelt of onderzoekt (zie pagina 15).</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="watIsNieuw">Wat is technisch nieuw?</Label>
                  <Textarea
                    id="watIsNieuw"
                    placeholder="Bijv. Gebruik van AI voor real-time houdinganalyse"
                    value={currentProject.beschrijving.watIsNieuw}
                    onChange={(e) => handleProjectChange("beschrijving", { watIsNieuw: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">Leg uit wat innovatief is (zie pagina 15).</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welkeProblemenLosJeOp">Welke technische problemen los je op?</Label>
                  <Textarea
                    id="welkeProblemenLosJeOp"
                    placeholder="Bijv. Nauwkeurige detectie bij weinig licht"
                    value={currentProject.beschrijving.welkeProblemenLosJeOp}
                    onChange={(e) => handleProjectChange("beschrijving", { welkeProblemenLosJeOp: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">Noem je technische knelpunten (zie pagina 16).</p>
                </div>
              </div>

              {/* Werkzaamheden */}
              <div className="space-y-2">
                <Label htmlFor="werkzaamheden">Werkzaamheden</Label>
                <Textarea
                  id="werkzaamheden"
                  placeholder="Bijv. Ontwerpen van AI-model, testen van prototypes"
                  value={currentProject.werkzaamheden}
                  onChange={(e) => handleProjectChange("werkzaamheden", e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">Beschrijf S&O-activiteiten, geen marketing (zie pagina 16).</p>
              </div>

              {/* S&O-uren */}
              <div className="space-y-2">
                <Label htmlFor="soUren" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Geschatte S&O-uren
                </Label>
                <Input
                  id="soUren"
                  type="number"
                  min="1"
                  placeholder="Bijv. 200"
                  value={currentProject.soUren || ""}
                  onChange={(e) => handleProjectChange("soUren", parseInt(e.target.value) || 0)}
                  required
                />
                <p className="text-sm text-gray-500">Schatting van technisch werk in uren (zie pagina 17).</p>
              </div>

              {/* Looptijd */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDatum" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Startdatum
                  </Label>
                  <Input
                    id="startDatum"
                    type="date"
                    min="2025-01-01"
                    max="2025-12-31"
                    value={currentProject.looptijd.startDatum}
                    onChange={(e) => handleProjectChange("looptijd", { startDatum: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eindDatum">Einddatum</Label>
                  <Input
                    id="eindDatum"
                    type="date"
                    min={currentProject.looptijd.startDatum || "2025-01-01"}
                    max="2025-12-31"
                    value={currentProject.looptijd.eindDatum}
                    onChange={(e) => handleProjectChange("looptijd", { eindDatum: e.target.value })}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 col-span-2">Looptijd moet in 2025 vallen, na aanvraagdatum (zie pagina 8).</p>
              </div>

              {/* Type S&O-werk */}
              <div className="space-y-2">
                <Label htmlFor="typeSOWerk" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  Type S&O-werk
                </Label>
                <Select
                  value={currentProject.typeSOWerk}
                  onValueChange={(value) => handleProjectChange("typeSOWerk", value as "technische-ontwikkeling" | "technisch-wetenschappelijk-onderzoek")}
                >
                  <SelectTrigger id="typeSOWerk">
                    <SelectValue placeholder="Selecteer type S&O-werk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technische-ontwikkeling">Technische ontwikkeling</SelectItem>
                    <SelectItem value="technisch-wetenschappelijk-onderzoek">Technisch-wetenschappelijk onderzoek</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Ontwikkeling voor producten, TWO voor onderzoek (zie pagina 11-12).</p>
              </div>

              <Button type="button" variant="outline" onClick={addProject} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Voeg project toe
              </Button>
            </div>
          </Card>

          {/* Help Text */}
          <Card className="bg-blue-50 border-blue-100 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Tips voor je projectbeschrijving (Handleiding WBSO 2025)</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Wees specifiek: &quot;Nieuwe app&quot; is te vaag, &quot;AI-gestuurde houdingcorrectie&quot; is goed (pagina 15).</li>
              <li>• Focus op technische innovatie, niet op verkoop of design (pagina 16).</li>
              <li>• Werkzaamheden moeten S&O zijn, zoals ontwerpen of testen (pagina 16).</li>
              <li>• Uren zijn alleen voor technisch werk, schat realistisch (pagina 17).</li>
              <li>• Looptijd begint na aanvraag en ligt in 2025 (pagina 8).</li>
            </ul>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Link href="/aanvraag">
              <Button variant="outline" type="button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vorige stap
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={projects.length === 0 && !validateProject()}>
              Volgende stap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}