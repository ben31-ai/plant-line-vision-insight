
import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plant, Line, Station, Program, Part, plants, lines, stations, programs, parts } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  plantId: string | null;
  lineId: string | null;
  stationId: string | null;
  programId: string | null;
  partId: string | null;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    plantId: null,
    lineId: null,
    stationId: null,
    programId: null,
    partId: null,
  });
  
  const [availableLines, setAvailableLines] = useState<Line[]>([]);
  const [availableStations, setAvailableStations] = useState<Station[]>([]);
  
  // Update available lines based on selected plant
  useEffect(() => {
    if (filters.plantId) {
      const plantLines = lines.filter(line => line.plantId === filters.plantId);
      setAvailableLines(plantLines);
      if (!plantLines.some(line => line.id === filters.lineId)) {
        // Reset line selection if current line doesn't belong to selected plant
        setFilters(prev => ({ ...prev, lineId: null, stationId: null }));
      }
    } else {
      setAvailableLines(lines);
    }
  }, [filters.plantId]);
  
  // Update available stations based on selected line
  useEffect(() => {
    if (filters.lineId) {
      const lineStations = stations.filter(station => station.lineId === filters.lineId);
      setAvailableStations(lineStations);
      if (!lineStations.some(station => station.id === filters.stationId)) {
        // Reset station selection if current station doesn't belong to selected line
        setFilters(prev => ({ ...prev, stationId: null }));
      }
    } else {
      setAvailableStations(stations);
    }
  }, [filters.lineId]);
  
  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const handleFilterChange = (filterName: keyof FilterState, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      // Reset dependent filters when parent filter changes
      ...(filterName === 'plantId' ? { lineId: null, stationId: null } : {}),
      ...(filterName === 'lineId' ? { stationId: null } : {})
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      plantId: null,
      lineId: null,
      stationId: null,
      programId: null,
      partId: null,
    });
  };
  
  const getSelectedName = (id: string | null, items: { id: string, name: string }[]): string => {
    if (!id) return '';
    const item = items.find(item => item.id === id);
    return item ? item.name : '';
  };
  
  const getActiveFiltersCount = (): number => {
    return Object.values(filters).filter(value => value !== null).length;
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Plant Filter */}
          <div>
            <Select
              value={filters.plantId || ''}
              onValueChange={(value) => handleFilterChange('plantId', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Plant" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All Plants</SelectItem>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Line Filter */}
          <div>
            <Select
              value={filters.lineId || ''}
              onValueChange={(value) => handleFilterChange('lineId', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Line" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All Lines</SelectItem>
                {availableLines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Station Filter */}
          <div>
            <Select
              value={filters.stationId || ''}
              onValueChange={(value) => handleFilterChange('stationId', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Station" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All Stations</SelectItem>
                {availableStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Program Filter */}
          <div>
            <Select
              value={filters.programId || ''}
              onValueChange={(value) => handleFilterChange('programId', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All Programs</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Part Filter */}
          <div>
            <Select
              value={filters.partId || ''}
              onValueChange={(value) => handleFilterChange('partId', value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Part" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="">All Parts</SelectItem>
                {parts.map((part) => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.plantId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Plant: {getSelectedName(filters.plantId, plants)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('plantId', null)} 
                />
              </Badge>
            )}
            {filters.lineId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Line: {getSelectedName(filters.lineId, lines)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('lineId', null)} 
                />
              </Badge>
            )}
            {filters.stationId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Station: {getSelectedName(filters.stationId, stations)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('stationId', null)} 
                />
              </Badge>
            )}
            {filters.programId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Program: {getSelectedName(filters.programId, programs)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('programId', null)} 
                />
              </Badge>
            )}
            {filters.partId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Part: {getSelectedName(filters.partId, parts)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('partId', null)} 
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
