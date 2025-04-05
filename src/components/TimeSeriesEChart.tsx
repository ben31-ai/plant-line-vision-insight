
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TimeSeriesPoint } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { ChartControls } from "./charts/ChartControls";
import { EChartRenderer } from "./charts/EChartRenderer";
import { groupDataByMetric, getAvailableMetrics } from "./charts/utils";
import { get2DChartOptions, get3DChartOptions } from "./charts/chartOptions";
import { fetchTimeSeriesData } from "@/services/timeSeriesApi";
import * as echarts from 'echarts/core';
import 'echarts-gl';

interface TimeSeriesEChartProps {
  data?: TimeSeriesPoint[]; // Optional now as we might fetch from API
}

export const TimeSeriesEChart: React.FC<TimeSeriesEChartProps> = ({ data: initialData }) => {
  const [xAxisMetric, setXAxisMetric] = useState<string>("timestamp");
  const [yAxisMetric, setYAxisMetric] = useState<string>("");
  const [zAxisMetric, setZAxisMetric] = useState<string>("none");
  const [is3D, setIs3D] = useState<boolean>(false);

  // Fetch data from API
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['timeSeriesData'],
    queryFn: fetchTimeSeriesData
  });

  // Use API data if available, or fall back to initialData from props
  const timeSeriesData = apiData?.timeSeries || initialData || [];
  
  // Group data by metric
  const groupedByMetric = groupDataByMetric(timeSeriesData);

  // Get available metrics - either from API or calculated from data
  const availableMetrics = apiData?.availableMetrics || getAvailableMetrics(groupedByMetric);

  // Initialize yAxisMetric with the first available metric if not set
  useEffect(() => {
    if (availableMetrics?.length > 0 && !yAxisMetric) {
      setYAxisMetric(availableMetrics[0]);
    }
  }, [availableMetrics, yAxisMetric]);

  // Reset 3D state when z-axis is set to none
  useEffect(() => {
    if (zAxisMetric === "none" && is3D) {
      setIs3D(false);
    }
  }, [zAxisMetric, is3D]);

  // Generate chart options based on selection
  const chartOptions = is3D && zAxisMetric !== "none" 
    ? get3DChartOptions(timeSeriesData, xAxisMetric, yAxisMetric, zAxisMetric)
    : get2DChartOptions(timeSeriesData, xAxisMetric, yAxisMetric, zAxisMetric);

  // Handle loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-60">Loading chart data...</div>;
  }

  // Handle error state
  if (error) {
    console.error('Error fetching chart data:', error);
    return (
      <div className="flex justify-center items-center h-60 text-red-500">
        Error loading chart data. Please try again later.
      </div>
    );
  }

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
