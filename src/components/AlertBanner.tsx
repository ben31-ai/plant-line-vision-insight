
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, X } from "lucide-react";
import { Button } from "./ui/button";

export interface AlertData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
}

interface AlertBannerProps {
  alerts: AlertData[];
  onDismiss: (id: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  if (!alerts.length) return null;
  
  const getAlertVariant = (type: AlertData["type"]) => {
    switch (type) {
      case "error": return "destructive";
      default: return "default";
    }
  };

  const getAlertIcon = (type: AlertData["type"]) => {
    switch (type) {
      case "error": return <AlertCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {alerts.map((alert) => (
        <Alert 
          key={alert.id} 
          variant={getAlertVariant(alert.type)}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {getAlertIcon(alert.type)}
            <div>
              <AlertTitle className="flex items-center gap-2">
                {alert.title}
                <Badge variant={alert.type === "error" ? "destructive" : "outline"}>
                  {alert.type}
                </Badge>
              </AlertTitle>
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDismiss(alert.id)} 
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </Alert>
      ))}
    </div>
  );
};
