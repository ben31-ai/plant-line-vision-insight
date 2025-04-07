
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, BrainCircuit, Bot } from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  type: string;
  status: "training" | "deployed" | "draft";
  accuracy: number;
  lastUpdated: string;
}

// Mock data for AI models
const mockModels: AIModel[] = [
  {
    id: "model-1",
    name: "Production Anomaly Detector",
    type: "Computer Vision",
    status: "deployed",
    accuracy: 94.7,
    lastUpdated: "2025-03-15",
  },
  {
    id: "model-2",
    name: "Quality Control Classifier",
    type: "Computer Vision",
    status: "training",
    accuracy: 89.2,
    lastUpdated: "2025-04-01",
  },
  {
    id: "model-3",
    name: "Maintenance Predictor",
    type: "Time Series",
    status: "deployed",
    accuracy: 91.5,
    lastUpdated: "2025-02-28",
  },
  {
    id: "model-4",
    name: "Raw Material Analyzer",
    type: "Computer Vision",
    status: "draft",
    accuracy: 76.8,
    lastUpdated: "2025-03-25",
  },
];

export const ModelsList = () => {
  const getStatusBadge = (status: AIModel["status"]) => {
    switch (status) {
      case "deployed":
        return <Badge className="bg-success text-success-foreground">Deployed</Badge>;
      case "training":
        return <Badge className="bg-warning text-warning-foreground">Training</Badge>;
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      default:
        return null;
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case "Computer Vision":
        return <BrainCircuit className="h-5 w-5 text-primary" />;
      case "Time Series":
        return <Brain className="h-5 w-5 text-tertiary" />;
      default:
        return <Bot className="h-5 w-5 text-secondary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Models</h2>
        <Button>Create New Model</Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.type)}
                      {model.name}
                    </div>
                  </TableCell>
                  <TableCell>{model.type}</TableCell>
                  <TableCell>{getStatusBadge(model.status)}</TableCell>
                  <TableCell>{model.accuracy}%</TableCell>
                  <TableCell>{model.lastUpdated}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
