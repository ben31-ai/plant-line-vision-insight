import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ObjectDetectionViewer } from "@/components/ObjectDetectionViewer";

const ObjectDetectionPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Object Detection Analysis</h1>
        </div>
        <ObjectDetectionViewer />
      </div>
      <Footer />
    </div>
  );
};

export default ObjectDetectionPage;