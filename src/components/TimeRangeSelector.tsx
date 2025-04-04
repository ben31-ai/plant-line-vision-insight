
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (startDate: Date, endDate: Date) => void;
}

export const TimeRangeSelector = ({ startDate, endDate, onRangeChange }: TimeRangeSelectorProps) => {
  const [start, setStart] = React.useState<Date | undefined>(startDate);
  const [end, setEnd] = React.useState<Date | undefined>(endDate);
  const [calendarOpen, setCalendarOpen] = React.useState<boolean>(false);

  const handleRangeSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!start || (start && end)) {
      setStart(startOfDay(date));
      setEnd(undefined);
    } else {
      // Ensure end is not before start
      if (date < start) {
        setEnd(endOfDay(start));
        setStart(startOfDay(date));
      } else {
        setEnd(endOfDay(date));
      }
      
      // Close calendar after selecting range
      setTimeout(() => setCalendarOpen(false), 300);
    }
  };

  React.useEffect(() => {
    if (start && end) {
      onRangeChange(start, end);
    }
  }, [start, end, onRangeChange]);

  const presetRanges = [
    { label: "Today", days: 0 },
    { label: "Last 7 days", days: 7 },
    { label: "Last 14 days", days: 14 },
    { label: "Last 30 days", days: 30 },
  ];

  const selectPresetRange = (days: number) => {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(new Date(), days));
    setStart(start);
    setEnd(end);
    onRangeChange(start, end);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex space-x-2">
        {presetRanges.map((range) => (
          <Button
            key={range.label}
            variant="outline"
            size="sm"
            onClick={() => selectPresetRange(range.days)}
            className="text-xs md:text-sm"
          >
            {range.label}
          </Button>
        ))}
      </div>
      
      <div>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-xs md:text-sm flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {start && end ? (
                <>
                  {format(start, "MMM d, yyyy")} - {format(end, "MMM d, yyyy")}
                </>
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={start}
              selected={{
                from: start,
                to: end,
              }}
              onSelect={(range) => {
                if (range?.from) setStart(range.from);
                if (range?.to) setEnd(range.to);
                if (range?.from && range?.to) {
                  onRangeChange(range.from, range.to);
                  setTimeout(() => setCalendarOpen(false), 300);
                }
              }}
              numberOfMonths={2}
              className={cn("pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
