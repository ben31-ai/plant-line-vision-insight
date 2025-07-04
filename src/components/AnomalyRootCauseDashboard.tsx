
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Footer } from "./Footer";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, AlertTriangle, Search } from "lucide-react";
import { ClusteringAnalysis } from "./anomaly/ClusteringAnalysis";
import { RootCausePanel } from "./anomaly/RootCausePanel";
import { RegionSelector } from "./anomaly/RegionSelector";

export const AnomalyRootCauseDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Anomaly Root Cause Analysis
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold">Anomaly Root Cause Analysis</h1>
          </div>
        </div>

        {/* Region Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analysis Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegionSelector 
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
            />
          </CardContent>
        </Card>

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Clustering Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>3D Clustering Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ClusteringAnalysis 
                  region={selectedRegion}
                />
              </CardContent>
            </Card>
          </div>

          {/* Root Cause Panel */}
          <div className="lg:col-span-1">
            <RootCausePanel 
              region={selectedRegion}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
