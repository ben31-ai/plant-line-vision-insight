
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ChartControlsProps {
  xAxisMetric: string;
  setXAxisMetric: (value: string) => void;
  yAxisMetric: string;
  setYAxisMetric: (value: string) => void;
  zAxisMetric: string;
  setZAxisMetric: (value: string) => void;
  is3D: boolean;
  setIs3D: (value: boolean) => void;
  availableMetrics: string[];
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  xAxisMetric,
  setXAxisMetric,
  yAxisMetric,
  setYAxisMetric,
  zAxisMetric,
  setZAxisMetric,
  is3D,
  setIs3D,
  availableMetrics,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-5 mb-6">
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          X Axis
        </label>
        <Select
          value={xAxisMetric}
          onValueChange={setXAxisMetric}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select X axis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timestamp">Time</SelectItem>
            {availableMetrics.map((metric) => (
              <SelectItem key={`x-${metric}`} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Y Axis
        </label>
        <Select
          value={yAxisMetric}
          onValueChange={setYAxisMetric}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Y axis" />
          </SelectTrigger>
          <SelectContent>
            {availableMetrics.map((metric) => (
              <SelectItem key={`y-${metric}`} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Z Axis (Optional)
        </label>
        <Select
          value={zAxisMetric}
          onValueChange={setZAxisMetric}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Z axis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {availableMetrics
              .filter((metric) => metric !== yAxisMetric)
              .map((metric) => (
                <SelectItem key={`z-${metric}`} value={metric}>
                  {metric}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end">
        {zAxisMetric !== "none" && (
          <Button
            onClick={() => setIs3D(!is3D)}
            variant="outline"
            className="w-full"
          >
            {is3D ? "Switch to 2D" : "Switch to 3D"}
          </Button>
        )}
      </div>
    </div>
  );
};
