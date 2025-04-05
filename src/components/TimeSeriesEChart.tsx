
import React, { useState, useEffect } from "react";
import { TimeSeriesPoint } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { ChartControls } from "./charts/ChartControls";
import { EChartRenderer } from "./charts/EChartRenderer";
import { groupDataByMetric, getAvailableMetrics } from "./charts/utils";
import { get2DChartOptions, get3DChartOptions } from "./charts/chartOptions";
import * as echarts from 'echarts/core';
import 'echarts-gl';

interface TimeSeriesEChartProps {
  data: TimeSeriesPoint[];
}

export const TimeSeriesEChart: React.FC<TimeSeriesEChartProps> = ({ data }) => {
  const [xAxisMetric, setXAxisMetric] = useState<string>("timestamp");
  const [yAxisMetric, setYAxisMetric] = useState<string>("Temperature");
  const [zAxisMetric, setZAxisMetric] = useState<string>("none");
  const [is3D, setIs3D] = useState<boolean>(false);

  // Group data by metric
  const groupedByMetric = groupDataByMetric(data);

  // Get available metrics
  const availableMetrics = getAvailableMetrics(groupedByMetric);

  // Reset 3D state when z-axis is set to none
  useEffect(() => {
    if (zAxisMetric === "none" && is3D) {
      setIs3D(false);
    }
  }, [zAxisMetric, is3D]);

  // Generate chart options based on selection
  const chartOptions = is3D && zAxisMetric !== "none" 
    ? get3DChartOptions(data, xAxisMetric, yAxisMetric, zAxisMetric)
    : get2DChartOptions(data, xAxisMetric, yAxisMetric, zAxisMetric);

  return (
    <div>
      <ChartControls 
        xAxisMetric={xAxisMetric}
        setXAxisMetric={setXAxisMetric}
        yAxisMetric={yAxisMetric}
        setYAxisMetric={setYAxisMetric}
        zAxisMetric={zAxisMetric}
        setZAxisMetric={setZAxisMetric}
        is3D={is3D}
        setIs3D={setIs3D}
        availableMetrics={availableMetrics}
      />
      <EChartRenderer options={chartOptions} />
    </div>
  );
};
