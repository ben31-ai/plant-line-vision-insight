
import { format3DChartData, format2DChartData } from "./formatters";
import { TimeSeriesPoint } from "@/utils/mockData";

// Generate options for 3D chart
export const get3DChartOptions = (
  data: TimeSeriesPoint[],
  xAxisMetric: string,
  yAxisMetric: string,
  zAxisMetric: string
) => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        return `${params.name}<br/>${yAxisMetric}: ${params.value[1].toFixed(2)}<br/>${zAxisMetric}: ${params.value[2].toFixed(2)}`;
      }
    },
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
    grid3D: {
      viewControl: {
        projection: 'perspective',
        autoRotate: false
      },
      boxHeight: 80,
    },
    series: [
      {
        type: "scatter3D",
        data: format3DChartData(data, yAxisMetric, zAxisMetric, xAxisMetric),
        symbolSize: 8,
        itemStyle: {
          color: '#0EA5E9',
          opacity: 0.8
        },
        emphasis: {
          itemStyle: {
            color: '#F97316',
            opacity: 1
          }
        }
      },
    ],
  };
};

// Generate options for 2D chart
export const get2DChartOptions = (
  data: TimeSeriesPoint[],
  xAxisMetric: string,
  yAxisMetric: string,
  zAxisMetric: string = "none"
) => {
  const formattedData = format2DChartData(data, yAxisMetric, xAxisMetric);
  
  const baseOptions = {
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        return `${params[0].name}<br/>${yAxisMetric}: ${params[0].value[1].toFixed(2)}`;
      },
    },
    xAxis: {
      type: xAxisMetric === "timestamp" ? "category" : "value",
      data: xAxisMetric === "timestamp" ? formattedData.map(item => item.name) : undefined,
      name: xAxisMetric === "timestamp" ? "Time" : xAxisMetric,
    },
    yAxis: {
      type: "value",
      name: yAxisMetric,
    },
    series: [
      {
        data: formattedData.map(item => item.value[1]),
        type: "line",
        smooth: true,
        name: yAxisMetric,
      },
    ],
  };

  // Add second y-axis if zAxisMetric is specified
  if (zAxisMetric !== "none") {
    return {
      ...baseOptions,
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
          data: formattedData.map(item => item.value[1]),
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
      ]
    };
  }

  return baseOptions;
};
