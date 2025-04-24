import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { FilterPanel, FilterState } from "./FilterPanel";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  Activity,
  Package,
  Gauge,
} from "lucide-react";
import { subDays } from "date-fns";
import { Logo } from "./Logo";
import { getFilteredProducts, getMetrics } from "@/utils/mockData";
import { KPICard } from "./kpi/KPICard";
import { ProductionCharts } from "./kpi/ProductionCharts";
import { Recommendations } from "./kpi/Recommendations";
import { Footer } from "./Footer";

const productionData = [
  { name: 'Jan', production: 4000, target: 4500, efficiency: 89 },
  { name: 'Feb', production: 4200, target: 4500, efficiency: 93 },
  { name: 'Mar', production: 5000, target: 4500, efficiency: 111 },
  { name: 'Apr', production: 4500, target: 4500, efficiency: 100 },
  { name: 'May', production: 4800, target: 4800, efficiency: 100 },
  { name: 'Jun', production: 5200, target: 4800, efficiency: 108 },
  { name: 'Jul', production: 4900, target: 4800, efficiency: 102 },
];

const defectData = [
  { name: 'Line 1', value: 12 },
  { name: 'Line 2', value: 8 },
  { name: 'Line 3', value: 15 },
  { name: 'Line 4', value: 5 },
];

export const KPIDashboard = () => {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  const [filters, setFilters] = useState<FilterState>({
    plantId: null,
    lineId: null,
    stationId: null,
    programId: null,
    partId: null,
    controllerStatus: null,
    aiStatus: null,
  });
  
  const handleTimeRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const products = getFilteredProducts(
    startDate,
    endDate,
    filters.plantId || undefined,
    filters.lineId || undefined,
    filters.stationId || undefined,
    filters.programId || undefined,
    filters.partId || undefined,
    filters.controllerStatus || undefined,
    filters.aiStatus || undefined
  );
  
  const metrics = getMetrics(products);
  
  const avgCycleTime = 5;
  const passRate = 0.95;
  const oeeValue = Math.round((passRate * 0.9 * 0.95) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Production KPI Dashboard</h1>
          </div>
          <Logo 
            iconSize={36} 
            textSize="text-xl"
            className="text-primary"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="OEE"
            value={`${oeeValue}%`}
            description="Overall Equipment Effectiveness"
            icon={Gauge}
          />
          <KPICard
            title="Production Rate"
            value={`${metrics.totalProducts} units`}
            description={`${metrics.totalProducts > 1000 ? "+2.5%" : "-0.7%"} from previous period`}
            icon={Activity}
          />
          <KPICard
            title="Avg Cycle Time"
            value={`${avgCycleTime.toFixed(1)}s`}
            description="Per unit production time"
            icon={Activity}
          />
          <KPICard
            title="Pass Rate"
            value={`${(passRate * 100).toFixed(1)}%`}
            description={passRate > 0.95 ? "On target" : "Below target"}
            icon={Package}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="col-span-2">
              <CardHeader>
                <CardContent className="space-y-4">
                  <TimeRangeSelector 
                    startDate={startDate}
                    endDate={endDate}
                    onRangeChange={handleTimeRangeChange}
                  />
                  <FilterPanel onFilterChange={handleFilterChange} />
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>

        <ProductionCharts 
          productionData={productionData}
          defectData={defectData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Recommendations />
        </div>
      </div>
      <Footer />
    </div>
  );
};
