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
  "rounded-xl border border-[#F1D87C]/50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B9B95]/40"

export function FechaHoraInput({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  datePlaceholder = "Fecha",
  timePlaceholder = "Hora",
  inputClassName = defaultInputClass,
}: FechaHoraInputProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <input
        type="date"
        value={dateValue}
        onChange={(e) => onDateChange(e.target.value)}
        aria-label={datePlaceholder}
        className={inputClassName}
      />
      <input
        type="time"
        value={timeValue}
        onChange={(e) => onTimeChange(e.target.value)}
        aria-label={timePlaceholder}
        step={60}
        className={inputClassName}
      />
    </div>
  )
}
