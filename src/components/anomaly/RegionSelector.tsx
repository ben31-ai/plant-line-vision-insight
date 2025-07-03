
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  timeRange: { start: number; end: number };
  onTimeRangeChange: (range: { start: number; end: number }) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
  timeRange,
  onTimeRangeChange,
}) => {
  const regions = [
    { value: "all", label: "All Data" },
    { value: "startup", label: "Startup Phase" },
    { value: "steady", label: "Steady State" },
    { value: "shutdown", label: "Shutdown Phase" },
    { value: "anomaly", label: "Anomalous Regions" },
  ];

  const handleTimeRangeChange = (values: number[]) => {
    onTimeRangeChange({ start: values[0], end: values[1] });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Analysis Region</Label>
        <Select value={selectedRegion} onValueChange={onRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select analysis region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Time Range (%)</Label>
        <div className="px-2">
          <Slider
            value={[timeRange.start, timeRange.end]}
            onValueChange={handleTimeRangeChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{timeRange.start}%</span>
            <span>{timeRange.end}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
