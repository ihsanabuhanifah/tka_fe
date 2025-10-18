

"use client";

import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";




export default function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    if (!value) {
      setTime("");
      return;
    }
    const hh = value.getHours().toString().padStart(2, "0");
    const mm = value.getMinutes().toString().padStart(2, "0");
    setTime(`${hh}:${mm}`);
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return onChange(null);
    const [hStr, mStr] = (time || "00:00").split(":");
    const newDate = new Date(date);
    newDate.setHours(Number(hStr), Number(mStr), 0, 0);
    onChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (!value) return;
    const [hStr, mStr] = newTime.split(":");
    const updated = new Date(value);
    updated.setHours(Number(hStr), Number(mStr), 0, 0);
    onChange(updated);
  };

  return (
    <div>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd MMMM yyyy HH:mm", { locale: id }) : "Pilih tanggal & waktu"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3 space-y-3" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleDateSelect}
            initialFocus
          />

          <div className="flex items-center gap-2">
            <Label className="text-sm">Jam</Label>
            <Input type="time" value={time} onChange={handleTimeChange} className="w-32" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTime("");
                if (value) {
                  const clone = new Date(value);
                  clone.setHours(0, 0, 0, 0);
                  onChange(clone);
                }
              }}
            >
              Reset jam
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
