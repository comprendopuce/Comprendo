"use client"

import { es } from "date-fns/locale"
import { CalendarDays, Clock3 } from "lucide-react"
import { useMemo } from "react"
import TimePicker from "react-time-picker"

import * as Popover from "@radix-ui/react-popover"

import { Calendar } from "@/components/ui/calendar"
import { combineTimeValue, splitTimeValue } from "@/lib/datetime"

import "./fecha-hora-input.css"

interface FechaHoraInputProps {
  dateValue: string
  timeValue: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  datePlaceholder?: string
  timePlaceholder?: string
  inputClassName?: string
}

const defaultInputClass =
  "rounded-xl border border-[#F1D87C]/50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B9B95]/40 bg-white"

function formatDisplayLabel(dateValue: string, timeValue: string): string {
  const date = dateValue?.trim()
  const time = timeValue?.trim()
  if (!date && !time) return ""

  let dateLabel = ""
  if (date) {
    const [y, m, d] = date.split("-").map((v) => Number(v))
    const parsed = y && m && d ? new Date(y, m - 1, d) : new Date(date)
    dateLabel = Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })
  }

  if (!dateLabel) return time
  if (!time) return dateLabel
  return `${dateLabel} · ${time}`
}

export function FechaHoraInput({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  datePlaceholder = "Fecha",
  timePlaceholder = "Hora",
  inputClassName = defaultInputClass,
}: FechaHoraInputProps) {
  const { hour, minute } = splitTimeValue(timeValue)

  const selectedDate = useMemo(() => {
    if (!dateValue) return undefined
    const [y, m, d] = dateValue.split("-").map((v) => Number(v))
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }, [dateValue])

  const displayValue = useMemo(
    () => formatDisplayLabel(dateValue, timeValue),
    [dateValue, timeValue],
  )

  const timePickerValue = hour || minute ? combineTimeValue(hour || "00", minute || "00") : ""

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`${datePlaceholder} y ${timePlaceholder}`}
          className={`${inputClassName} w-full flex items-center justify-between gap-2 cursor-pointer text-left`}
        >
          <span className={`truncate ${displayValue ? "text-[#5B5B5B]" : "text-gray-400"}`}>
            {displayValue || "Selecciona fecha y hora"}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <CalendarDays className="h-4 w-4 text-[#9E5A78]" />
            <Clock3 className="h-4 w-4 text-[#5B9B95]" />
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="comprendo-datetime-picker z-50 w-[min(94vw,440px)] rounded-2xl border border-[#F1D87C]/50 bg-white p-4 shadow-xl"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-[#F1D87C]/40 bg-[#fdfdf1]/60 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-[#9E5A78]">
                <CalendarDays className="h-3.5 w-3.5" />
                {datePlaceholder}
              </p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => {
                    if (!day) return
                    const y = day.getFullYear()
                    const m = String(day.getMonth() + 1).padStart(2, "0")
                    const d = String(day.getDate()).padStart(2, "0")
                    onDateChange(`${y}-${m}-${d}`)
                  }}
                  locale={es}
                  className="p-0 bg-transparent"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#F1D87C]/40 bg-[#fdfdf1]/60 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-[#9E5A78]">
                <Clock3 className="h-3.5 w-3.5" />
                {timePlaceholder}
              </p>
              <TimePicker
                onChange={(v) => onTimeChange(typeof v === "string" ? v : "")}
                value={timePickerValue}
                disableClock={false}
                clearIcon={null}
                format="HH:mm"
                hourPlaceholder="HH"
                minutePlaceholder="MM"
              />
              <p className="mt-2 text-center text-[11px] text-[#5B5B5B]">
                Escribe la hora o toca el reloj para seleccionarla
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end border-t border-[#F1D87C]/30 pt-3">
            <Popover.Close asChild>
              <button
                type="button"
                className="rounded-xl bg-[#5B9B95] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a827d]"
              >
                Listo
              </button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
