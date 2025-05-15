
import React from "react";
import { FilterPanel, FilterState } from "./FilterPanel";
import { TimeRangeSelector } from "./TimeRangeSelector";

interface DashboardTimeFiltersProps {
  startDate: Date;
  endDate: Date;
  filters: FilterState;
  onTimeRangeChange: (start: Date, end: Date) => void;
  onFilterChange: (newFilters: FilterState) => void;
}

export const DashboardTimeFilters: React.FC<DashboardTimeFiltersProps> = ({
  startDate,
  endDate,
  filters,
  onTimeRangeChange,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Time Range Selector with Timezone */}
      <div>
        <h2 className="text-lg font-medium mb-3">Time Range</h2>
        <TimeRangeSelector 
          startDate={startDate}
          endDate={endDate}
          onRangeChange={onTimeRangeChange}
        />
      </div>
      
      {/* Filters */}
      <div>
        <h2 className="text-lg font-medium mb-3">Process Filters</h2>
        <FilterPanel onFilterChange={onFilterChange} />
      </div>
    </div>
  );
};
