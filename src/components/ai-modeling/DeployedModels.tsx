
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, Factory, Zap, Code, Package, CheckCircle, TrendingUp, AlertCircle, Check, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for models by filter combination
const mockModelsByFilter = [
  {
    filters: {
      plant: "Plant A - North",
      line: "Line 3", 
      station: "Station 7",
      program: "Program ABC-123",
      part: "Part X-123"
    },
    models: [
      {
        id: "model-001-1",
        name: "Defect Detection v1.3 - CNN",
        type: "CNN",
        version: "v1.3",
        accuracy: 95.2,
        trainedDate: "2025-04-01T14:15:00",
        githubSha: "a1b2c3d4e5f6789012345678901234567890abcd",
        isDeployed: false,
        status: "trained"
      },
      {
        id: "model-001-2", 
        name: "Defect Detection v1.3 - ResNet",
        type: "ResNet",
        version: "v1.3",
        accuracy: 93.8,
        trainedDate: "2025-04-01T14:15:00",
        deployedDate: "2025-04-01T15:30:00",
        githubSha: "b1c2d3e4f5g6789012345678901234567890bcde",
        isDeployed: true,
        status: "deployed"
      },
      {
        id: "model-001-3",
        name: "Defect Detection v1.3 - EfficientNet",
        type: "EfficientNet", 
        version: "v1.3",
        accuracy: 96.1,
        trainedDate: "2025-04-01T14:15:00",
        githubSha: "c1d2e3f4g5h6789012345678901234567890cdef",
        isDeployed: false,
        status: "trained"
      },
      {
        id: "model-001-4",
        name: "Defect Detection v1.2 - ResNet",
        type: "ResNet",
        version: "v1.2",
        accuracy: 91.5,
        trainedDate: "2025-03-15T10:00:00",
        deployedDate: "2025-03-16T09:00:00",
        githubSha: "f1g2h3i4j5k6789012345678901234567890fghi",
        isDeployed: false,
        status: "retired"
      }
    ]
  },
  {
    filters: {
      plant: "Plant B - South",
      line: "Line 1",
      station: "Station 4", 
      program: "Program XYZ-456",
      part: "Part Y-456"
    },
    models: [
      {
        id: "model-002-1",
        name: "Quality Prediction v2.1 - LSTM",
        type: "LSTM",
        version: "v2.1",
        accuracy: null, // Still training
        trainedDate: "2025-04-06T11:45:00",
        githubSha: "d2e3f4g5h6i7789012345678901234567890defg",
        isDeployed: false,
        status: "training"
      },
      {
        id: "model-002-2",
        name: "Quality Prediction v2.0 - LSTM",
        type: "LSTM",
        version: "v2.0",
        accuracy: 89.2,
        trainedDate: "2025-03-20T09:00:00",
        deployedDate: "2025-03-20T10:00:00",
        githubSha: "e3f4g5h6i7j8789012345678901234567890efgh",
        isDeployed: true,
        status: "deployed"
      }
    ]
  }
];

export const DeployedModels: React.FC = () => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "In progress";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const formatSha = (sha: string) => {
    return sha.substring(0, 7);
  };

  const getModelStatusBadge = (status: string, isDeployed: boolean) => {
    if (status === "training") {
      return <Badge className="bg-blue-500"><Info className="h-3 w-3 mr-1" /> Training</Badge>;
    }
    if (isDeployed) {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Deployed</Badge>;
    }
    if (status === "trained") {
      return <Badge className="bg-amber-500"><Check className="h-3 w-3 mr-1" /> Trained</Badge>;
    }
    if (status === "retired") {
      return <Badge variant="outline" className="text-gray-500"><AlertCircle className="h-3 w-3 mr-1" /> Retired</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Model Status by Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockModelsByFilter.map((config, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                {/* Configuration Details */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Configuration
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center">
                      <Factory className="h-3 w-3 mr-1 text-blue-500" />
                      <span className="text-muted-foreground">Plant:</span>
                      <span className="ml-1 font-medium">{config.filters.plant}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-muted-foreground">Line:</span>
                      <span className="ml-1 font-medium">{config.filters.line}</span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-3 w-3 mr-1 text-orange-500" />
                      <span className="text-muted-foreground">Station:</span>
                      <span className="ml-1 font-medium">{config.filters.station}</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="h-3 w-3 mr-1 text-purple-500" />
                      <span className="text-muted-foreground">Program:</span>
                      <span className="ml-1 font-medium">{config.filters.program}</span>
                    </div>
                    <div className="flex items-center col-span-2 lg:col-span-1">
                      <Package className="h-3 w-3 mr-1 text-cyan-500" />
                      <span className="text-muted-foreground">Part:</span>
                      <span className="ml-1 font-medium">{config.filters.part}</span>
                    </div>
                  </div>
                </div>

                {/* Models Table */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    Models ({config.models.length})
                  </h4>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Model Name</TableHead>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs">Version</TableHead>
                          <TableHead className="text-xs">Accuracy</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs">Trained Date</TableHead>
                          <TableHead className="text-xs">SHA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {config.models.map((model) => (
                          <TableRow key={model.id}>
                            <TableCell className="text-xs font-medium">{model.name}</TableCell>
                            <TableCell className="text-xs">{model.type}</TableCell>
                            <TableCell className="text-xs">
                              <Badge variant="outline" className="text-xs">
                                {model.version}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {model.accuracy ? `${model.accuracy}%` : "Training..."}
                            </TableCell>
                            <TableCell className="text-xs">
                              {getModelStatusBadge(model.status, model.isDeployed)}
                            </TableCell>
                            <TableCell className="text-xs">{formatDate(model.trainedDate)}</TableCell>
                            <TableCell className="text-xs">
                              <code className="bg-gray-100 px-1 rounded font-mono text-xs">
                                {formatSha(model.githubSha)}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-blue-700">
                        {config.models.filter(m => m.isDeployed).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Deployed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-700">
                        {config.models.filter(m => m.status === "trained" && !m.isDeployed).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Ready to Deploy</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-amber-700">
                        {config.models.filter(m => m.status === "training").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Training</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">
                        {config.models.filter(m => m.accuracy).reduce((max, m) => Math.max(max, m.accuracy || 0), 0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Best Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
