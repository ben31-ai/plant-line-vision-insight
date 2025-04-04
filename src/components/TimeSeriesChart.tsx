
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { TimeSeriesPoint } from "@/utils/mockData";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  title?: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title = "Time Series Data" }) => {
  // Group data by metric
  const groupedByMetric = data.reduce<Record<string, TimeSeriesPoint[]>>((acc, point) => {
    if (!acc[point.metric]) {
      acc[point.metric] = [];
    }
    acc[point.metric].push(point);
    return acc;
  }, {});

  // Format data for chart
  const formattedData = Object.keys(groupedByMetric).length > 0 
    ? groupedByMetric[Object.keys(groupedByMetric)[0]].map((point, index) => {
        const result: Record<string, any> = {
          timestamp: point.timestamp,
          formattedTime: format(new Date(point.timestamp), 'HH:mm'),
        };
        
        // Add all metrics for this timestamp
        Object.keys(groupedByMetric).forEach(metric => {
          const metricPoint = groupedByMetric[metric][index];
          if (metricPoint) {
            result[metric] = metricPoint.value;
          }
        });
        
        return result;
      })
    : [];

  // Define colors for each metric
  const metricColors: Record<string, string> = {
    Temperature: "#0EA5E9",
    Pressure: "#F97316",
    Vibration: "#8B5CF6",
  };

  return (
    <Card className="bg-card shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1 md:p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.4} />
              <XAxis
                dataKey="formattedTime"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={{ stroke: "#4B5563" }}
                axisLine={{ stroke: "#4B5563" }}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={{ stroke: "#4B5563" }}
                axisLine={{ stroke: "#4B5563" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  borderRadius: "0.375rem",
                  color: "#F9FAFB",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
                labelStyle={{ fontWeight: "bold", marginBottom: "0.25rem" }}
                formatter={(value: number) => [`${value.toFixed(2)}`, ""]}
                labelFormatter={(time) => {
                  // Safety check to ensure we have valid data
                  if (typeof time !== 'number' || time < 0 || time >= formattedData.length || !formattedData[time]) {
                    return "Unknown time";
                  }
                  
                  const timestamp = formattedData[time].timestamp;
                  if (!(timestamp instanceof Date) && (typeof timestamp !== 'string' && typeof timestamp !== 'number')) {
                    return "Invalid timestamp";
                  }
                  
                  try {
                    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
                  } catch (error) {
                    console.error("Error formatting date:", error, "Timestamp:", timestamp);
                    return "Date formatting error";
                  }
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#D1D5DB",
                }}
              />
              {Object.keys(groupedByMetric).map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metric}
                  stroke={metricColors[metric] || "#0EA5E9"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
