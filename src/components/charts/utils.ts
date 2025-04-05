
import { TimeSeriesPoint } from "@/utils/mockData";

// Group data by metric
export const groupDataByMetric = (data: TimeSeriesPoint[]) => {
  return data.reduce<Record<string, TimeSeriesPoint[]>>(
    (acc, point) => {
      if (!acc[point.metric]) {
        acc[point.metric] = [];
      }
      acc[point.metric].push(point);
      return acc;
    },
    {}
  );
};

// Get available metrics from data
export const getAvailableMetrics = (groupedData: Record<string, TimeSeriesPoint[]>) => {
  return Object.keys(groupedData);
};
