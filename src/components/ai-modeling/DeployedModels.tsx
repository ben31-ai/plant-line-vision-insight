
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, Factory, Zap, Code, Package, CheckCircle, TrendingUp, AlertCircle, Check, Info, Copy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock data for pipelines by configuration
const mockPipelinesByConfig = [
  {
    filters: {
      plant: "Plant A - North",
      line: "Line 3", 
      station: "Station 7",
      program: "Program ABC-123",
      part: "Part X-123"
    },
    pipelines: [
      {
        id: "pipeline-001",
        name: "Quality Control Pipeline v2.0",
        isActive: true,
        steps: [
          {
            id: "step-001-1",
            name: "Defect Detection",
            order: 1,
            deployedModel: {
              id: "model-001-2",
              name: "Defect Detection CNN",
              type: "CNN",
              version: "v1.3",
              accuracy: 95.2,
              trainedDate: "2025-04-01T14:15:00",
              deployedDate: "2025-04-01T15:30:00",
              githubSha: "a1b2c3d4e5f6789012345678901234567890abcd"
            },
            availableVersions: [
              {
                id: "model-001-3",
                name: "Defect Detection ResNet",
                type: "ResNet",
                version: "v1.4",
                accuracy: 96.1,
                trainedDate: "2025-04-05T10:00:00",
                githubSha: "b1c2d3e4f5g6789012345678901234567890bcde",
                status: "trained"
              },
              {
                id: "model-001-1",
                name: "Defect Detection CNN",
                type: "CNN",
                version: "v1.2",
                accuracy: 93.8,
                trainedDate: "2025-03-15T09:00:00",
                githubSha: "c1d2e3f4g5h6789012345678901234567890cdef",
                status: "retired"
              }
            ]
          },
          {
            id: "step-001-2",
            name: "Classification",
            order: 2,
            deployedModel: {
              id: "model-002-1",
              name: "Multi-Class Classifier",
              type: "EfficientNet",
              version: "v2.1",
              accuracy: 92.5,
              trainedDate: "2025-04-02T11:00:00",
              deployedDate: "2025-04-02T14:00:00",
              githubSha: "d1e2f3g4h5i6789012345678901234567890defg"
            },
            availableVersions: [
              {
                id: "model-002-2",
                name: "Multi-Class Classifier",
                type: "EfficientNet",
                version: "v2.2",
                accuracy: 93.1,
                trainedDate: "2025-04-06T09:00:00",
                githubSha: "e1f2g3h4i5j6789012345678901234567890efgh",
                status: "trained"
              },
              {
                id: "model-002-3",
                name: "Multi-Class Classifier",
                type: "ResNet",
                version: "v2.0",
                accuracy: 91.2,
                trainedDate: "2025-03-20T10:00:00",
                githubSha: "f1g2h3i4j5k6789012345678901234567890fghi",
                status: "retired"
              }
            ]
          },
          {
            id: "step-001-3",
            name: "Quality Prediction",
            order: 3,
            deployedModel: {
              id: "model-003-1",
              name: "Quality Score Predictor",
              type: "LSTM",
              version: "v1.0",
              accuracy: 88.7,
              trainedDate: "2025-03-28T13:00:00",
              deployedDate: "2025-03-29T10:00:00",
              githubSha: "g1h2i3j4k5l6789012345678901234567890ghij"
            },
            availableVersions: [
              {
                id: "model-003-2",
                name: "Quality Score Predictor",
                type: "LSTM",
                version: "v1.1",
                accuracy: null,
                trainedDate: "2025-04-07T14:00:00",
                githubSha: "h1i2j3k4l5m6789012345678901234567890hijk",
                status: "training"
              }
            ]
          }
        ]
      },
      {
        id: "pipeline-002",
        name: "Legacy Pipeline v1.5",
        isActive: false,
        steps: [
          {
            id: "step-002-1",
            name: "Basic Detection",
            order: 1,
            deployedModel: {
              id: "model-004-1",
              name: "Basic Defect Detector",
              type: "CNN",
              version: "v1.0",
              accuracy: 87.3,
              trainedDate: "2025-02-15T10:00:00",
              deployedDate: "2025-02-16T09:00:00",
              githubSha: "i1j2k3l4m5n6789012345678901234567890ijkl"
            },
            availableVersions: []
          }
        ]
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
    pipelines: [
      {
        id: "pipeline-003",
        name: "Inspection Pipeline v3.0",
        isActive: true,
        steps: [
          {
            id: "step-003-1",
            name: "Surface Analysis",
            order: 1,
            deployedModel: {
              id: "model-005-1",
              name: "Surface Defect Analyzer",
              type: "ResNet",
              version: "v2.0",
              accuracy: 94.8,
              trainedDate: "2025-04-03T12:00:00",
              deployedDate: "2025-04-04T08:00:00",
              githubSha: "j1k2l3m4n5o6789012345678901234567890jklm"
            },
            availableVersions: [
              {
                id: "model-005-2",
                name: "Surface Defect Analyzer",
                type: "ResNet",
                version: "v2.1",
                accuracy: 95.4,
                trainedDate: "2025-04-06T15:00:00",
                githubSha: "k1l2m3n4o5p6789012345678901234567890klmn",
                status: "trained"
              }
            ]
          },
          {
            id: "step-003-2",
            name: "Dimension Check",
            order: 2,
            deployedModel: {
              id: "model-006-1",
              name: "Dimension Validator",
              type: "CNN",
              version: "v1.5",
              accuracy: 97.2,
              trainedDate: "2025-04-01T09:00:00",
              deployedDate: "2025-04-02T11:00:00",
              githubSha: "l1m2n3o4p5q6789012345678901234567890lmno"
            },
            availableVersions: []
          }
        ]
      }
    ]
  }
];

export const DeployedModels: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
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

  const getModelStatusBadge = (status: string) => {
    if (status === "training") {
      return <Badge className="bg-blue-500"><Info className="h-3 w-3 mr-1" /> Training</Badge>;
    }
    if (status === "trained") {
      return <Badge className="bg-amber-500"><Check className="h-3 w-3 mr-1" /> Ready</Badge>;
    }
    if (status === "retired") {
      return <Badge variant="outline" className="text-gray-500"><AlertCircle className="h-3 w-3 mr-1" /> Retired</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const handleDeployVersion = (step: any, version: any) => {
    setSelectedStep(step);
    setSelectedVersion(version);
    setIsDeployDialogOpen(true);
  };

  const handleConfirmDeploy = () => {
    if (selectedStep && selectedVersion) {
      toast.success(`Model "${selectedVersion.name}" (${selectedVersion.version}) will be deployed to step "${selectedStep.name}"`);
      setIsDeployDialogOpen(false);
      setSelectedStep(null);
      setSelectedVersion(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Pipelines by Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockPipelinesByConfig.map((config, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                {/* Configuration Details */}
                <div className="bg-muted rounded-lg p-3">
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

                {/* Pipelines */}
                {config.pipelines.map((pipeline) => (
                  <div key={pipeline.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        {pipeline.name}
                        {pipeline.isActive && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        )}
                      </h4>
                    </div>

                    {/* Pipeline Steps */}
                    <div className="space-y-3">
                      {pipeline.steps.map((step) => (
                        <div key={step.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Step {step.order}
                              </Badge>
                              <span className="text-sm font-medium">{step.name}</span>
                            </div>
                          </div>

                          {/* Deployed Model */}
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="text-xs font-medium text-green-700 mb-1 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Currently Deployed
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Model:</span>
                                <span className="ml-1 font-medium">{step.deployedModel.name}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-1 font-medium">{step.deployedModel.type}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Version:</span>
                                <Badge variant="outline" className="ml-1 text-xs">
                                  {step.deployedModel.version}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Accuracy:</span>
                                <span className="ml-1 font-medium">{step.deployedModel.accuracy}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Deployed:</span>
                                <span className="ml-1 font-medium">{formatDate(step.deployedModel.deployedDate)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">SHA:</span>
                                <code className="ml-1 bg-gray-100 px-1 rounded font-mono text-xs">
                                  {formatSha(step.deployedModel.githubSha)}
                                </code>
                              </div>
                            </div>
                          </div>

                          {/* Available Versions */}
                          {step.availableVersions.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">
                                Available Versions ({step.availableVersions.length})
                              </div>
                              <div className="space-y-2">
                                {step.availableVersions.map((version) => (
                                  <div
                                    key={version.id}
                                    className="bg-muted rounded p-2 flex items-center justify-between"
                                  >
                                    <div className="grid grid-cols-3 gap-2 text-xs flex-1">
                                      <div>
                                        <span className="text-muted-foreground">Model:</span>
                                        <span className="ml-1 font-medium">{version.name}</span>
                                      </div>
                                      <div>
                                        <Badge variant="outline" className="text-xs">
                                          {version.version}
                                        </Badge>
                                        <span className="ml-2">{getModelStatusBadge(version.status)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Accuracy:</span>
                                        <span className="ml-1 font-medium">
                                          {version.accuracy ? `${version.accuracy}%` : "Training..."}
                                        </span>
                                      </div>
                                    </div>
                                    {version.status === "trained" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeployVersion(step, version)}
                                        className="h-7 text-xs ml-2"
                                      >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Deploy
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deploy Model Dialog */}
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deploy Model Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Target Step</Label>
              <div className="mt-1 p-2 bg-muted rounded text-sm">
                {selectedStep?.name}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Selected Model Version</Label>
              <div className="mt-1 p-3 bg-muted rounded space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium">{selectedVersion?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {selectedVersion?.version}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium">{selectedVersion?.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="ml-2 font-medium">{selectedVersion?.accuracy}%</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-900">Deployment Warning</div>
                  <div className="text-amber-700 mt-1">
                    This will replace the currently deployed model for this step. Make sure you have tested this version before deploying to production.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeployDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDeploy}
              >
                Deploy Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
