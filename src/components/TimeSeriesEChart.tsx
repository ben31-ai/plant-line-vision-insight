
import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { TimeSeriesPoint } from "@/utils/mockData";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimeSeriesEChartProps {
  data: TimeSeriesPoint[];
}

export const TimeSeriesEChart: React.FC<TimeSeriesEChartProps> = ({ data }) => {
  const [xAxisMetric, setXAxisMetric] = useState<string>("timestamp");
  const [yAxisMetric, setYAxisMetric] = useState<string>("Temperature");
  const [zAxisMetric, setZAxisMetric] = useState<string>("none");
  const [is3D, setIs3D] = useState<boolean>(false);

  // Group data by metric
  const groupedByMetric = data.reduce<Record<string, TimeSeriesPoint[]>>(
    (acc, point) => {
      if (!acc[point.metric]) {
        acc[point.metric] = [];
      }
      acc[point.metric].push(point);
      return acc;
    },
    {}
  );

  // Get available metrics
  const availableMetrics = Object.keys(groupedByMetric);

  // Format data based on selected axes
  const formatChartData = () => {
    if (!is3D || zAxisMetric === "none") {
      // 2D chart data
      return data
        .filter((point) => point.metric === yAxisMetric)
        .map((point) => {
          return {
            name: format(new Date(point.timestamp), "HH:mm"),
            value: [
              xAxisMetric === "timestamp"
                ? format(new Date(point.timestamp), "HH:mm")
                : point.timestamp,
              point.value,
            ],
          };
        });
    } else {
      // 3D chart data - combine metrics
      const timestamps = Array.from(
        new Set(data.map((point) => point.timestamp))
      );

      return timestamps.map((timestamp) => {
        const yPoint = data.find(
          (p) => p.metric === yAxisMetric && p.timestamp === timestamp
        );
        const zPoint = data.find(
          (p) => p.metric === zAxisMetric && p.timestamp === timestamp
        );

        return {
          name: format(new Date(timestamp), "HH:mm"),
          value: [
            xAxisMetric === "timestamp"
              ? format(new Date(timestamp), "HH:mm")
              : timestamp,
            yPoint?.value || 0,
            zPoint?.value || 0,
          ],
        };
      });
    }
  };

  // Generate ECharts options
  const getChartOptions = () => {
    if (is3D && zAxisMetric !== "none") {
      // 3D chart options
      return {
        grid3D: {},
        tooltip: {},
        xAxis3D: {
          type: xAxisMetric === "timestamp" ? "category" : "value",
          name: xAxisMetric === "timestamp" ? "Time" : xAxisMetric,
        },
        yAxis3D: {
          type: "value",
          name: yAxisMetric,
        },
        zAxis3D: {
          type: "value",
          name: zAxisMetric,
        },
        series: [
          {
            type: "scatter3D",
            data: formatChartData(),
          },
        ],
      };
    } else {
      // 2D chart options
      return {
        tooltip: {
          trigger: "axis",
          formatter: function (params: any) {
            return `${params[0].name}<br/>${yAxisMetric}: ${params[0].value[1].toFixed(2)}`;
          },
        },
        xAxis: {
          type: xAxisMetric === "timestamp" ? "category" : "value",
          data: xAxisMetric === "timestamp" ? formatChartData().map(item => item.name) : undefined,
          name: xAxisMetric === "timestamp" ? "Time" : xAxisMetric,
        },
        yAxis: {
          type: "value",
          name: yAxisMetric,
        },
        series: [
          {
            data: formatChartData().map(item => item.value[1]),
            type: "line",
            smooth: true,
            name: yAxisMetric,
          },
        ],
        ...(zAxisMetric !== "none" ? {
          yAxis: [
            {
              type: "value",
              name: yAxisMetric,
            },
            {
              type: "value",
              name: zAxisMetric,
              position: "right",
            }
          ],
          series: [
            {
              data: formatChartData().map(item => item.value[1]),
              type: "line",
              smooth: true,
              name: yAxisMetric,
            },
            {
              data: data
                .filter((point) => point.metric === zAxisMetric)
                .map((point) => point.value),
              type: "line",
              smooth: true,
              name: zAxisMetric,
              yAxisIndex: 1,
            }
          ],
        } : {})
      };
    }
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-5 mb-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            X Axis
          </label>
          <Select
            value={xAxisMetric}
            onValueChange={setXAxisMetric}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select X axis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">Time</SelectItem>
              {availableMetrics.map((metric) => (
                <SelectItem key={`x-${metric}`} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Y Axis
          </label>
          <Select
            value={yAxisMetric}
            onValueChange={setYAxisMetric}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Y axis" />
            </SelectTrigger>
            <SelectContent>
              {availableMetrics.map((metric) => (
                <SelectItem key={`y-${metric}`} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Z Axis (Optional)
          </label>
          <Select
            value={zAxisMetric}
            onValueChange={setZAxisMetric}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Z axis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availableMetrics
                .filter((metric) => metric !== yAxisMetric)
                .map((metric) => (
                  <SelectItem key={`z-${metric}`} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          {zAxisMetric !== "none" && (
            <Button
              onClick={() => setIs3D(!is3D)}
              variant="outline"
              className="w-full"
            >
              {is3D ? "Switch to 2D" : "Switch to 3D"}
            </Button>
          )}
        </div>
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <ReactECharts
          option={getChartOptions()}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </div>
    </div>
  );
};
