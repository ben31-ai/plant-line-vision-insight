import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DeployedModels } from "./ai-modeling/DeployedModels";
import { ModelTraining } from "./ai-modeling/ModelTraining";
import { ExternalTools } from "./ai-modeling/ExternalTools";
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
import { Home, Brain } from "lucide-react";

export const AIModelingDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("deployed");
  
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
                    <Brain className="h-4 w-4" />
                    AI Modeling Platform
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold">AI Modeling Platform</h1>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Model Management & Training</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="deployed" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="deployed">Deployed Models</TabsTrigger>
                <TabsTrigger value="training">Model Training</TabsTrigger>
                <TabsTrigger value="tools">External Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deployed">
                <DeployedModels />
              </TabsContent>
              
              <TabsContent value="training">
                <ModelTraining />
              </TabsContent>
              
              <TabsContent value="tools">
                <ExternalTools />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};
