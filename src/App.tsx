
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AIModelingPage from "./pages/AIModelingPage";
import KPIPage from "./pages/KPIPage";
import AlertsPage from "./pages/AlertsPage";
import AnomalyRootCausePage from "./pages/AnomalyRootCausePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
