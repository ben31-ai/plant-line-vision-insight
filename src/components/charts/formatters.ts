
import { TimeSeriesPoint } from "@/utils/mockData";
import { format } from "date-fns";

// Format data for 2D chart
export const format2DChartData = (
  data: TimeSeriesPoint[], 
  yAxisMetric: string, 
  xAxisMetric: string
) => {
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
};

// Format data for 3D chart
export const format3DChartData = (
  data: TimeSeriesPoint[],
  yAxisMetric: string,
  zAxisMetric: string,
  xAxisMetric: string
) => {
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
};
