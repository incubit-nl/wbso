"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Plus, Trash2, FileText, Clock, Calculator, Beaker, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { useWBSO } from "@/lib/context/WBSOContext";
import { useToast } from "@/hooks/use-toast";

export default function ProjectenPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { aanvraag, updateProjecten } = useWBSO();
  const [projects, setProjects] = useState<Project[]>([{
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
    typeSOWerk: "technische-ontwikkeling",
  }]);

  // Load projects from context on mount
  useEffect(() => {
    if (aanvraag.projecten.length > 0) {
      setProjects(aanvraag.projecten);
    }
  }, [aanvraag.projecten]);

  const handleProjectChange = (index: number, field: string, value: any) => {
    const updatedProjects = projects.map((project, i) => {
      if (i === index) {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          return {
            ...project,
            [parent]: {
              ...project[parent as keyof Project],
              [child]: value,
            },
          };
        }
        return { ...project, [field]: value };
      }
      return project;
    });
    setProjects(updatedProjects);
    updateProjecten(updatedProjects);
  };

  const addProject = () => {
    const newProjects = [...projects, {
      id: (projects.length + 1).toString(),
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
    }];
    setProjects(newProjects);
    updateProjecten(newProjects);
  };

  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    updateProjecten(updatedProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjecten(projects);
    toast({
      title: "Projecten opgeslagen",
      description: "Je projectgegevens zijn opgeslagen. Je kunt nu door naar de volgende stap.",
    });
    router.push("/aanvraag/overzicht");
  };

  const handleSave = () => {
    updateProjecten(projects);
    toast({
      title: "Voortgang opgeslagen",
      description: "Je projectgegevens zijn tussentijds opgeslagen.",
    });
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
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              className="text-blue-600 hover:text-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Tussentijds opslaan
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {projects.map((project, index) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                {projects.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Verwijder project
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Projecttitel */}
                <div className="space-y-2">
                  <Label htmlFor={`titel-${index}`} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Projecttitel
                  </Label>
                  <Input
                    id={`titel-${index}`}
                    placeholder="Bijv: Ontwikkeling van een slimme yoga-app"
                    value={project.titel}
                    onChange={(e) => handleProjectChange(index, "titel", e.target.value)}
                    required
                  />
                </div>

                {/* Beschrijving */}
                <div className="space-y-4">
                  <h4 className="font-medium">Projectbeschrijving</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`watGaJeDoen-${index}`}>Wat ga je doen?</Label>
                    <Textarea
                      id={`watGaJeDoen-${index}`}
                      placeholder="Bijv: Een app maken die yoga-houdingen corrigeert"
                      value={project.beschrijving.watGaJeDoen}
                      onChange={(e) => handleProjectChange(index, "beschrijving.watGaJeDoen", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`watIsNieuw-${index}`}>Wat is nieuw?</Label>
                    <Textarea
                      id={`watIsNieuw-${index}`}
                      placeholder="Bijv: Gebruik van AI voor real-time houdinganalyse"
                      value={project.beschrijving.watIsNieuw}
                      onChange={(e) => handleProjectChange(index, "beschrijving.watIsNieuw", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`welkeProblemenLosJeOp-${index}`}>Welke problemen los je op?</Label>
                    <Textarea
                      id={`welkeProblemenLosJeOp-${index}`}
                      placeholder="Bijv: Nauwkeurige detectie bij weinig licht"
                      value={project.beschrijving.welkeProblemenLosJeOp}
                      onChange={(e) => handleProjectChange(index, "beschrijving.welkeProblemenLosJeOp", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Werkzaamheden */}
                <div className="space-y-2">
                  <Label htmlFor={`werkzaamheden-${index}`}>Werkzaamheden</Label>
                  <Textarea
                    id={`werkzaamheden-${index}`}
                    placeholder="Bijv: Ontwerpen van AI-model, testen van prototypes"
                    value={project.werkzaamheden}
                    onChange={(e) => handleProjectChange(index, "werkzaamheden", e.target.value)}
                    required
                  />
                </div>

                {/* S&O-uren */}
                <div className="space-y-2">
                  <Label htmlFor={`soUren-${index}`} className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Geschatte S&O-uren
                  </Label>
                  <Input
                    id={`soUren-${index}`}
                    type="number"
                    min="0"
                    placeholder="Bijv: 200"
                    value={project.soUren || ""}
                    onChange={(e) => handleProjectChange(index, "soUren", parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Looptijd */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDatum-${index}`} className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Startdatum
                    </Label>
                    <Input
                      id={`startDatum-${index}`}
                      type="date"
                      min="2025-01-01"
                      max="2025-12-31"
                      value={project.looptijd.startDatum}
                      onChange={(e) => handleProjectChange(index, "looptijd.startDatum", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`eindDatum-${index}`}>Einddatum</Label>
                    <Input
                      id={`eindDatum-${index}`}
                      type="date"
                      min="2025-01-01"
                      max="2025-12-31"
                      value={project.looptijd.eindDatum}
                      onChange={(e) => handleProjectChange(index, "looptijd.eindDatum", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Type S&O-werk */}
                <div className="space-y-2">
                  <Label htmlFor={`typeSOWerk-${index}`} className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Type S&O-werk
                  </Label>
                  <Select
                    value={project.typeSOWerk}
                    onValueChange={(value) => handleProjectChange(index, "typeSOWerk", value)}
                  >
                    <SelectTrigger id={`typeSOWerk-${index}`}>
                      <SelectValue placeholder="Selecteer type S&O-werk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technische-ontwikkeling">Technische ontwikkeling</SelectItem>
                      <SelectItem value="technisch-wetenschappelijk-onderzoek">Technisch-wetenschappelijk onderzoek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Project Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addProject}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Voeg nog een project toe
          </Button>

          {/* Help Text */}
          <Card className="bg-blue-50 border-blue-100 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Tips voor je projectbeschrijving</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Beschrijf duidelijk wat er technisch nieuw is aan je project</li>
              <li>• Focus op de technische uitdagingen, niet op commerciële aspecten</li>
              <li>• Wees specifiek over de werkzaamheden die je gaat uitvoeren</li>
              <li>• Schat je uren realistisch in, alleen technische uren tellen mee</li>
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Volgende stap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}