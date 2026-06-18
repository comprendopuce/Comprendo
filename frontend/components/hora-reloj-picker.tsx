"use client"

import Clock from "react-clock"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { combineTimeValue, splitTimeValue } from "@/lib/datetime"

import "./fecha-hora-input.css"

type PickMode = "hour" | "minute"

interface HoraRelojPickerProps {
  timeValue: string
  onTimeChange: (value: string) => void
}

function parseHour24(timeValue: string): number {
  const { hour } = splitTimeValue(timeValue)
  const n = Number(hour)
  return Number.isFinite(n) ? n : 0
}

function parseMinute(timeValue: string): number {
  const { minute } = splitTimeValue(timeValue)
  const n = Number(minute)
  return Number.isFinite(n) ? n : 0
}

function angleFromPointer(clientX: number, clientY: number, rect: DOMRect): number {
  const x = clientX - rect.left - rect.width / 2
  const y = clientY - rect.top - rect.height / 2
  let angle = Math.atan2(x, -y) * (180 / Math.PI)
  if (angle < 0) angle += 360
  return angle
}

function angleToHour12(angle: number): number {
  const h = Math.round(angle / 30) % 12
  return h === 0 ? 12 : h
}

function angleToMinute(angle: number): number {
  return Math.round(angle / 6) % 60
}

function hour12To24(hour12: number, isAfternoon: boolean): number {
  if (isAfternoon) return hour12 === 12 ? 12 : hour12 + 12
  return hour12 === 12 ? 0 : hour12
}

function hour24To12(hour24: number): { hour12: number; isAfternoon: boolean } {
  if (hour24 === 0) return { hour12: 12, isAfternoon: false }
  if (hour24 === 12) return { hour12: 12, isAfternoon: true }
  if (hour24 > 12) return { hour12: hour24 - 12, isAfternoon: true }
  return { hour12: hour24, isAfternoon: false }
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

export function HoraRelojPicker({ timeValue, onTimeChange }: HoraRelojPickerProps) {
  const faceRef = useRef<HTMLDivElement>(null)
  const hour24 = parseHour24(timeValue)
  const minute = parseMinute(timeValue)
  const { hour12, isAfternoon: afternoonFromValue } = hour24To12(hour24)

  const [mode, setMode] = useState<PickMode>("hour")
  const [isAfternoon, setIsAfternoon] = useState(afternoonFromValue)

  useEffect(() => {
    setIsAfternoon(afternoonFromValue)
  }, [afternoonFromValue])

  const clockDate = useMemo(() => {
    const d = new Date()
    d.setHours(hour24, minute, 0, 0)
    return d
  }, [hour24, minute])

  const emitTime = useCallback(
    (nextHour: number, nextMinute: number) => {
      onTimeChange(combineTimeValue(pad2(nextHour), pad2(nextMinute)))
    },
    [onTimeChange],
  )

  const handleFacePointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = faceRef.current?.getBoundingClientRect()
      if (!rect) return

      const angle = angleFromPointer(clientX, clientY, rect)

      if (mode === "hour") {
        const picked12 = angleToHour12(angle)
        const nextHour = hour12To24(picked12, isAfternoon)
        emitTime(nextHour, minute)
        setMode("minute")
        return
      }

      const nextMinute = angleToMinute(angle)
      emitTime(hour24, nextMinute)
    },
    [emitTime, hour24, isAfternoon, minute, mode],
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    faceRef.current?.setPointerCapture(e.pointerId)
    handleFacePointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!faceRef.current?.hasPointerCapture(e.pointerId)) return
    e.preventDefault()
    handleFacePointer(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (faceRef.current?.hasPointerCapture(e.pointerId)) {
      faceRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const displayHour = mode === "hour" ? hour12 : hour24

  return (
    <div className="comprendo-time-wheel space-y-3">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("hour")}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-colors ${
            mode === "hour"
              ? "bg-[#9E5A78] text-white"
              : "bg-white text-[#9E5A78] border border-[#F1D87C]/50"
          }`}
        >
          {pad2(displayHour)}
        </button>
        <span className="text-lg font-black text-[#9E5A78]">:</span>
        <button
          type="button"
          onClick={() => setMode("minute")}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold transition-colors ${
            mode === "minute"
              ? "bg-[#5B9B95] text-white"
              : "bg-white text-[#5B9B95] border border-[#F1D87C]/50"
          }`}
        >
          {pad2(minute)}
        </button>
      </div>

      {mode === "hour" && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAfternoon(false)
              const next = hour12To24(hour12, false)
              emitTime(next, minute)
            }}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              !isAfternoon
                ? "bg-[#5B9B95] text-white"
                : "bg-white text-[#5B5B5B] border border-[#F1D87C]/50"
            }`}
          >
            Mañana
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAfternoon(true)
              const next = hour12To24(hour12, true)
              emitTime(next, minute)
            }}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              isAfternoon
                ? "bg-[#9E5A78] text-white"
                : "bg-white text-[#5B5B5B] border border-[#F1D87C]/50"
            }`}
          >
            Tarde
          </button>
        </div>
      )}

      <p className="text-center text-[11px] font-semibold text-[#9E5A78]">
        {mode === "hour" ? "Toca un número para la hora" : "Toca el reloj para los minutos"}
      </p>

      <div
        ref={faceRef}
        className="comprendo-time-wheel__face relative mx-auto touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-label={mode === "hour" ? "Seleccionar hora" : "Seleccionar minutos"}
        aria-valuenow={mode === "hour" ? hour24 : minute}
        aria-valuemin={0}
        aria-valuemax={mode === "hour" ? 23 : 59}
      >
        <Clock
          value={clockDate}
          renderNumbers
          renderSecondHand={false}
          renderMinuteHand={mode === "minute"}
          locale="es-EC"
          size="100%"
        />
      </div>
    </div>
  )
}
