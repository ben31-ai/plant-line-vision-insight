
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
  
  // Check for failures with enhanced details
  const failedProducts = products.filter(p => p.status === 'Failed');
  if (failedProducts.length > 2) {
    failedProducts.forEach((product, index) => {
      if (index < 3) { // Limite aux 3 premiers pour éviter le spam
        newAlerts.push({
          id: `failed-${product.id}-${Date.now()}`,
          title: 'Échec de Production Détecté',
          message: `Le produit ${product.serialNumber || product.id} a échoué lors de l'inspection.`,
          type: 'error',
          timestamp: new Date(),
          configurationName: 'Surveillance des Échecs',
          field: 'controllerStatus',
          evaluationMode: 'perProduct',
          operator: 'equal',
          threshold: 'Failed',
          actualValue: product.status,
          productId: product.serialNumber || product.id
        });
      }
    });
  }
  
  // Check for machine warnings with enhanced details
  const machineWarnings = products.filter(p => p.controllerStatus === 'Warning');
  if (machineWarnings.length > 0) {
    machineWarnings.forEach((product, index) => {
      if (index < 2) { // Limite aux 2 premiers
        newAlerts.push({
          id: `warning-${product.id}-${Date.now()}`,
          title: 'Alerte Machine Détectée',
          message: `Le contrôleur signale un avertissement pour le produit ${product.serialNumber || product.id}.`,
          type: 'warning',
          timestamp: new Date(),
          configurationName: 'Surveillance Contrôleur',
          field: 'controllerStatus',
          evaluationMode: 'perProduct',
          operator: 'equal',
          threshold: 'Warning',
          actualValue: product.controllerStatus,
          productId: product.serialNumber || product.id
        });
      }
    });
  }
  
  // Check for AI model retraining needed with enhanced details
  const aiNeedsRetraining = products.filter(p => p.aiStatus === 'NeedsRetraining');
  if (aiNeedsRetraining.length > 0) {
    const product = aiNeedsRetraining[0]; // Prendre le premier exemple
    newAlerts.push({
      id: `ai-${Date.now()}`,
      title: 'Mise à Jour IA Requise',
      message: `Le modèle IA nécessite un réentraînement basé sur les nouvelles données de production.`,
      type: 'info',
      timestamp: new Date(),
      configurationName: 'Surveillance IA',
      field: 'aiStatus',
      evaluationMode: 'aggregated',
      operator: 'equal',
      threshold: 'NeedsRetraining',
      actualValue: product.aiStatus,
      productId: product.serialNumber || product.id,
      aggregationType: 'count'
    });
  }

  return newAlerts;
};
