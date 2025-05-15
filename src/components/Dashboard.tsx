
import React, { useState, useEffect } from "react";
import { FilterPanel, FilterState } from "./FilterPanel";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { MetricsOverview } from "./MetricsOverview";
import { ProductsList } from "./ProductsList";
import { ProductDetail } from "./ProductDetail";
import { MLInsights } from "./MLInsights";
import { getFilteredProducts, getMetrics, productDetails } from "@/utils/mockData";
import { subDays } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Brain, BarChart, Bell } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AlertBanner, AlertData } from "./AlertBanner";
import { useToast } from "@/hooks/use-toast";
import { setGlobalAlert, checkProductsForAlerts } from "@/utils/alertUtils";

export const Dashboard = () => {
  // Default to the last 7 days
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  const [filters, setFilters] = useState<FilterState>({
    plantId: null,
    lineId: null,
    stationId: null,
    programId: null,
    partId: null,
    controllerStatus: null,
    aiStatus: null,
    serialNumber: null,
  });
  
  const [products, setProducts] = useState(getFilteredProducts(startDate, endDate));
  const [metrics, setMetrics] = useState(getMetrics(products));
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const { toast } = useToast();
  
  // Update products and metrics when filters or date range change
  useEffect(() => {
    const filteredProducts = getFilteredProducts(
      startDate,
      endDate,
      filters.plantId || undefined,
      filters.lineId || undefined,
      filters.stationId || undefined,
      filters.programId || undefined,
      filters.partId || undefined,
      filters.controllerStatus || undefined,
      filters.aiStatus || undefined,
      filters.serialNumber || undefined
    );
    setProducts(filteredProducts);
    setMetrics(getMetrics(filteredProducts));
    
    // Example of adding alerts based on status
    checkStatusForAlerts(filteredProducts);
    
    // Check products against alert configurations
    checkProductsForAlerts(filteredProducts, (alert) => {
      setGlobalAlert(alert);
      setAlerts(prevAlerts => [...prevAlerts, alert]);
    });
  }, [filters, startDate, endDate]);

  const checkStatusForAlerts = (products: any[]) => {
    // Clear existing alerts to prevent duplicates
    const newAlerts: AlertData[] = [];
    
    // Check for failures
    const failedProducts = products.filter(p => p.status === 'Failed');
    if (failedProducts.length > 2) {
      newAlerts.push({
        id: `failed-${Date.now()}`,
        title: 'High Failure Rate',
        message: `${failedProducts.length} products failed in the selected time period.`,
        type: 'error',
        timestamp: new Date()
      });
    }
    
    // Check for machine warnings
    const machineWarnings = products.filter(p => p.controllerStatus === 'Warning');
    if (machineWarnings.length > 0) {
      newAlerts.push({
        id: `warning-${Date.now()}`,
        title: 'Machine Warning',
        message: `${machineWarnings.length} machine warnings detected.`,
        type: 'warning',
        timestamp: new Date()
      });
    }
    
    // Check for AI model retraining needed
    const aiNeedsRetraining = products.some(p => p.aiStatus === 'NeedsRetraining');
    if (aiNeedsRetraining) {
      newAlerts.push({
        id: `ai-${Date.now()}`,
        title: 'AI Model Update Required',
        message: 'One or more AI models need retraining with new data.',
        type: 'info',
        timestamp: new Date()
      });
    }
    
    // Only update alerts if there are changes
    if (newAlerts.length > 0) {
      setAlerts(prevAlerts => {
        // Filter out duplicates based on title
        const existingTitles = prevAlerts.map(alert => alert.title);
        const uniqueNewAlerts = newAlerts.filter(alert => !existingTitles.includes(alert.title));
        return [...prevAlerts, ...uniqueNewAlerts];
      });
    }
  };

  const handleTimeRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };
  
  const handleCloseProductDetail = () => {
    setSelectedProductId(null);
  };
  
  const handleDismissAlert = (id: string) => {
    setAlerts(prevAlerts => {
      const newAlerts = prevAlerts.filter(alert => alert.id !== id);
      toast({
        title: "Alert dismissed",
        description: "You can manage all alerts in the settings panel.",
      });
      return newAlerts;
    });
  };

  const selectedProduct = selectedProductId ? productDetails[selectedProductId] : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">Manufacturing Process Monitor</h1>
          <div className="flex gap-2">
            <Link to="/kpi-dashboard">
              <Button variant="outline" className="gap-2">
                <BarChart className="h-4 w-4" />
                KPI Dashboard
              </Button>
            </Link>
            <Link to="/ai-modeling">
              <Button variant="outline" className="gap-2">
                <Brain className="h-4 w-4" />
                AI Modeling Platform
              </Button>
            </Link>
            <Link to="/alerts">
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Manage Alerts
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Alert Banner */}
        <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />
        
        <div className="space-y-4">
          {/* Time Range Selector with Timezone */}
          <div>
            <h2 className="text-lg font-medium mb-3">Time Range</h2>
            <TimeRangeSelector 
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleTimeRangeChange}
            />
          </div>
          
          {/* Filters */}
          <div>
            <h2 className="text-lg font-medium mb-3">Process Filters</h2>
            <FilterPanel onFilterChange={handleFilterChange} />
          </div>
          
          {/* Metrics */}
          <div>
            <h2 className="text-lg font-medium mb-3">Process Metrics</h2>
            <MetricsOverview metrics={metrics} />
          </div>
          
          {/* Products and ML Insights section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium mb-3">Product List</h2>
              <ProductsList products={products} onSelectProduct={handleSelectProduct} />
            </div>
            
            <div className="lg:col-span-1">
              <h2 className="text-lg font-medium mb-3">ML Insights</h2>
              <MLInsights />
            </div>
          </div>
        </div>
        
        {/* Product Detail Modal */}
        <ProductDetail 
          product={selectedProduct} 
          isOpen={selectedProductId !== null}
          onClose={handleCloseProductDetail}
        />
      </div>
      <Footer />
    </div>
  );
};
