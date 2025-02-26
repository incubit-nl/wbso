"use client";

import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Clock, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            WBSO Aanvraag Assistent 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Vereenvoudig je WBSO-aanvraag met onze stap-voor-stap tool. Vul je gegevens in, 
            begrijp wat je invult en download een complete PDF voor je aanvraag bij RVO.
          </p>
          <Link href="/aanvraag">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Begin nu met je aanvraag
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Eenvoudig Proces</h3>
              <p className="text-gray-600">
                Stap voor stap door je WBSO-aanvraag met duidelijke uitleg en voorbeelden.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Tijdbesparend</h3>
              <p className="text-gray-600">
                Alle informatie uit de handleiding vertaald naar begrijpelijke taal.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Complete Aanvraag</h3>
              <p className="text-gray-600">
                Download een kant-en-klare PDF die voldoet aan alle RVO-eisen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Wat is WBSO?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                De WBSO (Wet Bevordering Speur- en Ontwikkelingswerk) verlaagt je kosten 
                voor onderzoek en ontwikkeling via een belastingvoordeel. Deze regeling is 
                bedoeld voor:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6">
                <li>Bedrijven die innovatieve technische producten ontwikkelen</li>
                <li>Ondernemers die technisch-wetenschappelijk onderzoek uitvoeren</li>
                <li>Startups en gevestigde bedrijven in Nederland</li>
              </ul>
              <div className="flex items-center mt-6">
                <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-gray-500">
                  Bron: Handleiding WBSO 2025, pagina 6-7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start nu met je WBSO-aanvraag en profiteer van belastingvoordeel voor je 
            innovatieve projecten.
          </p>
          <Link href="/aanvraag">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Begin je aanvraag
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}