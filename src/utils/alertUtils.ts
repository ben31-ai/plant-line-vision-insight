import { AlertData } from "@/components/AlertBanner";
import { plants, lines, stations, programs, parts } from "./mockData";

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
  secondValue?: string; // for "between" and "notBetween" operators
  emails: string[];
  enabled: boolean;
  muted: boolean;
  triggerCount: number;
  evaluationMode: "perProduct" | "aggregated" | "timeBased";
  timeInterval?: number; // in minutes
  aggregationType?: "count" | "average" | "min" | "max" | "percentage";
  aggregationThreshold?: number; // threshold for aggregated checks
  lastChecked?: Date;
  // New filtering properties
  plantId?: string; // Filter by specific plant
  lineId?: string; // Filter by specific line
  stationId?: string; // Filter by specific station
  programId?: string; // Filter by specific program
  partId?: string; // Filter by specific part
}

let alertConfigurations: AlertConfiguration[] = [];

// Time-based checking intervals
const intervalTimers = new Map<string, NodeJS.Timeout>();

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
    // Clear existing timer if it exists
    const existingTimer = intervalTimers.get(config.id);
    if (existingTimer) {
      clearInterval(existingTimer);
    }
    
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
  
  // Setup time-based checking if needed
  if (config.evaluationMode === "timeBased" && config.timeInterval && config.enabled) {
    setupTimeBasedChecking(config);
  }
  
  // In a real app, this would be persisted to a database
}

