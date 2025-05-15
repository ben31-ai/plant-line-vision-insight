
import { AlertData } from "@/components/AlertBanner";

// In-memory storage for alerts (would normally be stored in context or redux)
let globalAlerts: AlertData[] = [];

export function setGlobalAlert(alert: AlertData): void {
  // Add new alert
  globalAlerts = [...globalAlerts, alert];
}

export function setGlobalAlerts(alerts: AlertData[]): void {
  globalAlerts = [...alerts];
}

export function getGlobalAlerts(): AlertData[] {
  return [...globalAlerts];
}

export function removeGlobalAlert(id: string): void {
  globalAlerts = globalAlerts.filter(alert => alert.id !== id);
}

export function clearGlobalAlerts(): void {
  globalAlerts = [];
}

// Helper function to create alerts from different parts of the app
export function createAlert(
  title: string, 
  message: string, 
  type: AlertData["type"] = "info"
): AlertData {
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title,
    message,
    type,
    timestamp: new Date()
  };
}
