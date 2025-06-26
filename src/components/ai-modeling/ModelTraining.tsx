import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Brain, Check, Info, Play, GitBranch, Factory, Zap, Settings, Code, Package, BarChart3, CheckCircle, TrendingUp, Rocket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for training jobs with multiple models per job
const mockTrainingJobs = [
  {
    id: "job-001",
    jobName: "Plant A Defect Detection Training",
    status: "completed",
    progress: 100,
    startTime: "2025-04-01T09:30:00",
    endTime: "2025-04-01T14:15:00",
    dataset: "plant-a-defects-march-2025",
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
        accuracy: 95.2,
        precision: 92.1,
        recall: 94.8,
        f1Score: 93.4,
        githubSha: "a1b2c3d4e5f6789012345678901234567890abcd",
        isDeployed: false
      },
      {
        id: "model-001-2", 
        name: "Defect Detection v1.3 - ResNet",
        type: "ResNet",
        accuracy: 93.8,
        precision: 90.5,
        recall: 96.2,
        f1Score: 93.3,
        githubSha: "b1c2d3e4f5g6789012345678901234567890bcde",
        isDeployed: true
      },
      {
        id: "model-001-3",
        name: "Defect Detection v1.3 - EfficientNet",
        type: "EfficientNet", 
        accuracy: 96.1,
        precision: 94.2,
        recall: 97.8,
        f1Score: 96.0,
        githubSha: "c1d2e3f4g5h6789012345678901234567890cdef",
        isDeployed: false
      }
    ]
  },
  {
    id: "job-002",
    jobName: "Quality Prediction Training",
    status: "in-progress",
    progress: 68,
    startTime: "2025-04-06T11:45:00",
    endTime: null,
    dataset: "quality-metrics-q1-2025",
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
        accuracy: null,
        precision: null,
        recall: null,
        f1Score: null,
        githubSha: "d2e3f4g5h6i7789012345678901234567890defg",
        isDeployed: false
      }
    ]
  },
  {
    id: "job-003",
    jobName: "Anomaly Detection Training",
    status: "queued",
    progress: 0,
    startTime: "2025-04-08T08:00:00",
    endTime: null,
    dataset: "anomaly-data-april-2025",
    filters: {
      plant: "Plant C - East",
      line: "Line 2",
      station: "Station 1",
      program: "Program DEF-789",
      part: "Part Z-789"
    },
    models: []
  }
];

// Mock products data for training
const mockProducts = [
  { id: "prod-1", name: "Product A" },
  { id: "prod-2", name: "Product B" },
  { id: "prod-3", name: "Product C" },
];

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

