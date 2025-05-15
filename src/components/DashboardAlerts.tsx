
import React from "react";
import { AlertBanner, AlertData } from "./AlertBanner";
import { checkProductsForAlerts, setGlobalAlert } from "@/utils/alertUtils";

interface DashboardAlertsProps {
  products: any[];
  alerts: AlertData[];
  onDismissAlert: (id: string) => void;
}

export const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ 
  products, 
  alerts,
  onDismissAlert 
}) => {
  // Check products against alert configurations
  React.useEffect(() => {
    checkProductsForAlerts(products, (alert) => {
      setGlobalAlert(alert);
    });
  }, [products]);

  if (!alerts || alerts.length === 0) return null;

  return (
    <AlertBanner alerts={alerts} onDismiss={onDismissAlert} />
  );
};

export const checkStatusForAlerts = (products: any[]): AlertData[] => {
  const newAlerts: AlertData[] = [];
  
  // Check for failures
  const failedProducts = products.filter(p => p.status === 'Failed');
  if (failedProducts.length > 2) {
    newAlerts.push({
      id: `failed-${Date.now()}`,
      title: 'High Failure Rate',
      message: `${failedProducts.length} products failed in the selected time period.`,
      type: 'error',
      timestamp: new Date()
    });
  }
  
  // Check for machine warnings
  const machineWarnings = products.filter(p => p.controllerStatus === 'Warning');
  if (machineWarnings.length > 0) {
    newAlerts.push({
      id: `warning-${Date.now()}`,
      title: 'Machine Warning',
      message: `${machineWarnings.length} machine warnings detected.`,
      type: 'warning',
      timestamp: new Date()
    });
  }
  
  // Check for AI model retraining needed
  const aiNeedsRetraining = products.some(p => p.aiStatus === 'NeedsRetraining');
  if (aiNeedsRetraining) {
    newAlerts.push({
      id: `ai-${Date.now()}`,
      title: 'AI Model Update Required',
      message: 'One or more AI models need retraining with new data.',
      type: 'info',
      timestamp: new Date()
    });
  }

  return newAlerts;
};
