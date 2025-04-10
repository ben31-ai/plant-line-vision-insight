
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
import { Brain, BarChart } from "lucide-react";

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
  });
  
  const [products, setProducts] = useState(getFilteredProducts(startDate, endDate));
  const [metrics, setMetrics] = useState(getMetrics(products));
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Update products and metrics when filters or date range change
  useEffect(() => {
    const filteredProducts = getFilteredProducts(
      startDate,
      endDate,
      filters.plantId || undefined,
      filters.lineId || undefined,
      filters.stationId || undefined,
      filters.programId || undefined,
      filters.partId || undefined
    );
    setProducts(filteredProducts);
    setMetrics(getMetrics(filteredProducts));
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

  const selectedProduct = selectedProductId ? productDetails[selectedProductId] : null;
  
  return (
    <div className="container py-6 mx-auto space-y-6">
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
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Time Range Selector */}
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
  );
};
