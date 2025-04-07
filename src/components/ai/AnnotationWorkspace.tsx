
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export const AnnotationWorkspace = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>("https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80");
  const [annotationType, setAnnotationType] = useState("bounding-box");
  const [confidence, setConfidence] = useState([80]);

  const imageUrls = [
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80",
    "https://images.unsplash.com/photo-1576670157203-3d0312e1d9de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Annotation Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Select value={annotationType} onValueChange={setAnnotationType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Annotation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bounding-box">Bounding Box</SelectItem>
                  <SelectItem value="segmentation">Segmentation</SelectItem>
                  <SelectItem value="keypoint">Keypoint</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">Clear</Button>
              <Button>Save Annotation</Button>
            </div>
            
            <div className="border border-input rounded-md overflow-hidden h-[500px] relative">
              {selectedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={selectedImage} 
                    alt="Annotation workspace" 
                    className="w-full h-full object-contain"
                  />
                  {/* Canvas for annotation would be overlaid here in a production app */}
                  <div className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    {/* Example annotation overlay */}
                    <div className="absolute border-2 border-primary" style={{ 
                      top: '25%', 
                      left: '20%', 
                      width: '30%', 
                      height: '20%',
                      borderRadius: '2px' 
                    }}></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Please select an image to annotate</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {imageUrls.map((url, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 border rounded-md cursor-pointer overflow-hidden ${selectedImage === url ? 'border-primary border-2' : 'border-input'}`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img 
                    src={url} 
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-20 h-20 border border-dashed border-input rounded-md flex items-center justify-center cursor-pointer">
                <span className="text-lg">+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Annotation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Detection Class</h3>
            <Select defaultValue="defect">
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defect">Defect</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="component">Component</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Confidence ({confidence}%)</h3>
            <Slider 
              value={confidence} 
              onValueChange={setConfidence} 
              max={100} 
              step={1} 
              className="my-4"
            />
          </div>
          
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Notes</h3>
            <Textarea placeholder="Add any additional notes about this annotation" className="h-24" />
          </div>
          
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Dimensions</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">X: 243px</p>
                <p className="text-xs text-muted-foreground">Y: 158px</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">W: 320px</p>
                <p className="text-xs text-muted-foreground">H: 180px</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
