
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Download, Settings } from "lucide-react";

// Mock data for deployed models
const mockDeployedModels = [
  {
    id: "model-001",
    name: "Defect Detection v1.2",
    type: "Computer Vision",
    status: "active",
    accuracy: 94.7,
    lastUpdated: "2025-03-29T10:30:00",
    deploymentDate: "2025-02-15T08:00:00",
    inferenceTime: 45, // ms
  },
  {
    id: "model-002",
    name: "Quality Prediction v2.0",
    type: "Time Series",
    status: "active",
    accuracy: 91.2,
    lastUpdated: "2025-04-01T14:15:00",
    deploymentDate: "2025-03-10T11:30:00",
    inferenceTime: 32, // ms
  },
  {
    id: "model-003",
    name: "Failure Prediction Beta",
    type: "Anomaly Detection",
    status: "testing",
    accuracy: 89.5,
    lastUpdated: "2025-04-05T09:45:00",
    deploymentDate: "2025-04-04T16:00:00",
    inferenceTime: 28, // ms
  }
];

export const DeployedModels: React.FC = () => {
  const [deployedModels, setDeployedModels] = useState(mockDeployedModels);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "testing":
        return "bg-amber-500";
      case "inactive":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Current Deployed Models</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Deploy New Model
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deployedModels.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <div className={`h-1 ${getStatusColor(model.status)} w-full`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{model.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{model.type}</p>
                </div>
                <Badge variant={model.status === "active" ? "default" : "outline"}>
                  {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{model.accuracy}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Inference
                  </span>
                  <span className="font-medium">{model.inferenceTime} ms</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deployed</span>
                  <span className="text-sm">{formatDate(model.deploymentDate)}</span>
                </div>
                
                <div className="pt-3 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" /> 
                    Metrics
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" /> 
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
