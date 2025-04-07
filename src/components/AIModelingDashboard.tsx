
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DeployedModels } from "./ai-modeling/DeployedModels";
import { ModelTraining } from "./ai-modeling/ModelTraining";
import { ExternalTools } from "./ai-modeling/ExternalTools";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const AIModelingDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("deployed");
  
  return (
    <div className="container py-6 mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
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
  );
};