export const ModelTraining: React.FC = () => {
  const [trainingJobs, setTrainingJobs] = useState(mockTrainingJobs);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedModelType, setSelectedModelType] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "queued":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500"><Info className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case "failed":
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case "queued":
        return <Badge className="bg-amber-500"><Info className="h-3 w-3 mr-1" /> Queued</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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

  const handleStartTraining = () => {
    // In a real app, this would call an API to start training
    alert(`Training requested for Product: ${selectedProduct}, Model Type: ${selectedModelType}`);
  };

  const handleDeployModel = (jobId: string, modelId: string, modelName: string) => {
    // Update the deployment status
    setTrainingJobs(prev => prev.map(job => 
      job.id === jobId 
        ? {
            ...job,
            models: job.models.map(model => 
              model.id === modelId 
                ? { ...model, isDeployed: true }
                : model
            )
          }
        : job
    ));
    alert(`Deploying model: ${modelName}`);
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

  const ModelMetrics = ({ model }: { model: any }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Model Performance</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-medium">{model.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Precision:</span>
              <span className="font-medium">{model.precision}%</span>
            </div>
            <div className="flex justify-between">
              <span>Recall:</span>
              <span className="font-medium">{model.recall}%</span>
            </div>
            <div className="flex justify-between">
              <span>F1-Score:</span>
              <span className="font-medium">{model.f1Score}%</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Training Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Model Type:</span>
              <span className="font-medium">{model.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Epochs:</span>
              <span className="font-medium">150</span>
            </div>
            <div className="flex justify-between">
              <span>Training Time:</span>
              <span className="font-medium">4h 45m</span>
            </div>
            <div className="flex justify-between">
              <span>Dataset Size:</span>
              <span className="font-medium">12,450 samples</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Configuration</h4>
        <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between">
            <span>Learning Rate:</span>
            <span className="font-mono">0.001</span>
          </div>
          <div className="flex justify-between">
            <span>Batch Size:</span>
            <span className="font-mono">32</span>
          </div>
          <div className="flex justify-between">
            <span>Optimizer:</span>
            <span className="font-mono">Adam</span>
          </div>
          <div className="flex justify-between">
            <span>Loss Function:</span>
            <span className="font-mono">CrossEntropy</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Model Status Overview by Configuration */}
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Train New Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Model Type</label>
              <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defect-detection">Defect Detection</SelectItem>
                  <SelectItem value="quality-prediction">Quality Prediction</SelectItem>
                  <SelectItem value="anomaly-detection">Anomaly Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full" 
                disabled={!selectedProduct || !selectedModelType}
                onClick={handleStartTraining}
              >
                <Brain className="mr-2 h-4 w-4" />
                Start Training
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Recent Training Jobs</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {trainingJobs.map((job) => (
            <Card key={job.id}>
              <div className={`h-1 ${getStatusColor(job.status)} w-full`}></div>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex flex-col mb-2 md:mb-0">
                    <h3 className="font-medium">{job.jobName}</h3>
                    <span className="text-sm text-muted-foreground">{job.dataset}</span>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
                
                {/* Filter Information */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Training Configuration
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Factory className="h-3 w-3 mr-1 text-blue-500" />
                      <span className="text-muted-foreground">Plant:</span>
                      <span className="ml-1 font-medium">{job.filters.plant}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-muted-foreground">Line:</span>
                      <span className="ml-1 font-medium">{job.filters.line}</span>
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-3 w-3 mr-1 text-orange-500" />
                      <span className="text-muted-foreground">Station:</span>
                      <span className="ml-1 font-medium">{job.filters.station}</span>
                    </div>
                    <div className="flex items-center">
                      <Code className="h-3 w-3 mr-1 text-purple-500" />
                      <span className="text-muted-foreground">Program:</span>
                      <span className="ml-1 font-medium">{job.filters.program}</span>
                    </div>
                    <div className="flex items-center col-span-1 lg:col-span-2">
                      <Package className="h-3 w-3 mr-1 text-cyan-500" />
                      <span className="text-muted-foreground">Part:</span>
                      <span className="ml-1 font-medium">{job.filters.part}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{formatDate(job.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span>{formatDate(job.endTime)}</span>
                  </div>
                </div>

                {/* Individual Models Section */}
                {job.status === "completed" && job.models.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium border-t pt-4">Generated Models</h4>
                    {job.models.map((model) => (
                      <div key={model.id} className="bg-white border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{model.name}</h5>
                            <p className="text-xs text-muted-foreground">Type: {model.type}</p>
                          </div>
                          {model.isDeployed && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Deployed
                            </Badge>
                          )}
                        </div>
                        
                        {model.accuracy && (
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Accuracy:</span>
                              <span className="font-medium">{model.accuracy}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">F1-Score:</span>
                              <span className="font-medium">{model.f1Score}%</span>
                            </div>
                          </div>
                        )}

                        {/* GitHub SHA */}
                        <div className="bg-gray-50 rounded p-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                              <GitBranch className="h-3 w-3 mr-1" />
                              <span className="text-muted-foreground">SHA:</span>
                              <code className="ml-1 bg-gray-200 px-1 rounded font-mono">
                                {formatSha(model.githubSha)}
                              </code>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-2 text-xs"
                              onClick={() => navigator.clipboard.writeText(model.githubSha)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="flex-1 text-xs">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                View Metrics
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{model.name} - Performance Metrics</DialogTitle>
                              </DialogHeader>
                              <ModelMetrics model={model} />
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            disabled={model.isDeployed}
                            onClick={() => handleDeployModel(job.id, model.id, model.name)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {model.isDeployed ? "Deployed" : "Deploy"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
