
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Maximize, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  images: string[];
  title?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ images, title = "Product Images" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  if (images.length === 0) {
    return (
      <Card className="bg-card shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p>No images available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card className="bg-card shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentImageIndex + 1} / {images.length}
          </div>
        </CardHeader>
        <CardContent className="relative p-2 flex justify-center">
          <div className="relative w-full" style={{ height: '300px' }}>
            <img
              src={images[currentImageIndex]}
              alt={`Product image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Image navigation controls */}
            <div className="absolute inset-0 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/70"
                onClick={handlePrevious}
                disabled={images.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/70"
                onClick={handleNext}
                disabled={images.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/50 hover:bg-background/70"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen overlay */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div className="relative w-full max-w-[90%] h-[90vh] flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`Product image ${currentImageIndex + 1} fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 rounded-full bg-background/50 hover:bg-background/70"
              onClick={toggleFullscreen}
            >
              Close
            </Button>

            {/* Fullscreen navigation controls */}
            <div className="absolute inset-0 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/70"
                onClick={(e) => { 
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={images.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/70"
                onClick={(e) => { 
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={images.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
