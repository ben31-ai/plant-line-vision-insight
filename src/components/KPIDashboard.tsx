import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { FilterPanel, FilterState } from "./FilterPanel";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AreaChart, BarChart, PieChart, Activity, Package, AlertTriangle, Server, ArrowLeft, TrendingUp, Factory, Gauge } from "lucide-react";
import { subDays } from "date-fns";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFilteredProducts, getMetrics } from "@/utils/mockData";

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const alertData = [
  { id: 1, line: 'Line 2', station: 'Assembly', type: 'Maintenance', status: 'High', description: 'Preventive maintenance required' },
  { id: 2, line: 'Line 1', station: 'Packaging', type: 'Quality', status: 'Medium', description: 'Quality check deviations detected' },
  { id: 3, line: 'Line 3', station: 'Testing', type: 'Performance', status: 'Low', description: 'Slight decrease in testing speed' },
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
    <div className="container py-6 mx-auto space-y-6">
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OEE</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oeeValue}%</div>
            <p className="text-xs text-muted-foreground">
              Overall Equipment Effectiveness
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts} units</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalProducts > 1000 ? "+2.5%" : "-0.7%"} from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCycleTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">
              Per unit production time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(passRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {passRate > 0.95 ? "On target" : "Below target"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Filter & Time Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimeRangeSelector 
                startDate={startDate}
                endDate={endDate}
                onRangeChange={handleTimeRangeChange}
              />
              <FilterPanel onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Production Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertData.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.line}</TableCell>
                      <TableCell>{alert.station}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.status === 'High' 
                              ? 'destructive' 
                              : alert.status === 'Medium' 
                                ? 'default' 
                                : 'outline'
                          }
                        >
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{alert.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Production vs Target</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full">
              <ChartContainer 
                config={{
                  production: { label: "Production", color: "#0088FE" },
                  target: { label: "Target", color: "#FF8042" },
                }}
              >
                <RechartsBarChart data={productionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="production" fill="#0088FE" name="Production" />
                  <Bar dataKey="target" fill="#FF8042" name="Target" />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Efficiency Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full">
              <ChartContainer 
                config={{
                  efficiency: { label: "Efficiency %", color: "#00C49F" },
                }}
              >
                <RechartsAreaChart data={productionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="efficiency" stroke="#00C49F" fill="#00C49F" fillOpacity={0.2} />
                </RechartsAreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Defect Distribution by Line</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={defectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {defectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} defects`, 'Count']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="bg-green-100 p-2 rounded">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Improve Line 3 Efficiency</h3>
                  <p className="text-sm text-muted-foreground">Current efficiency is below target. Schedule maintenance and calibration.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 p-2 rounded">
                  <Factory className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Scale Production on Line 2</h3>
                  <p className="text-sm text-muted-foreground">Line 2 is operating at optimal efficiency. Consider increasing workload.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-amber-100 p-2 rounded">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Quality Check Alert</h3>
                  <p className="text-sm text-muted-foreground">Recent increase in defects reported on Line 1. Schedule quality assessment.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-purple-100 p-2 rounded">
                  <Server className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">System Optimization</h3>
                  <p className="text-sm text-muted-foreground">Database performance could be improved to reduce process cycle time.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
