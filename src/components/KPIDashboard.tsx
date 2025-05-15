
import React, { useState, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";
import { subDays } from "date-fns";
import { Logo } from "./Logo";
import { getFilteredProducts, getMetrics } from "@/utils/mockData";
import { KPICard } from "./kpi/KPICard";
import { ProductionCharts } from "./kpi/ProductionCharts";
import { Recommendations } from "./kpi/Recommendations";
import { Footer } from "./Footer";
import { createAlert, setGlobalAlert } from "@/utils/alertUtils";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";

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
    serialNumber: null, // Add the serialNumber property to match FilterState interface
  });

  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"info" | "warning" | "error" | "success">("info");
  const { toast } = useToast();
  
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
    filters.aiStatus || undefined,
    filters.serialNumber || undefined // Also pass the serialNumber to getFilteredProducts
  );
  
  const metrics = getMetrics(products);
  
  const avgCycleTime = 5;
  const passRate = 0.95;
  const oeeValue = Math.round((passRate * 0.9 * 0.95) * 100);

  // Create and send a global alert
  const handleCreateAlert = () => {
    if (!alertTitle.trim()) {
      toast({
        title: "Error",
        description: "Alert title is required",
        variant: "destructive"
      });
      return;
    }
    
    const newAlert = createAlert(alertTitle, alertMessage, alertType);
    setGlobalAlert(newAlert);
    
    toast({
      title: "Alert created",
      description: "Alert will be displayed on the main dashboard"
    });
    
    // Reset form
    setAlertTitle("");
    setAlertMessage("");
    setAlertType("info");
  };

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
        
        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>
                  Create an alert that will be displayed on the main dashboard.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Type</label>
                  <div className="flex flex-wrap gap-2">
                    {(["info", "warning", "error", "success"] as const).map((type) => (
                      <Badge 
                        key={type}
                        variant={alertType === type ? "default" : "outline"}
                        className={`cursor-pointer ${
                          alertType === type ? "" : "hover:bg-secondary"
                        }`}
                        onClick={() => setAlertType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <input
                    id="title"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Alert title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="w-full p-2 border rounded-md min-h-[80px]"
                    placeholder="Alert message details"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleCreateAlert}>Create Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
