
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricsData } from "@/utils/mockData";
import { ArrowDown, ArrowUp, ArrowRight } from "lucide-react";

interface MetricsOverviewProps {
  metrics: MetricsData;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics }) => {
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <div className="text-success flex items-center">
            <ArrowUp className="w-4 h-4" />
            <span className="text-xs ml-1">Improving</span>
          </div>
        );
      case 'down':
        return (
          <div className="text-destructive flex items-center">
            <ArrowDown className="w-4 h-4" />
            <span className="text-xs ml-1">Declining</span>
          </div>
        );
      case 'stable':
      default:
        return (
          <div className="text-muted-foreground flex items-center">
            <ArrowRight className="w-4 h-4" />
            <span className="text-xs ml-1">Stable</span>
          </div>
        );
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 90) return "bg-success";
    if (percentage > 75) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{metrics.totalProducts.toLocaleString()}</div>
          <div className="mt-2">{renderTrendIcon(metrics.trend)}</div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Controller OK Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{metrics.controllerOkPercentage}%</div>
            <div className={`text-sm ${metrics.controllerOkPercentage > 90 ? "text-success" : metrics.controllerOkPercentage > 75 ? "text-warning" : "text-destructive"}`}>
              {metrics.controllerOkPercentage > 90 ? "Good" : metrics.controllerOkPercentage > 75 ? "Moderate" : "Poor"}
            </div>
          </div>
          <Progress 
            value={metrics.controllerOkPercentage} 
            className="mt-2 h-2"
            color={getStatusColor(metrics.controllerOkPercentage)}
          />
          <div className="mt-2">{renderTrendIcon(metrics.trend)}</div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">AI Model OK Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{metrics.aiOkPercentage}%</div>
            <div className={`text-sm ${metrics.aiOkPercentage > 90 ? "text-success" : metrics.aiOkPercentage > 75 ? "text-warning" : "text-destructive"}`}>
              {metrics.aiOkPercentage > 90 ? "Good" : metrics.aiOkPercentage > 75 ? "Moderate" : "Poor"}
            </div>
          </div>
          <Progress 
            value={metrics.aiOkPercentage} 
            className="mt-2 h-2"
            color={getStatusColor(metrics.aiOkPercentage)}
          />
          <div className="mt-2">{renderTrendIcon(metrics.trend)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
