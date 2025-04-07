
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelsList } from "@/components/ai/ModelsList";
import { AnnotationWorkspace } from "@/components/ai/AnnotationWorkspace";
import { ModelPerformance } from "@/components/ai/ModelPerformance";

const AIModeling = () => {
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Model Training & Annotation</h1>
      
      <Tabs defaultValue="annotate" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="annotate">Annotate</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="annotate" className="mt-4">
          <AnnotationWorkspace />
        </TabsContent>
        
        <TabsContent value="models" className="mt-4">
          <ModelsList />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <ModelPerformance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModeling;
