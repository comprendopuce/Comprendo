/** Convierte ISO a valor para input datetime-local (hora local). */
export function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Separa un ISO (o datetime-local) en fecha y hora para inputs type="date" y type="time". */
export function splitDatetimeLocal(iso?: string | null): { date: string; time: string } {
  const full = toDatetimeLocal(iso)
  if (!full) return { date: "", time: "" }
  const [date, time] = full.split("T")
  return { date: date ?? "", time: time ?? "" }
}

/** Une fecha y hora locales en formato datetime-local. */
export function combineDatetimeLocal(date: string, time: string): string {
  const trimmedDate = date.trim()
  if (!trimmedDate) return ""
  return `${trimmedDate}T${time.trim() || "00:00"}`
}

/** Convierte datetime-local a ISO UTC para la API. */
export function fromDatetimeLocal(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

/** Convierte inputs date + time a ISO UTC para la API. */
export function fromDateAndTimeLocal(
  date: string,
  time: string,
  defaultTime = "00:00"
): string | null {
  const combined = combineDatetimeLocal(date, time || defaultTime)
  if (!combined) return null
  return fromDatetimeLocal(combined)
}

/** Parsea "HH:MM" en hora y minuto para selects. */
export function splitTimeValue(time?: string | null): { hour: string; minute: string } {
  if (!time || !time.includes(":")) return { hour: "", minute: "" }
  const [hour, minute] = time.split(":")
  return { hour: hour ?? "", minute: minute ?? "" }
}

/** Combina hora y minuto en formato "HH:MM". */
export function combineTimeValue(hour: string, minute: string): string {
  if (!hour && !minute) return ""
  const h = hour.padStart(2, "0")
  const m = (minute || "00").padStart(2, "0")
  return `${h}:${m}`
}

/** Valida que la fecha fin sea posterior al inicio (creación de la lección). */
export function validateFechaHastaAfterInicio(
  inicioIso: string | null | undefined,
  hastaDate: string,
  hastaTime: string
): string | null {
  if (!hastaDate.trim()) return null
  const inicio = inicioIso ? new Date(inicioIso) : new Date()
  if (Number.isNaN(inicio.getTime())) return null
  const hastaIso = fromDateAndTimeLocal(hastaDate, hastaTime, "23:59")
  if (!hastaIso) return null
  const hasta = new Date(hastaIso)
  if (Number.isNaN(hasta.getTime())) return null
  if (hasta <= inicio) {
    return "La fecha y hora de fin debe ser posterior al inicio de la lección."
  }
  return null
}

export function formatFechaDisponibilidad(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })
}
