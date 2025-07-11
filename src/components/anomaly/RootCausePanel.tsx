
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
        { 
          cause: "Temperature Fluctuation", 
          probability: 85, 
          icon: Thermometer,
          description: "Abnormal temperature variations detected in the system sensors, indicating potential thermal management issues.",
          action: "Check cooling system, inspect thermal sensors, and verify HVAC functionality."
        },
        { 
          cause: "Vibration Anomaly", 
          probability: 72, 
          icon: TrendingUp,
          description: "Unusual vibration patterns detected that may indicate mechanical wear or misalignment.",
          action: "Inspect mechanical components, check bearing conditions, and perform alignment verification."
        },
        { 
          cause: "Power Instability", 
          probability: 58, 
          icon: Zap,
          description: "Electrical power fluctuations observed that could affect system performance and reliability.",
          action: "Check power supply units, inspect electrical connections, and verify voltage regulation."
        },
        { 
          cause: "Configuration Drift", 
          probability: 34, 
          icon: Settings,
          description: "System configuration parameters have deviated from optimal settings over time.",
          action: "Review and restore system configuration to baseline settings, update configuration management."
        },
      ],
      startup: [
        { 
          cause: "Initialization Delay", 
          probability: 92, 
          icon: Settings,
          description: "System startup sequence taking longer than expected, indicating potential software or hardware issues.",
          action: "Analyze startup logs, check system resources, and optimize initialization procedures."
        },
        { 
          cause: "Temperature Ramp", 
          probability: 76, 
          icon: Thermometer,
          description: "Temperature rising too quickly during startup phase, potentially causing thermal stress.",
          action: "Adjust startup temperature profile, check thermal management during boot sequence."
        },
        { 
          cause: "System Calibration", 
          probability: 45, 
          icon: TrendingUp,
          description: "Calibration parameters may be incorrect or outdated, affecting system accuracy during startup.",
          action: "Perform system recalibration, verify sensor accuracy, and update calibration tables."
        },
      ],
      steady: [
        { 
          cause: "Gradual Drift", 
          probability: 68, 
          icon: TrendingUp,
          description: "System parameters slowly drifting from optimal values during steady-state operation.",
          action: "Implement drift correction algorithms, schedule regular parameter adjustment, and monitor trends."
        },
        { 
          cause: "Periodic Oscillation", 
          probability: 55, 
          icon: Zap,
          description: "Regular oscillations detected in system behavior, indicating potential control loop issues.",
          action: "Tune control parameters, check feedback loops, and adjust PID controller settings."
        },
        { 
          cause: "Sensor Degradation", 
          probability: 42, 
          icon: Settings,
          description: "Sensor accuracy decreasing over time, affecting measurement reliability.",
          action: "Replace aging sensors, perform sensor validation, and update sensor calibration."
        },
      ],
      shutdown: [
        { 
          cause: "Rapid Cooling", 
          probability: 88, 
          icon: Thermometer,
          description: "Temperature dropping too quickly during shutdown, potentially causing thermal shock.",
          action: "Implement controlled cooling sequence, adjust shutdown temperature profile, and check thermal protection."
        },
        { 
          cause: "Power Down Sequence", 
          probability: 71, 
          icon: Zap,
          description: "Issues detected in the power-down sequence that may cause improper system shutdown.",
          action: "Review shutdown procedures, check power sequencing, and verify graceful shutdown protocols."
        },
        { 
          cause: "System Shutdown", 
          probability: 39, 
          icon: Settings,
          description: "General system shutdown anomalies that don't fit specific categories.",
          action: "Analyze shutdown logs, check system state before shutdown, and verify shutdown procedures."
        },
      ],
      anomaly: [
        { 
          cause: "Critical System Fault", 
          probability: 95, 
          icon: AlertTriangle,
          description: "Severe system malfunction detected that requires immediate attention to prevent damage.",
          action: "Initiate emergency shutdown procedures, perform comprehensive system diagnostics, and contact technical support."
        },
        { 
          cause: "Sensor Malfunction", 
          probability: 87, 
          icon: Settings,
          description: "Multiple sensors providing inconsistent or erratic readings, indicating hardware failure.",
          action: "Replace faulty sensors, perform sensor network diagnostics, and verify sensor communication."
        },
        { 
          cause: "External Interference", 
          probability: 73, 
          icon: Zap,
          description: "External electromagnetic or environmental factors affecting system operation.",
          action: "Identify interference sources, implement shielding measures, and relocate sensitive equipment if necessary."
        },
        { 
          cause: "Process Deviation", 
          probability: 61, 
          icon: TrendingUp,
          description: "Manufacturing or operational process has deviated significantly from normal parameters.",
          action: "Review process parameters, adjust operating conditions, and implement process control measures."
        },
      ],
    };

    return causes[region as keyof typeof causes] || causes.all;
  }, [region]);

  const getProbabilityBadge = (probability: number) => {
    if (probability >= 80) return { variant: "destructive", label: "Critical" };
    if (probability >= 60) return { variant: "default", label: "High" };
    if (probability >= 40) return { variant: "secondary", label: "Medium" };
    return { variant: "outline", label: "Normal" };
  };

  const getProbabilityCardStyle = (probability: number) => {
    if (probability >= 80) return "bg-red-50 border-red-200 shadow-md";
    if (probability >= 60) return "bg-orange-50 border-orange-200 shadow-sm";
    if (probability >= 40) return "bg-yellow-50 border-yellow-200 shadow-sm";
    return "bg-muted/30 border-border shadow-none";
  };

  const getProbabilityTextStyle = (probability: number) => {
    if (probability >= 80) return "text-red-900";
    if (probability >= 60) return "text-orange-900";
    if (probability >= 40) return "text-yellow-900";
    return "text-muted-foreground";
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
            const probabilityBadge = getProbabilityBadge(item.probability);
            const cardStyle = getProbabilityCardStyle(item.probability);
            const textStyle = getProbabilityTextStyle(item.probability);
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${cardStyle}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${textStyle}`} />
                    <span className={`font-medium text-sm ${textStyle}`}>{item.cause}</span>
                  </div>
                  <Badge variant={probabilityBadge.variant as any} className="text-xs">
                    {probabilityBadge.label}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Probability</span>
                    <span>{item.probability}%</span>
                  </div>
                  <Progress 
                    value={item.probability} 
                    className={`h-2 ${item.probability < 40 ? 'opacity-60' : ''}`}
                  />
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className={`text-xs font-medium mb-1 ${item.probability < 40 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        Description
                      </h4>
                      <p className={`text-xs ${item.probability < 40 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-xs font-medium mb-1 ${item.probability < 40 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {item.probability < 40 ? 'Routine Maintenance' : 'Recommended Action'}
                      </h4>
                      <p className={`text-xs ${item.probability < 40 ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {item.action}
                      </p>
                    </div>
                  </div>
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
