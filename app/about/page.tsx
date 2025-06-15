"use client";

import { Sidebar } from "@/app/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  Database,
  ExternalLink,
  Info,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                  >
                    AT
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Austrian Parliament
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
                Demographics Dashboard
              </h2>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore current members of the Austrian National Council with
              detailed demographics, party affiliations, and interactive
              filtering capabilities.
            </p>
          </div>

          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="flex items-center space-x-2 px-4 py-2 border-gray-200 dark:border-gray-700"
            >
              <Info className="w-3 h-3" />
              <span>Data sourced from Austrian Parliament Open Data API</span>
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-gray-100">
                  Real-time Data
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access current information about all 183 members of the Austrian
                National Council, including their party affiliations and
                electoral districts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-gray-100">
                  Open Data API
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built using the official Austrian Parliament Open Data API,
                ensuring accurate and up-to-date information directly from the
                source.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-900 dark:text-gray-100">
                  Privacy Focused
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All data displayed is publicly available information. No
                personal tracking or data collection is performed on this
                dashboard.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mb-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Frontend Technologies
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 14 with App Router</li>
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Shadcn/ui component library</li>
                  <li>• Zustand for state management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time search and filtering</li>
                  <li>• Responsive design</li>
                  <li>• Debug mode for developers</li>
                  <li>• Component-based architecture</li>
                  <li>• Accessible UI components</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card className="mb-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Data Source & Attribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This dashboard uses data from the Austrian Parliament's Open Data
              initiative, which provides free access to parliamentary
              information in machine-readable formats.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://www.parlament.gv.at/recherchieren/open-data/",
                    "_blank"
                  )
                }
                className="border-gray-200 dark:border-gray-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Austrian Parliament Open Data
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open("https://www.data.gv.at/", "_blank")}
                className="border-gray-200 dark:border-gray-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Data.gv.at Portal
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-muted-foreground">
                <strong>Data License:</strong> The data is provided under the
                Creative Commons Attribution 4.0 International License (CC BY
                4.0). This allows for free use, sharing, and adaptation with
                proper attribution.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
