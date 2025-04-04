
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MLInsight, mlInsights } from "@/utils/mockData";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface MLInsightsProps {
  insights?: MLInsight[];
}

export const MLInsights: React.FC<MLInsightsProps> = ({ insights = mlInsights }) => {
  const getSeverityIcon = (severity: MLInsight["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getSeverityClass = (severity: MLInsight["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-l-destructive";
      case "warning":
        return "border-l-warning";
      case "info":
      default:
        return "border-l-primary";
    }
  };

  return (
    <Card className="bg-card shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">ML Analytics Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Info className="h-10 w-10 mb-2" />
            <p>No insights available for the selected filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3 bg-secondary/30 rounded-md border-l-4 ${getSeverityClass(insight.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {getSeverityIcon(insight.severity)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {insight.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(insight.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
