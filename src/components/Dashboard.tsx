import React, { useState, useEffect } from "react";
import { FilterState } from "./FilterPanel";
import { getFilteredProducts, getMetrics } from "@/utils/mockData";
import { subDays } from "date-fns";
import { Header } from "./HeaderWithAlert";
import { Footer } from "./Footer";
import { useToast } from "@/hooks/use-toast";
import { AlertData } from "./AlertBanner";
import { DashboardAlerts, checkStatusForAlerts } from "./DashboardAlerts";
import { DashboardTimeFilters } from "./DashboardTimeFilters";
import { DashboardNavigation } from "./DashboardNavigation";
import { DashboardContent } from "./DashboardContent";
import { LoadingPage } from "./LoadingPage";

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Simulate loading time
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second loading time

    return () => clearTimeout(loadingTimer);
  }, []);
  
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
    const statusAlerts = checkStatusForAlerts(filteredProducts);
    
    // Only update alerts if there are changes
    if (statusAlerts.length > 0) {
      setAlerts(prevAlerts => {
        // Filter out duplicates based on title
        const existingTitles = prevAlerts.map(alert => alert.title);
        const uniqueNewAlerts = statusAlerts.filter(alert => !existingTitles.includes(alert.title));
        return [...prevAlerts, ...uniqueNewAlerts];
      });
    }
  }, [filters, startDate, endDate]);

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
  
  if (isLoading) {
    return <LoadingPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">Manufacturing Process Monitor</h1>
          <DashboardNavigation />
        </div>
        
        {/* Alert Banner */}
        <DashboardAlerts 
          products={products}
          alerts={alerts} 
          onDismissAlert={handleDismissAlert} 
        />
        
        {/* Time Filters */}
        <DashboardTimeFilters
          startDate={startDate}
          endDate={endDate}
          filters={filters}
          onTimeRangeChange={handleTimeRangeChange}
          onFilterChange={handleFilterChange}
        />
        
        {/* Dashboard Content */}
        <DashboardContent
          products={products}
          metrics={metrics}
          onSelectProduct={handleSelectProduct}
          selectedProductId={selectedProductId}
          onCloseProductDetail={handleCloseProductDetail}
        />
      </div>
      <Footer />
    </div>
  );
};
