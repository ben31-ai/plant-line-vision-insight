import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SegmentationViewer } from "@/components/SegmentationViewer";

const SegmentationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Image Segmentation Analysis</h1>
        </div>
        <SegmentationViewer />
      </div>
      <Footer />
    </div>
  );
};

export default SegmentationPage;