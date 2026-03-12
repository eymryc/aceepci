"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/** Dropdown personnalisé : masque le select natif, n'affiche que le caption pour éviter le doublon */
function CustomDropdown(props: {
  name?: string;
  "aria-label"?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  children?: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { className, style, caption, children, ...selectProps } = props;
  return (
    <div className={cn("relative", className)} style={style}>
      <select
        {...selectProps}
        className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        aria-label={props["aria-label"]}
      >
        {children}
      </select>
      <div className="flex items-center justify-between gap-1 px-3 py-1.5 text-sm font-medium" aria-hidden>
        {caption}
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </div>
    </div>
  );
}

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /** Autoriser la sélection de dates futures (ex. pour les événements). Par défaut : false (dates passées uniquement, ex. date de naissance). */
  allowFuture?: boolean;
  "aria-label"?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "jj / mm / aaaa",
  className,
  disabled,
  allowFuture = false,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const date = value ? new Date(value + "T12:00:00") : undefined;

  const handleSelect = (d: Date | undefined) => {
    if (!d) return;
    const iso = format(d, "yyyy-MM-dd");
    onChange?.(iso);
    setOpen(false);
  };

  const displayValue = date ? format(date, "dd/MM/yyyy", { locale: fr }) : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-[52px] px-4",
            !displayValue && "text-muted-foreground",
            className
          )}
          aria-label={ariaLabel}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="flex-1">{displayValue || placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={allowFuture ? undefined : (d) => d > new Date()}
          captionLayout="dropdown-buttons"
          fromYear={allowFuture ? new Date().getFullYear() - 2 : 1920}
          toYear={allowFuture ? new Date().getFullYear() + 10 : new Date().getFullYear()}
          locale={fr}
          labels={{
            labelMonthDropdown: () => "Mois",
            labelYearDropdown: () => "Année",
          }}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Dropdown: CustomDropdown as any,
          }}
          classNames={{
            vhidden: "sr-only",
            caption: "flex justify-center pt-1 pb-3 relative items-center w-full gap-2",
            caption_dropdowns: "flex items-center gap-2",
            dropdown_month: "min-w-[6rem] border border-border rounded-md bg-background hover:bg-muted/50 cursor-pointer",
            dropdown_year: "min-w-[5rem] border border-border rounded-md bg-background hover:bg-muted/50 cursor-pointer",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
