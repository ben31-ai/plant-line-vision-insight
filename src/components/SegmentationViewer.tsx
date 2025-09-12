import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Upload, Eye, Zap, Layers } from "lucide-react";

interface SegmentationResult {
  class: string;
  confidence: number;
  mask: number[][]; // 2D array representing the mask
  color: string;
}

interface SegmentationData {
  image: string;
  segments: SegmentationResult[];
  processingTime: number;
  modelName: string;
  imageWidth: number;
  imageHeight: number;
}

export const SegmentationViewer = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [segmentationData, setSegmentationData] = useState<SegmentationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [segmentVisibility, setSegmentVisibility] = useState<Record<string, boolean>>({});

  // Mock segmentation data for demonstration
  const mockSegmentation: SegmentationData = {
    image: "",
    segments: [
      {
        class: "person",
        confidence: 0.95,
        mask: [], // Would contain actual mask data
        color: "rgb(255, 0, 0)"
      },
      {
        class: "background",
        confidence: 0.92,
        mask: [],
        color: "rgb(0, 255, 0)"
      },
      {
        class: "car",
        confidence: 0.87,
        mask: [],
        color: "rgb(0, 0, 255)"
      },
      {
        class: "road",
        confidence: 0.83,
        mask: [],
        color: "rgb(255, 255, 0)"
      }
    ],
    processingTime: 1420,
    modelName: "DeepLabV3-ResNet50",
    imageWidth: 640,
    imageHeight: 480
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
      setSegmentationData(null);
    }
  };

  const runSegmentation = async () => {
    if (!imageFile) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use mock data for now
    const newSegmentationData = { ...mockSegmentation, image: imagePreview };
    setSegmentationData(newSegmentationData);
    
    // Initialize segment visibility - all segments visible by default
    const initialVisibility: Record<string, boolean> = {};
    newSegmentationData.segments.forEach(segment => {
      initialVisibility[segment.class] = true;
    });
    setSegmentVisibility(initialVisibility);
    
    setIsLoading(false);
  };

  const toggleSegmentVisibility = (className: string) => {
    setSegmentVisibility(prev => ({
      ...prev,
      [className]: !prev[className]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "hsl(var(--success))";
    if (confidence >= 0.7) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
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
                Image Segmentation
              </CardTitle>
              {imageFile && (
                <Button 
                  onClick={runSegmentation} 
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Segmenting...
                    </>
                  ) : (
                    <>
                      <Layers className="mr-2 h-4 w-4" />
                      Run Segmentation
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center">
            {!imagePreview ? (
              <div className="h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer max-w-xs"
                />
                <p className="text-muted-foreground text-sm mt-2">
                  Sélectionnez une image pour commencer la segmentation
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={imagePreview}
                    alt="Input for segmentation"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg border shadow-lg"
                  />
                  
                  {/* Overlay segmentation masks if segmentation is done */}
                  {segmentationData && (
                    <div className="absolute inset-0 pointer-events-none">
                      <canvas
                        className="absolute inset-0 w-full h-full object-contain rounded-lg opacity-60"
                        style={{
                          mixBlendMode: 'multiply'
                        }}
                        ref={(canvas) => {
                          if (canvas && segmentationData) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              const img = canvas.previousElementSibling as HTMLImageElement;
                              canvas.width = img.naturalWidth;
                              canvas.height = img.naturalHeight;
                              
                              // Draw colored overlays for visible segments
                              segmentationData.segments
                                .filter(segment => segmentVisibility[segment.class])
                                .forEach((segment, index) => {
                                  // Mock overlay - in real implementation, would use actual mask data
                                  ctx.fillStyle = segment.color.replace('rgb', 'rgba').replace(')', ', 0.3)');
                                  const regionSize = 100 + index * 50;
                                  ctx.fillRect(
                                    50 + index * 100, 
                                    50 + index * 80, 
                                    regionSize, 
                                    regionSize
                                  );
                                });
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Segmentation Results - Takes 1/4 of the screen */}
      <div className="xl:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Segmentation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto space-y-4">
            {!segmentationData ? (
              <div className="text-center text-muted-foreground py-8">
                <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                Upload an image and run segmentation to see results
              </div>
            ) : (
              <>
                {/* Model Information */}
                <div className="space-y-2 text-sm pb-4 border-b">
                  <div>
                    <span className="font-medium text-foreground">Model:</span>
                    <p className="text-muted-foreground">{segmentationData.modelName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Processing Time:</span>
                    <p className="text-muted-foreground">{segmentationData.processingTime}ms</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Resolution:</span>
                    <p className="text-muted-foreground">{segmentationData.imageWidth}×{segmentationData.imageHeight}px</p>
                  </div>
                </div>

                {/* Segments List */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">
                    Segments ({segmentationData.segments.length})
                  </h4>
                  <div className="space-y-2">
                    {segmentationData.segments.map((segment, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={segmentVisibility[segment.class] || false}
                            onCheckedChange={() => toggleSegmentVisibility(segment.class)}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="font-medium capitalize text-sm text-foreground">
                            {segment.class}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {(segment.confidence * 100).toFixed(1)}%
                          </div>
                          <div 
                            className="w-2 h-2 rounded-full mx-auto mt-1"
                            style={{ backgroundColor: getConfidenceColor(segment.confidence) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segmentation Statistics */}
                <div className="grid grid-cols-1 gap-2 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: "hsl(var(--success))" }}>
                      {segmentationData.segments.filter(s => s.confidence >= 0.9).length}
                    </div>
                    <div className="text-xs text-muted-foreground">High Conf.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: "hsl(var(--warning))" }}>
                      {segmentationData.segments.filter(s => s.confidence >= 0.7 && s.confidence < 0.9).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Medium Conf.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: "hsl(var(--destructive))" }}>
                      {segmentationData.segments.filter(s => s.confidence < 0.7).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Low Conf.</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};