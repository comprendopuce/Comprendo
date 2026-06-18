import { combineTimeValue, splitTimeValue } from "@/lib/datetime"

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

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

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

  const handleHourChange = (newHour: string) => {
    onTimeChange(combineTimeValue(newHour, minute || "00"))
  }

  const handleMinuteChange = (newMinute: string) => {
    onTimeChange(combineTimeValue(hour || "00", newMinute))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input
        type="date"
        value={dateValue}
        onChange={(e) => onDateChange(e.target.value)}
        aria-label={datePlaceholder}
        className={inputClassName}
      />
      <div className="flex items-center gap-1.5 min-w-0" aria-label={timePlaceholder}>
        <select
          value={hour}
          onChange={(e) => handleHourChange(e.target.value)}
          className={`${inputClassName} flex-1 min-w-0 cursor-pointer`}
        >
          <option value="">Hora</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-sm font-bold text-[#9E5A78] shrink-0">:</span>
        <select
          value={minute}
          onChange={(e) => handleMinuteChange(e.target.value)}
          className={`${inputClassName} flex-1 min-w-0 cursor-pointer`}
        >
          <option value="">Min</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
