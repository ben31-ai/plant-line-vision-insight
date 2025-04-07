
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tag, Edit3, Database, BarChart4 } from "lucide-react";

const externalTools = [
  {
    id: "tool-1",
    name: "DataLabel Pro",
    description: "Powerful image annotation and labeling platform for computer vision models.",
    category: "Data Labeling",
    icon: <Tag className="h-10 w-10 text-blue-500" />,
    url: "https://example.com/datalabel-pro",
  },
  {
    id: "tool-2",
    name: "MLFlow Dashboard",
    description: "Track experiments, compare models, and manage ML lifecycle.",
    category: "Model Tracking",
    icon: <BarChart4 className="h-10 w-10 text-purple-500" />,
    url: "https://example.com/mlflow",
  },
  {
    id: "tool-3",
    name: "TimeSeriesAnnotator",
    description: "Advanced tool for labeling time-series data and anomalies.",
    category: "Data Labeling",
    icon: <Edit3 className="h-10 w-10 text-green-500" />,
    url: "https://example.com/tsannotator",
  },
  {
    id: "tool-4",
    name: "DataCatalogue",
    description: "Browse, search and manage available datasets for training.",
    category: "Data Management",
    icon: <Database className="h-10 w-10 text-amber-500" />,
    url: "https://example.com/datacatalogue",
  },
];

export const ExternalTools: React.FC = () => {
  const handleOpenTool = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-muted-foreground mb-6">
          Access specialized external tools for data preparation, model development, and evaluation.
          These integrate with our AI platform and provide advanced capabilities for your machine learning workflow.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {externalTools.map((tool) => (
          <Card key={tool.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="mr-4">{tool.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {tool.category}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-muted-foreground mb-4 flex-1">{tool.description}</p>
              <Button 
                variant="outline" 
                className="mt-auto w-full"
                onClick={() => handleOpenTool(tool.url)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
