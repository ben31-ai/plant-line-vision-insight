
import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts/core';
import 'echarts-gl';

interface EChartRendererProps {
  options: any;
}

export const EChartRenderer: React.FC<EChartRendererProps> = ({ options }) => {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactECharts
        option={options}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};
