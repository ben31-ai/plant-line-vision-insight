import React, { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Plant, 
  Line, 
  Station, 
  Program, 
  Part, 
  plants, 
  lines, 
  stations, 
  programs, 
  parts, 
  Status 
} from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { X, CircleCheck, CircleX, AlertCircle } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  plantId: string | null;
  lineId: string | null;
  stationId: string | null;
  programId: string | null;
  partId: string | null;
  controllerStatus: Status | null;
  aiStatus: Status | null;
}

// Status options with display information
const statusOptions = [
  { value: 'ok', label: 'OK', icon: CircleCheck, color: 'text-green-500' },
  { value: 'warning', label: 'Warning', icon: AlertCircle, color: 'text-amber-500' },
  { value: 'error', label: 'Error', icon: CircleX, color: 'text-red-500' }
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    plantId: null,
    lineId: null,
    stationId: null,
    programId: null,
    partId: null,
    controllerStatus: null,
    aiStatus: null,
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
      controllerStatus: null,
      aiStatus: null,
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

  // Render status badge with appropriate color
  const renderStatusBadge = (status: Status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return null;
    
    const StatusIcon = statusOption.icon;
    
    return (
      <div className="flex items-center gap-1">
        <StatusIcon className={`h-3.5 w-3.5 ${statusOption.color}`} />
        <span>{statusOption.label}</span>
      </div>
    );
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
                <SelectItem value="all_plants">All Plants</SelectItem>
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
                <SelectItem value="all_lines">All Lines</SelectItem>
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
                <SelectItem value="all_stations">All Stations</SelectItem>
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
                <SelectItem value="all_programs">All Programs</SelectItem>
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
                <SelectItem value="all_parts">All Parts</SelectItem>
                {parts.map((part) => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Machine Status Filter */}
          <div>
            <Select
              value={filters.controllerStatus || ''}
              onValueChange={(value) => handleFilterChange('controllerStatus', value as Status || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Machine Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all_statuses">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <status.icon className={`h-4 w-4 ${status.color}`} />
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* AI Status Filter */}
          <div>
            <Select
              value={filters.aiStatus || ''}
              onValueChange={(value) => handleFilterChange('aiStatus', value as Status || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="AI Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all_ai_statuses">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-1.5">
                      <status.icon className={`h-4 w-4 ${status.color}`} />
                      <span>{status.label}</span>
                    </div>
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
            {filters.controllerStatus && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Machine Status: 
                {renderStatusBadge(filters.controllerStatus)}
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => handleFilterChange('controllerStatus', null)} 
                />
              </Badge>
            )}
            {filters.aiStatus && (
              <Badge variant="secondary" className="flex items-center gap-1">
                AI Status: 
                {renderStatusBadge(filters.aiStatus)}
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => handleFilterChange('aiStatus', null)} 
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
