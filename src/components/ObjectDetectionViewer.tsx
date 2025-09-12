import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Upload, Eye, Zap } from "lucide-react";

interface DetectionResult {
  class: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface InferenceData {
  image: string;
  detections: DetectionResult[];
  processingTime: number;
  modelName: string;
}

export const ObjectDetectionViewer = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [inferenceData, setInferenceData] = useState<InferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Mock inference data for demonstration
  const mockInference: InferenceData = {
    image: "",
    detections: [
      {
        class: "person",
        confidence: 0.95,
        bbox: { x: 100, y: 50, width: 120, height: 200 }
      },
      {
        class: "car",
        confidence: 0.87,
        bbox: { x: 300, y: 150, width: 180, height: 100 }
      },
      {
        class: "bicycle",
        confidence: 0.73,
        bbox: { x: 50, y: 200, width: 80, height: 120 }
      }
    ],
    processingTime: 245,
    modelName: "YOLOv8-nano"
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
      setInferenceData(null);
    }
  };

  const runInference = async () => {
    if (!imageFile) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use mock data for now
    setInferenceData({ ...mockInference, image: imagePreview });
    setIsLoading(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Image Upload and Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Image Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-bounding-boxes" 
              checked={showBoundingBoxes} 
              onCheckedChange={setShowBoundingBoxes}
            />
            <Label htmlFor="show-bounding-boxes">Show Bounding Boxes</Label>
          </div>
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Input for detection"
                className="w-full h-auto rounded-lg border"
              />
              
              {/* Overlay detection boxes if inference is done */}
              {inferenceData && showBoundingBoxes && (
                <div className="absolute inset-0">
                  {inferenceData.detections.map((detection, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-primary bg-primary/10"
                      style={{
                        left: `${(detection.bbox.x / 640) * 100}%`,
                        top: `${(detection.bbox.y / 480) * 100}%`,
                        width: `${(detection.bbox.width / 640) * 100}%`,
                        height: `${(detection.bbox.height / 480) * 100}%`,
                      }}
                    >
                      <Badge 
                        className="absolute -top-6 left-0 text-xs"
                        style={{ backgroundColor: `hsl(var(--primary))` }}
                      >
                        {detection.class} ({(detection.confidence * 100).toFixed(1)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {imageFile && (
            <Button 
              onClick={runInference} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Run Object Detection
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Inference Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!inferenceData ? (
            <div className="text-center text-muted-foreground py-8">
              Upload an image and run inference to see results
            </div>
          ) : (
            <div className="space-y-4">
              {/* Model Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Model:</span>
                  <p className="text-muted-foreground">{inferenceData.modelName}</p>
                </div>
                <div>
                  <span className="font-medium">Processing Time:</span>
                  <p className="text-muted-foreground">{inferenceData.processingTime}ms</p>
                </div>
              </div>

              {/* Detections List */}
              <div>
                <h4 className="font-medium mb-3">
                  Detected Objects ({inferenceData.detections.length})
                </h4>
                <div className="space-y-2">
                  {inferenceData.detections.map((detection, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-3 h-3 rounded-full ${getConfidenceColor(detection.confidence)}`}
                        />
                        <span className="font-medium capitalize">
                          {detection.class}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {(detection.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {detection.bbox.width}×{detection.bbox.height}px
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {inferenceData.detections.filter(d => d.confidence >= 0.9).length}
                  </div>
                  <div className="text-xs text-muted-foreground">High Conf.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {inferenceData.detections.filter(d => d.confidence >= 0.7 && d.confidence < 0.9).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Medium Conf.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {inferenceData.detections.filter(d => d.confidence < 0.7).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Low Conf.</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};