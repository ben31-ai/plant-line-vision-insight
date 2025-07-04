
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Thermometer, Zap, Settings } from "lucide-react";

interface RootCausePanelProps {
  region: string;
}

export const RootCausePanel: React.FC<RootCausePanelProps> = ({
  region,
}) => {
  const rootCauseAnalysis = useMemo(() => {
    // Generate root cause analysis based on region
    const causes = {
      all: [
        { cause: "Temperature Fluctuation", probability: 85, severity: "high", icon: Thermometer },
        { cause: "Vibration Anomaly", probability: 72, severity: "medium", icon: TrendingUp },
        { cause: "Power Instability", probability: 58, severity: "medium", icon: Zap },
        { cause: "Configuration Drift", probability: 34, severity: "low", icon: Settings },
      ],
      startup: [
        { cause: "Initialization Delay", probability: 92, severity: "high", icon: Settings },
        { cause: "Temperature Ramp", probability: 76, severity: "medium", icon: Thermometer },
        { cause: "System Calibration", probability: 45, severity: "low", icon: TrendingUp },
      ],
      steady: [
        { cause: "Gradual Drift", probability: 68, severity: "medium", icon: TrendingUp },
        { cause: "Periodic Oscillation", probability: 55, severity: "medium", icon: Zap },
        { cause: "Sensor Degradation", probability: 42, severity: "low", icon: Settings },
      ],
      shutdown: [
        { cause: "Rapid Cooling", probability: 88, severity: "high", icon: Thermometer },
        { cause: "Power Down Sequence", probability: 71, severity: "medium", icon: Zap },
        { cause: "System Shutdown", probability: 39, severity: "low", icon: Settings },
      ],
      anomaly: [
        { cause: "Critical System Fault", probability: 95, severity: "critical", icon: AlertTriangle },
        { cause: "Sensor Malfunction", probability: 87, severity: "high", icon: Settings },
        { cause: "External Interference", probability: 73, severity: "high", icon: Zap },
        { cause: "Process Deviation", probability: 61, severity: "medium", icon: TrendingUp },
      ],
    };

    return causes[region as keyof typeof causes] || causes.all;
  }, [region]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 border-red-200";
      case "high": return "bg-orange-50 border-orange-200";
      case "medium": return "bg-yellow-50 border-yellow-200";
      case "low": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Most Probable Root Causes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rootCauseAnalysis.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityBgColor(item.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.cause}</span>
                  </div>
                  <Badge variant={getSeverityColor(item.severity) as any} className="text-xs">
                    {item.severity}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Probability</span>
                    <span>{item.probability}%</span>
                  </div>
                  <Progress value={item.probability} className="h-2" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Analysis Region:</span>
            <span className="font-medium capitalize">{region}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data Points:</span>
            <span className="font-medium">200</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Clusters Found:</span>
            <span className="font-medium">{region === "anomaly" ? "4" : "3"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
