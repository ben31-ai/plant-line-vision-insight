
import React, { useMemo } from "react";
import { EChartRenderer } from "../charts/EChartRenderer";

interface ClusteringAnalysisProps {
  region: string;
}

export const ClusteringAnalysis: React.FC<ClusteringAnalysisProps> = ({
  region,
}) => {
  const clusteringData = useMemo(() => {
    // Generate synthetic clustering data based on region
    // Using a default time range since we removed the time range selector
    const timeRange = { start: 0, end: 100 };
    const baseData = [];
    const numPoints = 200;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (timeRange.start + (timeRange.end - timeRange.start) * Math.random()) / 100;
      
      // Generate different cluster patterns based on region
      let x, y, z, cluster;
      
      if (region === "anomaly") {
        // Anomalous data - more scattered with distinct outliers
        if (Math.random() < 0.2) {
          // Outliers
          x = (Math.random() - 0.5) * 20;
          y = (Math.random() - 0.5) * 20;
          z = (Math.random() - 0.5) * 20;
          cluster = 3; // Anomaly cluster
        } else {
          // Normal clusters but with more variance
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * 5 + 2;
          x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
          y = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;
          z = Math.random() * 8 - 4;
          cluster = Math.floor(Math.random() * 2);
        }
      } else {
        // Normal clustering patterns
        const clusterCenter = Math.floor(Math.random() * 3);
        const centers = [
          [0, 0, 0],
          [8, 5, 3],
          [-5, 8, -2]
        ];
        
        x = centers[clusterCenter][0] + (Math.random() - 0.5) * 4;
        y = centers[clusterCenter][1] + (Math.random() - 0.5) * 4;
        z = centers[clusterCenter][2] + (Math.random() - 0.5) * 4;
        cluster = clusterCenter;
      }
      
      baseData.push([x, y, z, cluster, t]);
    }
    
    return baseData;
  }, [region]);

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        const [x, y, z, cluster, time] = params.value;
        return `Cluster: ${cluster}<br/>
                X: ${x.toFixed(2)}<br/>
                Y: ${y.toFixed(2)}<br/>
                Z: ${z.toFixed(2)}<br/>
                Time: ${(time * 100).toFixed(1)}%`;
      }
    },
    xAxis3D: {
      type: "value",
      name: "Feature 1",
    },
    yAxis3D: {
      type: "value",
      name: "Feature 2",
    },
    zAxis3D: {
      type: "value",
      name: "Feature 3",
    },
    grid3D: {
      viewControl: {
        projection: 'perspective',
        autoRotate: region === "all",
        autoRotateSpeed: 5,
      },
      boxHeight: 80,
      environment: '#ffffff'
    },
    series: [
      {
        type: "scatter3D",
        data: clusteringData,
        symbolSize: 6,
        itemStyle: {
          opacity: 0.8
        },
        emphasis: {
          itemStyle: {
            opacity: 1
          }
        }
      },
    ],
    visualMap: {
      type: 'piecewise',
      dimension: 3, // Color by cluster
      categories: ['Cluster 0', 'Cluster 1', 'Cluster 2', 'Anomaly'],
      inRange: {
        color: ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444']
      },
      textStyle: {
        color: '#666'
      },
      orient: 'horizontal',
      left: 'center',
      bottom: 10
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Region: <span className="font-medium capitalize">{region}</span>
      </div>
      <EChartRenderer options={chartOptions} />
    </div>
  );
};
