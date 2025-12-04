"use client";

import * as React from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
  disabled,
  placeholder = "Select date and time",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(value || new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [hours, setHours] = React.useState(value ? value.getHours() : 12);
  const [minutes, setMinutes] = React.useState(value ? value.getMinutes() : 0);

  const today = startOfToday();
  const minSelectableDate = minDate || today;

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for the first day (0 = Sunday)
  const startDay = monthStart.getDay();

  // Create array for empty cells before month starts
  const emptyDays = Array(startDay).fill(null);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    const newDate = new Date(day);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(newHours);
      newDate.setMinutes(newMinutes);
      onChange(newDate);
    }
  };

  const handlePrevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const isDisabledDate = (day: Date) => {
    return isBefore(day, minSelectableDate) && !isSameDay(day, minSelectableDate);
  };

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    return format(value, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">
              {format(viewDate, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-muted-foreground h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="h-8 w-8" />
            ))}
            {daysInMonth.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, viewDate);
              const isDayToday = isToday(day);
              const isDisabled = isDisabledDate(day);

              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  size="icon"
                  disabled={isDisabled}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 p-0 font-normal",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    !isSelected && isDayToday && "bg-accent text-accent-foreground",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isDisabled && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {format(day, "d")}
                </Button>
              );
            })}
          </div>

          {/* Time Picker */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <select
                value={hours}
                onChange={(e) => handleTimeChange(parseInt(e.target.value), minutes)}
                className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-lg font-bold">:</span>
              <select
                value={minutes}
                onChange={(e) => handleTimeChange(hours, parseInt(e.target.value))}
                className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground ml-2">
                ({hours >= 12 ? "PM" : "AM"})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date();
                setSelectedDate(now);
                setHours(now.getHours());
                setMinutes(now.getMinutes());
                onChange(now);
              }}
              className="flex-1"
            >
              Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onChange(undefined);
                setSelectedDate(undefined);
                setOpen(false);
              }}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
