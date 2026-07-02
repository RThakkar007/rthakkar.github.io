import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
];

interface Props {
  value: string; // ISO datetime string "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: Props) {
  const today = startOfDay(new Date());

  const parsedDate = value ? new Date(value) : undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parsedDate);
  const [selectedTime, setSelectedTime] = useState<string>(
    parsedDate ? format(parsedDate, "HH:mm") : ""
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const [h, m] = selectedTime.split(":").map(Number);
      const dt = new Date(date);
      dt.setHours(h, m, 0, 0);
      onChange(format(dt, "yyyy-MM-dd'T'HH:mm"));
    } else if (date) {
      onChange(""); // date selected but no time yet
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [h, m] = time.split(":").map(Number);
      const dt = new Date(selectedDate);
      dt.setHours(h, m, 0, 0);
      onChange(format(dt, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  const isTimeDisabled = (time: string) => {
    if (!selectedDate) return false;
    const isToday = format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    if (!isToday) return false;
    const [h] = time.split(":").map(Number);
    return h <= new Date().getHours();
  };

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card/50 p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => isBefore(startOfDay(date), today)}
          fromDate={today}
          toDate={addDays(today, 30)}
          className="mx-auto"
          classNames={{
            months: "flex flex-col sm:flex-row gap-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-semibold text-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-primary/10 rounded-md transition-all flex items-center justify-center",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-primary/10 hover:text-primary transition-all aria-selected:opacity-100",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_today: "border border-primary/40 text-primary font-semibold",
            day_outside: "text-muted-foreground opacity-30",
            day_disabled: "text-muted-foreground opacity-20 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Pick a time for {format(selectedDate, "EEEE, MMM d")}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map(time => {
              const disabled = isTimeDisabled(time);
              const selected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && handleTimeSelect(time)}
                  className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : disabled
                      ? "border-border text-muted-foreground opacity-30 cursor-not-allowed"
                      : "border-border hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected summary */}
      {selectedDate && selectedTime && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-foreground font-medium">
            {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
          </span>
        </div>
      )}
    </div>
  );
}
