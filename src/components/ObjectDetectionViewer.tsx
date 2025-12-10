import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Upload, Eye, Zap, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface DetectionResult {
  class: string;
  confidence: number;
  textConfidence: number;
  text: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface AnomalyResult {
  id: string;
  name: string;
  score: number;
  polygon: { x: number; y: number }[]; // Array of polygon points
}

interface InferenceData {
  image: string;
  detections: DetectionResult[];
  anomalies: AnomalyResult[];
  processingTime: number;
  modelName: string;
}

export const ObjectDetectionViewer = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [inferenceData, setInferenceData] = useState<InferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});
  const [anomalyVisibility, setAnomalyVisibility] = useState<Record<string, boolean>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredAnomalyId, setHoveredAnomalyId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

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
        textConfidence: 0.92,
        text: "ERR-2024-001",
        bbox: { x: 100, y: 50, width: 120, height: 30 }
      },
      {
        class: "text",
        confidence: 0.87,
        textConfidence: 0.84,
        text: "SN: 12345-ABCD",
        bbox: { x: 300, y: 150, width: 150, height: 25 }
      },
      {
        class: "text",
        confidence: 0.92,
        textConfidence: 0.89,
        text: "Part #: XYZ-789",
        bbox: { x: 50, y: 200, width: 130, height: 28 }
      },
      {
        class: "text",
        confidence: 0.73,
        textConfidence: 0.68,
        text: "Batch: 2024-W47",
        bbox: { x: 400, y: 80, width: 140, height: 26 }
      }
    ],
    anomalies: [
      {
        id: "anomaly-1",
        name: "Surface Scratch",
        score: 0.89,
        polygon: [
          { x: 200, y: 250 },
          { x: 280, y: 240 },
          { x: 310, y: 290 },
          { x: 290, y: 340 },
          { x: 220, y: 330 },
          { x: 190, y: 280 }
        ]
      },
      {
        id: "anomaly-2",
        name: "Color Defect",
        score: 0.72,
        polygon: [
          { x: 450, y: 300 },
          { x: 520, y: 290 },
          { x: 570, y: 320 },
          { x: 560, y: 370 },
          { x: 490, y: 380 },
          { x: 440, y: 350 }
        ]
      },
      {
        id: "anomaly-3",
        name: "Missing Component",
        score: 0.95,
        polygon: [
          { x: 80, y: 350 },
          { x: 140, y: 340 },
          { x: 170, y: 380 },
          { x: 160, y: 420 },
          { x: 100, y: 430 },
          { x: 70, y: 390 }
        ]
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
    
    // Initialize anomaly visibility - all anomalies visible by default
    const initialAnomalyVisibility: Record<string, boolean> = {};
    newInferenceData.anomalies.forEach(anomaly => {
      initialAnomalyVisibility[anomaly.id] = true;
    });
    setAnomalyVisibility(initialAnomalyVisibility);
    
    setIsLoading(false);
  };

  const toggleClassVisibility = (className: string) => {
    setClassVisibility(prev => ({
      ...prev,
      [className]: !prev[className]
    }));
  };

  const toggleAnomalyVisibility = (anomalyId: string) => {
    setAnomalyVisibility(prev => ({
      ...prev,
      [anomalyId]: !prev[anomalyId]
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
              <div className="relative h-full flex flex-col">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 4}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Image Container */}
                <div 
                  ref={containerRef}
                  className="relative flex-1 overflow-hidden rounded-lg border cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  <div 
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                    style={{
                      transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Input for detection"
                        className="max-w-full max-h-[65vh] object-contain shadow-lg"
                        draggable={false}
                      />
                      
                      {/* Overlay detection boxes if inference is done */}
                      {inferenceData && (
                        <div className="absolute inset-0">
                          {/* Anomaly regions - red brushed polygonal areas */}
                          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                            <defs>
                              <pattern id="anomaly-pattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                <rect width="4" height="8" fill="rgba(239, 68, 68, 0.3)" />
                              </pattern>
                            </defs>
                            {inferenceData.anomalies
                              .filter(anomaly => anomalyVisibility[anomaly.id])
                              .map((anomaly) => {
                                const isHovered = hoveredAnomalyId === anomaly.id;
                                const points = anomaly.polygon
                                  .map(p => `${(p.x / 640) * 100}%,${(p.y / 480) * 100}%`)
                                  .join(' ');
                                
                                // Calculate centroid for potential label placement
                                const svgPoints = anomaly.polygon
                                  .map(p => `${(p.x / 640) * 100},${(p.y / 480) * 100}`)
                                  .join(' ');
                                
                                return (
                                  <g key={anomaly.id}>
                                    <polygon
                                      points={svgPoints}
                                      fill={isHovered ? 'rgba(239, 68, 68, 0.5)' : 'url(#anomaly-pattern)'}
                                      stroke="#ef4444"
                                      strokeWidth={isHovered ? 3 : 2}
                                      style={{
                                        cursor: 'pointer',
                                        filter: isHovered ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))' : 'none',
                                        transition: 'all 0.2s',
                                      }}
                                      onMouseEnter={() => setHoveredAnomalyId(anomaly.id)}
                                      onMouseLeave={() => setHoveredAnomalyId(null)}
                                    />
                                    {/* Overlay with solid color for hover effect */}
                                    {isHovered && (
                                      <polygon
                                        points={svgPoints}
                                        fill="rgba(239, 68, 68, 0.35)"
                                        stroke="none"
                                        style={{ pointerEvents: 'none' }}
                                      />
                                    )}
                                  </g>
                                );
                              })}
                          </svg>
                          
                          {/* Detection boxes */}
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
                              <div className="text-right space-y-0.5">
                                <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                  <span className={`w-2 h-2 rounded-full ${detection.confidence >= 0.9 ? 'bg-green-500' : detection.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                  Box: {(detection.confidence * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                  <span className={`w-2 h-2 rounded-full ${detection.textConfidence >= 0.9 ? 'bg-green-500' : detection.textConfidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                  Text: {(detection.textConfidence * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="pl-9 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs capitalize"
                                  style={{ borderColor: colors.border }}
                                >
                                  {detection.class}
                                </Badge>
                              </div>
                              <div className="text-sm font-medium break-words">
                                {detection.text}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {detection.bbox.width}×{detection.bbox.height}px
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Anomalies List */}
                  {inferenceData.anomalies.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">
                        Detected Anomalies ({inferenceData.anomalies.length})
                      </h4>
                      <div className="space-y-2">
                        {inferenceData.anomalies.map((anomaly) => {
                          const isHovered = hoveredAnomalyId === anomaly.id;
                          
                          return (
                            <div 
                              key={anomaly.id}
                              className="p-3 rounded-lg border transition-all duration-200 cursor-pointer space-y-2"
                              style={{
                                borderColor: isHovered ? '#ef4444' : undefined,
                                backgroundColor: isHovered ? 'rgba(239, 68, 68, 0.1)' : undefined,
                                boxShadow: isHovered ? '0 0 8px rgba(239, 68, 68, 0.3)' : undefined,
                              }}
                              onMouseEnter={() => setHoveredAnomalyId(anomaly.id)}
                              onMouseLeave={() => setHoveredAnomalyId(null)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 bg-red-500/20 border border-red-500">
                                    <span className="text-red-500 text-xs">!</span>
                                  </div>
                                  <Switch 
                                    checked={anomalyVisibility[anomaly.id] || false}
                                    onCheckedChange={() => toggleAnomalyVisibility(anomaly.id)}
                                  />
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                    <span className={`w-2 h-2 rounded-full ${anomaly.score >= 0.9 ? 'bg-red-600' : anomaly.score >= 0.7 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                                    Score: {(anomaly.score * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <div className="pl-9 space-y-1">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs text-red-600 border-red-400"
                                >
                                  {anomaly.name}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {anomaly.polygon.length} points
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-primary">
                        {(inferenceData.detections.reduce((sum, d) => sum + d.confidence, 0) / inferenceData.detections.length * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Box Score</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl font-bold text-primary">
                        {(inferenceData.detections.filter(d => d.textConfidence).reduce((sum, d) => sum + d.textConfidence, 0) / inferenceData.detections.filter(d => d.textConfidence).length * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Text Score</div>
                    </div>
                  </div>

                  {/* Detection Statistics */}
                  <div className="pt-4 border-t space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Box Confidence</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {inferenceData.detections.filter(d => d.confidence >= 0.9).length}
                          </div>
                          <div className="text-xs text-muted-foreground">High</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {inferenceData.detections.filter(d => d.confidence >= 0.7 && d.confidence < 0.9).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            {inferenceData.detections.filter(d => d.confidence < 0.7).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Low</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Text Confidence</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {inferenceData.detections.filter(d => d.textConfidence >= 0.9).length}
                          </div>
                          <div className="text-xs text-muted-foreground">High</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {inferenceData.detections.filter(d => d.textConfidence >= 0.7 && d.textConfidence < 0.9).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            {inferenceData.detections.filter(d => d.textConfidence && d.textConfidence < 0.7).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Low</div>
                        </div>
                      </div>
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