
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Brain, Check, Info, Play, GitBranch, Factory, Zap, Settings, Code, Package } from "lucide-react";

// Mock data for training jobs with filter information and GitHub SHA
const mockTrainingJobs = [
  {
    id: "job-001",
    modelName: "Defect Detection v1.3",
    status: "completed",
    progress: 100,
    startTime: "2025-04-01T09:30:00",
    endTime: "2025-04-01T14:15:00",
    accuracy: 95.2,
    dataset: "plant-a-defects-march-2025",
    filters: {
      plant: "Plant A - North",
      line: "Line 3",
      station: "Station 7",
      program: "Program ABC-123",
      part: "Part X-123"
    },
    githubSha: "a1b2c3d4e5f6789012345678901234567890abcd"
  },
  {
    id: "job-002",
    modelName: "Quality Prediction v2.1",
    status: "in-progress",
    progress: 68,
    startTime: "2025-04-06T11:45:00",
    endTime: null,
    accuracy: null,
    dataset: "quality-metrics-q1-2025",
    filters: {
      plant: "Plant B - South",
      line: "Line 1",
      station: "Station 4",
      program: "Program XYZ-456",
      part: "Part Y-456"
    },
    githubSha: "b2c3d4e5f6789012345678901234567890abcde1"
  },
  {
    id: "job-003",
    modelName: "Anomaly Detection v1.0",
    status: "queued",
    progress: 0,
    startTime: "2025-04-08T08:00:00",
    endTime: null,
    accuracy: null,
    dataset: "anomaly-data-april-2025",
    filters: {
      plant: "Plant C - East",
      line: "Line 2",
      station: "Station 1",
      program: "Program DEF-789",
      part: "Part Z-789"
    },
    githubSha: "c3d4e5f6789012345678901234567890abcdef2"
  }
];

// Mock products data for training
const mockProducts = [
  { id: "prod-1", name: "Product A" },
  { id: "prod-2", name: "Product B" },
  { id: "prod-3", name: "Product C" },
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

  return (
    <div className="space-y-6">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {trainingJobs.map((job) => (
            <Card key={job.id}>
              <div className={`h-1 ${getStatusColor(job.status)} w-full`}></div>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex flex-col mb-2 md:mb-0">
                    <h3 className="font-medium">{job.modelName}</h3>
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

                {/* GitHub SHA */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <GitBranch className="h-4 w-4 mr-1" />
                    Model Artifacts
                  </h4>
                  <div className="flex items-center text-xs">
                    <span className="text-muted-foreground">GitHub SHA:</span>
                    <code className="ml-2 bg-gray-200 px-2 py-1 rounded font-mono text-xs">
                      {formatSha(job.githubSha)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 px-2 text-xs"
                      onClick={() => navigator.clipboard.writeText(job.githubSha)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="my-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{job.progress}%</span>
                    {job.accuracy && (
                      <span className="text-sm font-medium">Accuracy: {job.accuracy}%</span>
                    )}
                  </div>
                  <Progress value={job.progress} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{formatDate(job.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span>{formatDate(job.endTime)}</span>
                  </div>
                </div>
                
                {job.status === "completed" && (
                  <div className="mt-4">
                    <Button size="sm" className="w-full sm:w-auto">
                      <Play className="h-4 w-4 mr-1" /> Deploy Model
                    </Button>
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
