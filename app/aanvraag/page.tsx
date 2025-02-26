"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building2, User, Mail, FileCheck } from "lucide-react";
import Link from "next/link";

export default function AanvraagPage() {
  const [formData, setFormData] = useState({
    bedrijfsnaam: "",
    kvkNummer: "",
    contactNaam: "",
    contactEmail: "",
    typeAanvrager: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement navigation to next phase
    console.log("Form submitted:", formData);
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
              <div className="h-2 w-8 rounded bg-blue-600"></div>
              <div className="h-2 w-8 rounded bg-gray-200"></div>
              <div className="h-2 w-8 rounded bg-gray-200"></div>
            </div>
          </div>
          <h2 className="text-xl text-gray-600">Fase 1: Bedrijfsgegevens</h2>
        </div>

        {/* Form Card */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bedrijfsnaam */}
            <div className="space-y-2">
              <Label htmlFor="bedrijfsnaam" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Bedrijfsnaam
              </Label>
              <Input
                id="bedrijfsnaam"
                placeholder="Voer de naam van uw bedrijf in"
                value={formData.bedrijfsnaam}
                onChange={(e) => handleInputChange("bedrijfsnaam", e.target.value)}
                required
              />
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
                value={formData.kvkNummer}
                onChange={(e) => handleInputChange("kvkNummer", e.target.value)}
                required
                pattern="[0-9]{8}"
                title="Vul een geldig KvK-nummer in (8 cijfers)"
              />
              <p className="text-sm text-gray-500">
                U vindt uw KvK-nummer op uw uittreksel van de Kamer van Koophandel
              </p>
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
                value={formData.contactNaam}
                onChange={(e) => handleInputChange("contactNaam", e.target.value)}
                required
              />
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
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                required
              />
            </div>

            {/* Type aanvrager */}
            <div className="space-y-2">
              <Label htmlFor="typeAanvrager">Type aanvrager</Label>
              <Select
                value={formData.typeAanvrager}
                onValueChange={(value) => handleInputChange("typeAanvrager", value)}
              >
                <SelectTrigger id="typeAanvrager">
                  <SelectValue placeholder="Selecteer type aanvrager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onderneming">Onderneming met personeel</SelectItem>
                  <SelectItem value="zzp">Zzp'er</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Hulp nodig?</h3>
              <p className="text-sm text-blue-700">
                Deze gegevens zijn nodig om uw aanvraag te registreren bij RVO. 
                Zorg dat alle informatie exact overeenkomt met uw KvK-registratie.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Link href="/">
                <Button variant="outline" type="button">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug
                </Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Volgende stap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}