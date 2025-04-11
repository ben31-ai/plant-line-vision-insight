
import { subDays, addHours } from 'date-fns';

// Define types for our data structures
export type Status = 'ok' | 'warning' | 'error';

export interface Plant {
  id: string;
  name: string;
}

export interface Line {
  id: string;
  plantId: string;
  name: string;
}

export interface Station {
  id: string;
  lineId: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
}

export interface Part {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  serialNumber: string;
  timestamp: Date;
  plantId: string;
  lineId: string;
  stationId: string;
  programId: string;
  partId: string;
  controllerStatus: Status;
  aiStatus: Status;
}

export interface ProductDetail {
  id: string;
  serialNumber: string;
  timestamp: Date;
  plantId: string;
  lineId: string;
  stationId: string;
  programId: string;
  partId: string;
  controllerStatus: Status;
  aiStatus: Status;
  timeSeries: TimeSeriesPoint[];
  images: string[];
  parameters: Record<string, any>;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  metric: string;
}

export interface MetricsData {
  totalProducts: number;
  controllerOkPercentage: number;
  aiOkPercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MLInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

// Generate mock data
export const plants: Plant[] = [
  { id: 'p1', name: 'Plant Alpha' },
  { id: 'p2', name: 'Plant Beta' },
  { id: 'p3', name: 'Plant Gamma' },
];

export const lines: Line[] = [
  { id: 'l1', plantId: 'p1', name: 'Line 1' },
  { id: 'l2', plantId: 'p1', name: 'Line 2' },
  { id: 'l3', plantId: 'p2', name: 'Line 1' },
  { id: 'l4', plantId: 'p3', name: 'Line 1' },
];

export const stations: Station[] = [
  { id: 's1', lineId: 'l1', name: 'Assembly' },
  { id: 's2', lineId: 'l1', name: 'Testing' },
  { id: 's3', lineId: 'l2', name: 'Assembly' },
  { id: 's4', lineId: 'l3', name: 'Assembly' },
  { id: 's5', lineId: 'l4', name: 'Assembly' },
];

export const programs: Program[] = [
  { id: 'pr1', name: 'Program A' },
  { id: 'pr2', name: 'Program B' },
  { id: 'pr3', name: 'Program C' },
];

export const parts: Part[] = [
  { id: 'pa1', name: 'Part X100' },
  { id: 'pa2', name: 'Part X200' },
  { id: 'pa3', name: 'Part Y300' },
];

function generateRandomStatus(): Status {
  const rand = Math.random();
  if (rand > 0.85) return 'error';
  if (rand > 0.7) return 'warning';
  return 'ok';
}

// Generate 100 mock products
export const products: Product[] = Array.from({ length: 100 }).map((_, i) => {
  const plantId = plants[Math.floor(Math.random() * plants.length)].id;
  const availableLines = lines.filter(l => l.plantId === plantId);
  const lineId = availableLines[Math.floor(Math.random() * availableLines.length)].id;
  const availableStations = stations.filter(s => s.lineId === lineId);
  const stationId = availableStations[Math.floor(Math.random() * availableStations.length)].id;
  const programId = programs[Math.floor(Math.random() * programs.length)].id;
  const partId = parts[Math.floor(Math.random() * parts.length)].id;
  
  return {
    id: `prod-${i}`,
    serialNumber: `SN-${10000 + i}`,
    timestamp: subDays(new Date(), Math.floor(Math.random() * 14)),
    plantId,
    lineId,
    stationId,
    programId,
    partId,
    controllerStatus: generateRandomStatus(),
    aiStatus: generateRandomStatus(),
  };
});

function generateTimeSeriesData(length: number, metric: string): TimeSeriesPoint[] {
  const baseTime = subDays(new Date(), 1);
  return Array.from({ length }).map((_, i) => ({
    timestamp: addHours(baseTime, i),
    value: 50 + Math.random() * 50 * Math.sin(i / 5),
    metric,
  }));
}

// Generate detailed data for each product
export const productDetails: Record<string, ProductDetail> = products.reduce((acc, product) => {
  acc[product.id] = {
    ...product,
    timeSeries: [
      ...generateTimeSeriesData(24, 'Temperature'),
      ...generateTimeSeriesData(24, 'Pressure'),
      ...generateTimeSeriesData(24, 'Vibration'),
    ],
    images: [
      'https://via.placeholder.com/800x600.png?text=Product+Image+1',
      'https://via.placeholder.com/800x600.png?text=Product+Image+2',
    ],
    parameters: {
      speed: Math.round(Math.random() * 100),
      torque: Math.round(Math.random() * 50),
      cycle_time: Math.round(40 + Math.random() * 20),
      material: ['Steel', 'Aluminum', 'Composite'][Math.floor(Math.random() * 3)],
    },
  };
  return acc;
}, {} as Record<string, ProductDetail>);

// Generate mock ML insights
export const mlInsights: MLInsight[] = [
  {
    id: 'ins1',
    title: 'Anomaly Pattern Detected',
    description: 'Machine learning model has identified a recurring pattern of anomalies in Line 2 during the afternoon shift.',
    severity: 'warning',
    timestamp: subDays(new Date(), 2),
  },
  {
    id: 'ins2',
    title: 'Predictive Maintenance Alert',
    description: 'Based on vibration patterns, Station Assembly in Line 1 may need maintenance within the next 48 hours.',
    severity: 'critical',
    timestamp: subDays(new Date(), 1),
  },
  {
    id: 'ins3',
    title: 'Process Optimization Opportunity',
    description: 'Analysis shows that reducing cycle time by 3% is achievable with current equipment by adjusting parameters.',
    severity: 'info',
    timestamp: new Date(),
  },
];

export function getFilteredProducts(
  timeStart: Date,
  timeEnd: Date,
  plantId?: string,
  lineId?: string,
  stationId?: string,
  programId?: string,
  partId?: string,
  controllerStatus?: Status,
  aiStatus?: Status
): Product[] {
  return products.filter(product => {
    // Time filter
    if (product.timestamp < timeStart || product.timestamp > timeEnd) return false;
    
    // Optional filters
    if (plantId && product.plantId !== plantId) return false;
    if (lineId && product.lineId !== lineId) return false;
    if (stationId && product.stationId !== stationId) return false;
    if (programId && product.programId !== programId) return false;
    if (partId && product.partId !== partId) return false;
    
    // Status filters
    if (controllerStatus && product.controllerStatus !== controllerStatus) return false;
    if (aiStatus && product.aiStatus !== aiStatus) return false;
    
    return true;
  });
}

export function getMetrics(products: Product[]): MetricsData {
  if (products.length === 0) {
    return {
      totalProducts: 0,
      controllerOkPercentage: 0,
      aiOkPercentage: 0,
      trend: 'stable'
    };
  }
  
  const controllerOkCount = products.filter(p => p.controllerStatus === 'ok').length;
  const aiOkCount = products.filter(p => p.aiStatus === 'ok').length;
  
  return {
    totalProducts: products.length,
    controllerOkPercentage: Math.round((controllerOkCount / products.length) * 100),
    aiOkPercentage: Math.round((aiOkCount / products.length) * 100),
    trend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
  };
}