export function deleteAlertConfiguration(id: string): void {
  // Clear timer if it exists
  const timer = intervalTimers.get(id);
  if (timer) {
    clearInterval(timer);
    intervalTimers.delete(id);
  }
  
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

// Setup time-based checking for a configuration
function setupTimeBasedChecking(config: AlertConfiguration): void {
  if (!config.timeInterval || config.timeInterval <= 0) return;
  
  const intervalMs = config.timeInterval * 60 * 1000; // Convert minutes to milliseconds
  
  const timer = setInterval(() => {
    if (config.enabled && !config.muted) {
      // In a real app, this would fetch current product data
      // For now, we'll simulate with mock data
      checkConfigurationAgainstProducts(config, getMockProducts());
    }
  }, intervalMs);
  
  intervalTimers.set(config.id, timer);
}

// Mock function to simulate getting current products with filters applied
function getMockProducts(): any[] {
  // In a real app, this would fetch from your data source
  return [
    { id: 1, serialNumber: "SN001", controllerStatus: "Warning", temperature: 85, pressure: 120, plantId: "p1", lineId: "l1", stationId: "s1", programId: "pr1", partId: "pa1" },
    { id: 2, serialNumber: "SN002", controllerStatus: "OK", temperature: 70, pressure: 100, plantId: "p1", lineId: "l2", stationId: "s3", programId: "pr2", partId: "pa2" },
    { id: 3, serialNumber: "SN003", controllerStatus: "Error", temperature: 95, pressure: 140, plantId: "p2", lineId: "l3", stationId: "s4", programId: "pr1", partId: "pa3" }
  ];
}

// Process product status changes against alert configurations
export function checkProductsForAlerts(
  products: any[],
  alertCallback: (alert: AlertData) => void
): void {
  // Skip if no configurations are active
  if (!alertConfigurations.some(c => c.enabled)) return;
  
  const activeConfigs = alertConfigurations.filter(c => c.enabled && c.evaluationMode !== "timeBased");
  
  for (const config of activeConfigs) {
    checkConfigurationAgainstProducts(config, products, alertCallback);
  }
}

// Check a single configuration against products with filtering
function checkConfigurationAgainstProducts(
  config: AlertConfiguration, 
  products: any[], 
  alertCallback?: (alert: AlertData) => void
): void {
  
  // Apply location and program filters
  const filteredProducts = products.filter(product => {
    if (config.plantId && product.plantId !== config.plantId) return false;
    if (config.lineId && product.lineId !== config.lineId) return false;
    if (config.stationId && product.stationId !== config.stationId) return false;
    if (config.programId && product.programId !== config.programId) return false;
    if (config.partId && product.partId !== config.partId) return false;
    return true;
  });

  if (filteredProducts.length === 0) return; // No products match the filters
  
  if (config.evaluationMode === "perProduct") {
    checkPerProductMode(config, filteredProducts, alertCallback);
  } else if (config.evaluationMode === "aggregated") {
    checkAggregatedMode(config, filteredProducts, alertCallback);
  }
  
  // Update last checked time
  config.lastChecked = new Date();
}

// Check each product individually
function checkPerProductMode(
  config: AlertConfiguration, 
  products: any[], 
  alertCallback?: (alert: AlertData) => void
): void {
  for (const product of products) {
    const shouldTrigger = evaluateProductCondition(product, config);
    
    if (shouldTrigger) {
      config.triggerCount += 1;
      
      if (!config.muted) {
        const locationInfo = getLocationInfo(config);
        const alert = createAlert(
          `${config.name} Alert`,
          `Product ${product.serialNumber} triggered alert for ${config.type}${locationInfo}: ${config.operator} ${config.value}${config.secondValue ? ` and ${config.secondValue}` : ''}`,
          "warning"
        );
        
        if (alertCallback) {
          alertCallback(alert);
        } else {
          setGlobalAlert(alert);
        }
        sendAlertEmails(config, alert);
      }
    }
  }
}

// Check aggregated conditions across filtered products
function checkAggregatedMode(
  config: AlertConfiguration, 
  products: any[], 
  alertCallback?: (alert: AlertData) => void
): void {
  if (!config.aggregationType || config.aggregationThreshold === undefined) return;
  
  let aggregatedValue = 0;
  const matchingProducts = products.filter(product => evaluateProductCondition(product, config));
  
  switch (config.aggregationType) {
    case "count":
      aggregatedValue = matchingProducts.length;
      break;
    case "percentage":
      aggregatedValue = (matchingProducts.length / products.length) * 100;
      break;
    case "average":
      if (matchingProducts.length > 0) {
        const sum = matchingProducts.reduce((acc, product) => acc + getProductFieldValue(product, config.type), 0);
        aggregatedValue = sum / matchingProducts.length;
      }
      break;
    case "min":
      if (matchingProducts.length > 0) {
        aggregatedValue = Math.min(...matchingProducts.map(product => getProductFieldValue(product, config.type)));
      }
      break;
    case "max":
      if (matchingProducts.length > 0) {
        aggregatedValue = Math.max(...matchingProducts.map(product => getProductFieldValue(product, config.type)));
      }
      break;
  }
  
  if (aggregatedValue >= config.aggregationThreshold) {
    config.triggerCount += 1;
    
    if (!config.muted) {
      const locationInfo = getLocationInfo(config);
      const alert = createAlert(
        `${config.name} Aggregated Alert`,
        `${config.aggregationType} value (${aggregatedValue.toFixed(1)}) exceeded threshold of ${config.aggregationThreshold} for ${config.type}${locationInfo}`,
        "warning"
      );
      
      if (alertCallback) {
        alertCallback(alert);
      } else {
        setGlobalAlert(alert);
      }
      sendAlertEmails(config, alert);
    }
  }
}

// Helper function to get location information for alerts
function getLocationInfo(config: AlertConfiguration): string {
  const locationParts = [];
  
  if (config.plantId) {
    const plant = plants.find(p => p.id === config.plantId);
    if (plant) locationParts.push(`Plant: ${plant.name}`);
  }
  
  if (config.lineId) {
    const line = lines.find(l => l.id === config.lineId);
    if (line) locationParts.push(`Line: ${line.name}`);
  }
  
  if (config.stationId) {
    const station = stations.find(s => s.id === config.stationId);
    if (station) locationParts.push(`Station: ${station.name}`);
  }
  
  if (config.programId) {
    const program = programs.find(p => p.id === config.programId);
    if (program) locationParts.push(`Program: ${program.name}`);
  }
  
  if (config.partId) {
    const part = parts.find(p => p.id === config.partId);
    if (part) locationParts.push(`Part: ${part.name}`);
  }
  
  return locationParts.length > 0 ? ` (${locationParts.join(', ')})` : '';
}

// Get field value from product
function getProductFieldValue(product: any, fieldType: string): number {
  switch (fieldType) {
    case "temperature":
      return Number(product.temperature) || 0;
    case "pressure":
      return Number(product.pressure) || 0;
    default:
      return 0;
  }
}

// Evaluate a single product against a configuration
function evaluateProductCondition(product: any, config: AlertConfiguration): boolean {
  let fieldValue: any;
  
  switch (config.type) {
    case "controllerStatus":
      fieldValue = product.controllerStatus;
      break;
    case "aiStatus":
      fieldValue = product.aiStatus;
      break;
    case "temperature":
      fieldValue = product.temperature;
      break;
    case "pressure":
      fieldValue = product.pressure;
      break;
    case "serialNumber":
      fieldValue = product.serialNumber;
      break;
    case "partNumber":
      fieldValue = product.partNumber;
      break;
    default:
      return false;
  }
  
  return evaluateCondition(fieldValue, config.operator, config.value, config.secondValue);
}

// Helper function to evaluate conditions based on operator
function evaluateCondition(fieldValue: any, operator: string, value: string, secondValue?: string): boolean {
  const fieldStr = String(fieldValue);
  const fieldNum = Number(fieldValue);
  
  switch (operator) {
    case "equal":
      return fieldValue === value;
    case "notEqual":
      return fieldValue !== value;
    case "contains":
      return fieldStr.toLowerCase().includes(value.toLowerCase());
    case "notContains":
      return !fieldStr.toLowerCase().includes(value.toLowerCase());
    case "greater":
      return fieldNum > Number(value);
    case "less":
      return fieldNum < Number(value);
    case "greaterOrEqual":
      return fieldNum >= Number(value);
    case "lessOrEqual":
      return fieldNum <= Number(value);
    case "between":
      if (secondValue) {
        const numValue = fieldNum;
        return numValue >= Number(value) && numValue <= Number(secondValue);
      }
      return false;
    case "notBetween":
      if (secondValue) {
        const numValue = fieldNum;
        return !(numValue >= Number(value) && numValue <= Number(secondValue));
      }
      return false;
    case "regex":
      try {
        const regex = new RegExp(value, 'i');
        return regex.test(fieldStr);
      } catch (e) {
        console.error('Invalid regex pattern:', value);
        return false;
      }
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

// Cleanup function to clear all timers
export function cleanupTimeBasedChecking(): void {
  intervalTimers.forEach((timer) => {
    clearInterval(timer);
  });
  intervalTimers.clear();
}

// Export the AlertConfiguration type
export type { AlertConfiguration };
