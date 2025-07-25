import { AlertData } from "@/components/AlertBanner";

// In-memory storage for alerts (would normally be stored in context or redux)
let globalAlerts: AlertData[] = [];
let globalNotificationCount: number = 0;

// Alert configurations storage
interface AlertConfiguration {
  id: string;
  name: string;
  type: "controllerStatus" | "aiStatus" | "temperature" | "pressure" | "serialNumber" | "partNumber";
  condition: string;
  operator: string;
  value: string;
  secondValue?: string; // for "between" operator
  emails: string[];
  enabled: boolean;
  muted: boolean;
  triggerCount: number;
}

let alertConfigurations: AlertConfiguration[] = [];

export function setGlobalAlert(alert: AlertData): void {
  // Add new alert
  globalAlerts = [...globalAlerts, alert];
  
  // Increase notification count
  globalNotificationCount++;
  
  // Process alert through configurations
  checkAlertAgainstConfigurations(alert);
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

export function getNotificationCount(): number {
  return globalNotificationCount;
}

export function resetNotificationCount(): void {
  globalNotificationCount = 0;
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

// Alert configuration management
export function saveAlertConfiguration(config: AlertConfiguration): void {
  const index = alertConfigurations.findIndex(c => c.id === config.id);
  
  if (index >= 0) {
    // Update existing configuration
    alertConfigurations = [
      ...alertConfigurations.slice(0, index),
      config,
      ...alertConfigurations.slice(index + 1)
    ];
  } else {
    // Add new configuration
    alertConfigurations = [...alertConfigurations, config];
  }
  
  // In a real app, this would be persisted to a database
}

export function deleteAlertConfiguration(id: string): void {
  alertConfigurations = alertConfigurations.filter(config => config.id !== id);
}

export function getAlertConfigurations(): AlertConfiguration[] {
  return [...alertConfigurations];
}

export function toggleAlertMute(id: string, muted: boolean): void {
  const index = alertConfigurations.findIndex(c => c.id === id);
  
  if (index >= 0) {
    alertConfigurations[index].muted = muted;
  }
}

export function resetAlertCount(id: string): void {
  const index = alertConfigurations.findIndex(c => c.id === id);
  
  if (index >= 0) {
    alertConfigurations[index].triggerCount = 0;
  }
}

// Process product status changes against alert configurations
export function checkProductsForAlerts(
  products: any[],
  alertCallback: (alert: AlertData) => void
): void {
  // Skip if no configurations are active
  if (!alertConfigurations.some(c => c.enabled)) return;
  
  const activeConfigs = alertConfigurations.filter(c => c.enabled);
  
  for (const product of products) {
    for (const config of activeConfigs) {
      let shouldTrigger = false;
      
      // Check different field types based on operator
      if (config.type === "controllerStatus") {
        shouldTrigger = evaluateCondition(product.controllerStatus, config.operator, config.value, config.secondValue);
      } else if (config.type === "aiStatus") {
        shouldTrigger = evaluateCondition(product.aiStatus, config.operator, config.value, config.secondValue);
      } else if (config.type === "temperature") {
        shouldTrigger = evaluateCondition(product.temperature, config.operator, config.value, config.secondValue);
      } else if (config.type === "pressure") {
        shouldTrigger = evaluateCondition(product.pressure, config.operator, config.value, config.secondValue);
      } else if (config.type === "serialNumber") {
        shouldTrigger = evaluateCondition(product.serialNumber, config.operator, config.value, config.secondValue);
      } else if (config.type === "partNumber") {
        shouldTrigger = evaluateCondition(product.partNumber, config.operator, config.value, config.secondValue);
      }
      
      if (shouldTrigger) {
        // Increment trigger count
        config.triggerCount += 1;
        
        // Only create an alert if not muted
        if (!config.muted) {
          const alert = createAlert(
            `${config.name} Alert`,
            `Product ${product.serialNumber} triggered alert for ${config.type}: ${config.operator} ${config.value}${config.secondValue ? ` and ${config.secondValue}` : ''}`,
            "warning"
          );
          
          alertCallback(alert);
          sendAlertEmails(config, alert);
        }
      }
    }
  }
}

// Helper function to evaluate conditions based on operator
function evaluateCondition(fieldValue: any, operator: string, value: string, secondValue?: string): boolean {
  switch (operator) {
    case "equal":
      return fieldValue === value;
    case "contains":
      return String(fieldValue).toLowerCase().includes(value.toLowerCase());
    case "greater":
      return Number(fieldValue) > Number(value);
    case "less":
      return Number(fieldValue) < Number(value);
    case "greaterOrEqual":
      return Number(fieldValue) >= Number(value);
    case "lessOrEqual":
      return Number(fieldValue) <= Number(value);
    case "between":
      if (secondValue) {
        const numValue = Number(fieldValue);
        return numValue >= Number(value) && numValue <= Number(secondValue);
      }
      return false;
    default:
      return false;
  }
}

// Helper function to check a specific alert against configurations
function checkAlertAgainstConfigurations(alert: AlertData): void {
  // In a real app, this would analyze the alert and process it based on configurations
  console.log("Processing alert:", alert);
}

// Send emails (simulated)
function sendAlertEmails(config: AlertConfiguration, alert: AlertData): void {
  if (config.emails && config.emails.length > 0) {
    console.log(`[Email Simulation] Sending alert "${alert.title}" to:`, config.emails);
    console.log("Email body:", alert.message);
    
    // In a real app, this would call an API to send emails
  }
}
