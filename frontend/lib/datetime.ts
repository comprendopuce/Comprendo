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

export function formatFechaDisponibilidad(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })
}
