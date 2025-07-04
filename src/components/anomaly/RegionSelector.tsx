
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
}) => {
  const regions = [
    { value: "all", label: "All Data" },
    { value: "startup", label: "Startup Phase" },
    { value: "steady", label: "Steady State" },
    { value: "shutdown", label: "Shutdown Phase" },
    { value: "anomaly", label: "Anomalous Regions" },
  ];

  return (
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
  );
};
