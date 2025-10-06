
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AIModelingPage from "./pages/AIModelingPage";
import KPIPage from "./pages/KPIPage";
import AlertsPage from "./pages/AlertsPage";
import AnomalyRootCausePage from "./pages/AnomalyRootCausePage";
import ObjectDetectionPage from "./pages/ObjectDetectionPage";
import SegmentationPage from "./pages/SegmentationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/ai-modeling" element={<AIModelingPage />} />
          <Route path="/kpi-dashboard" element={<KPIPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/anomaly-root-cause" element={<AnomalyRootCausePage />} />
          <Route path="/object-detection" element={<ObjectDetectionPage />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
