"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Database,
  Eye,
  Filter,
  Globe,
  Search,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "./components/Navigation";

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "183 Current Members",
      description:
        "Complete, up-to-date information about all Austrian National Council members",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Instantly find members by name, party, electoral district, or state",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description:
        "Filter by political party with real-time statistics and breakdowns",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description:
        "Interactive party distribution charts and demographic insights",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: Database,
      title: "Official Data",
      description:
        "Powered by Austrian Parliament's Open Data API for accuracy",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Data refreshes automatically to stay current with changes",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  const stats = [
    { label: "Parliament Members", value: "183", icon: Users },
    { label: "Political Parties", value: "6+", icon: Building2 },
    { label: "Electoral Districts", value: "39", icon: Globe },
    { label: "Federal States", value: "9", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="flex items-center space-x-2 px-4 py-2 text-sm mb-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
              >
                <Sparkles className="w-4 h-4" />
                <span>Powered by Official Open Data</span>
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Austrian Parliament
              <br />
              <span className="text-4xl md:text-5xl">
                Demographics Dashboard
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore, analyze, and understand the composition of Austria's
              National Council with real-time data, interactive visualizations,
              and comprehensive member profiles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              asChild
              size="lg"
              className="min-w-[200px] text-lg px-8 py-6"
            >
              <Link href="/dashboard">
                <Eye className="w-5 h-5 mr-2" />
                Explore Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] text-lg px-8 py-6"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="space-y-12 mb-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Powerful Features for Political Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the tools and capabilities that make this dashboard your
              go-to resource for Austrian parliamentary data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm group"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 py-16 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 rounded-3xl text-white">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Explore?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Dive into the data and discover insights about Austria's
              parliamentary democracy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="min-w-[200px] text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200"
            >
              <Link href="/dashboard">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[200px] text-lg px-8 py-6 border-white text-white hover:bg-white/10 dark:border-gray-300 dark:hover:bg-white/20"
            >
              <Link href="/about">
                <Database className="w-5 h-5 mr-2" />
                Learn About Data
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
