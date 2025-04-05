
import { TimeSeriesPoint } from "@/utils/mockData";

// Define the API response types
export interface ApiResponse {
  timeSeries: TimeSeriesPoint[];
  availableMetrics: string[];
}

// Function to fetch time series data from the API
export const fetchTimeSeriesData = async (): Promise<ApiResponse> => {
  try {
    // Replace this URL with your actual API endpoint
    const response = await fetch('https://api.example.com/timeseries');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching time series data:', error);
    // Return mock data as fallback
    return {
      timeSeries: [],
      availableMetrics: []
    };
  }
};
