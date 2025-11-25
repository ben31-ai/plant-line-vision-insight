import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Upload, Eye, Zap } from "lucide-react";

interface DetectionResult {
  class: string;
  confidence: number;
  text: string;
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
  const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Color palette for different classes
  const getClassColor = (className: string) => {
    const colors: Record<string, { border: string; bg: string; badge: string }> = {
      person: { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)", badge: "#3b82f6" },
      car: { border: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", badge: "#ef4444" },
      bicycle: { border: "#10b981", bg: "rgba(16, 185, 129, 0.15)", badge: "#10b981" },
      dog: { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", badge: "#f59e0b" },
      cat: { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)", badge: "#8b5cf6" },
    };
    
    // Default color if class not in palette
    const defaultColor = { border: "#6b7280", bg: "rgba(107, 114, 128, 0.15)", badge: "#6b7280" };
    return colors[className] || defaultColor;
  };

  // Mock inference data for demonstration
  const mockInference: InferenceData = {
    image: "",
    detections: [
      {
        class: "text",
        confidence: 0.95,
        text: "ERR-2024-001",
        bbox: { x: 100, y: 50, width: 120, height: 30 }
      },
      {
        class: "text",
        confidence: 0.87,
        text: "SN: 12345-ABCD",
        bbox: { x: 300, y: 150, width: 150, height: 25 }
      },
      {
        class: "text",
        confidence: 0.92,
        text: "Part #: XYZ-789",
        bbox: { x: 50, y: 200, width: 130, height: 28 }
      },
      {
        class: "text",
        confidence: 0.73,
        text: "Batch: 2024-W47",
        bbox: { x: 400, y: 80, width: 140, height: 26 }
      }
    ],
    processingTime: 245,
    modelName: "OCR-TextDetection-v2"
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
    const newInferenceData = { ...mockInference, image: imagePreview };
    setInferenceData(newInferenceData);
    
    // Initialize class visibility - all classes visible by default
    const initialVisibility: Record<string, boolean> = {};
    newInferenceData.detections.forEach(detection => {
      initialVisibility[detection.class] = true;
    });
    setClassVisibility(initialVisibility);
    
    setIsLoading(false);
  };

  const toggleClassVisibility = (className: string) => {
    setClassVisibility(prev => ({
      ...prev,
      [className]: !prev[className]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
      {/* Image Upload and Display - Takes 3/4 of the screen */}
      <div className="xl:col-span-3">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Input
              </CardTitle>
              {imageFile && (
                <Button 
                  onClick={runInference} 
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Run Detection
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {!imagePreview ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer max-w-xs"
                />
                <p className="text-muted-foreground text-sm mt-2">
                  Sélectionnez une image pour commencer la détection d'objets
                </p>
              </div>
            ) : (
              <div className="relative h-full flex items-center justify-center">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={imagePreview}
                    alt="Input for detection"
                    className="max-w-full max-h-[70vh] object-contain rounded-lg border shadow-lg"
                  />
                  
                  {/* Overlay detection boxes if inference is done */}
                  {inferenceData && (
                    <div className="absolute inset-0">
                      {inferenceData.detections
                        .filter(detection => classVisibility[detection.class])
                        .map((detection, index) => {
                          const colors = getClassColor(detection.class);
                          const isHovered = hoveredIndex === index;
                          
                          return (
                            <div
                              key={index}
                              className="absolute transition-all duration-200"
                              style={{
                                left: `${(detection.bbox.x / 640) * 100}%`,
                                top: `${(detection.bbox.y / 480) * 100}%`,
                                width: `${(detection.bbox.width / 640) * 100}%`,
                                height: `${(detection.bbox.height / 480) * 100}%`,
                                border: `${isHovered ? '3' : '2'}px solid ${colors.border}`,
                                backgroundColor: colors.bg,
                                boxShadow: isHovered ? `0 0 15px ${colors.border}` : 'none',
                                zIndex: isHovered ? 10 : 1,
                              }}
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                            >
                              <div 
                                className="absolute -top-8 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                                style={{ 
                                  backgroundColor: colors.badge,
                                  border: `2px solid ${colors.border}`
                                }}
                              >
                                {index + 1}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inference Results - Takes 1/4 of the screen */}
      <div className="xl:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Detection Results
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {!inferenceData ? (
              <div className="text-center text-muted-foreground py-8 px-6">
                Upload an image and run inference to see results
              </div>
            ) : (
              <ScrollArea className="h-full px-6">
                <div className="space-y-4 pb-6">
                  {/* Model Information */}
                  <div className="grid grid-cols-1 gap-4 text-sm">
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
                      {inferenceData.detections.map((detection, index) => {
                        const colors = getClassColor(detection.class);
                        const isHovered = hoveredIndex === index;
                        
                        return (
                          <div 
                            key={index}
                            className="p-3 rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
                            style={{
                              borderColor: isHovered ? colors.border : undefined,
                              backgroundColor: isHovered ? colors.bg : undefined,
                              boxShadow: isHovered ? `0 0 8px ${colors.bg}` : undefined,
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                  style={{ backgroundColor: colors.border }}
                                >
                                  {index + 1}
                                </div>
                                <Switch 
                                  checked={classVisibility[detection.class] || false}
                                  onCheckedChange={() => toggleClassVisibility(detection.class)}
                                />
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {(detection.confidence * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="pl-9">
                              <div className="text-sm font-medium break-words">
                                {detection.text}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {detection.bbox.width}×{detection.bbox.height}px
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detection Statistics */}
                  <div className="grid grid-cols-1 gap-2 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {inferenceData.detections.filter(d => d.confidence >= 0.9).length}
                      </div>
                      <div className="text-xs text-muted-foreground">High Conf.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {inferenceData.detections.filter(d => d.confidence >= 0.7 && d.confidence < 0.9).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Medium Conf.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        {inferenceData.detections.filter(d => d.confidence < 0.7).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Low Conf.</div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};