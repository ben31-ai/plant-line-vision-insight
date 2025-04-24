
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface ChartData {
  name: string;
  production: number;
  target: number;
  efficiency: number;
}

interface DefectData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ProductionChartsProps {
  productionData: ChartData[];
  defectData: DefectData[];
}

export const ProductionCharts = ({ productionData, defectData }: ProductionChartsProps) => {
  return (
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
  );
};
