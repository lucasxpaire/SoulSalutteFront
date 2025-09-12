"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface CustomRecurrenceData {
  frequency: number
  interval: "day" | "week" | "month" | "year"
  weekDays: string[]
  endType: "never" | "date" | "count"
  endDate?: string
  endCount?: number
}

interface CustomRecurrencePopupProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomRecurrenceData) => void
  initialData?: CustomRecurrenceData
}

const CustomRecurrencePopup: React.FC<CustomRecurrencePopupProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [frequency, setFrequency] = useState(initialData?.frequency || 1)
  const [interval, setInterval] = useState<"day" | "week" | "month" | "year">(initialData?.interval || "week")
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(initialData?.weekDays || ["6"]) // Sábado por padrão
  const [endType, setEndType] = useState<"never" | "date" | "count">(initialData?.endType || "never")
  const [endDate, setEndDate] = useState(initialData?.endDate || format(new Date(), "yyyy-MM-dd"))
  const [endCount, setEndCount] = useState(initialData?.endCount || 13)

  const weekDays = [
    { value: "0", label: "D", fullLabel: "Domingo" },
    { value: "1", label: "S", fullLabel: "Segunda" },
    { value: "2", label: "T", fullLabel: "Terça" },
    { value: "3", label: "Q", fullLabel: "Quarta" },
    { value: "4", label: "Q", fullLabel: "Quinta" },
    { value: "5", label: "S", fullLabel: "Sexta" },
    { value: "6", label: "S", fullLabel: "Sábado" },
  ]

  const intervalOptions = [
    { value: "day", label: "dia", plural: "dias" },
    { value: "week", label: "semana", plural: "semanas" },
    { value: "month", label: "mês", plural: "meses" },
    { value: "year", label: "ano", plural: "anos" },
  ]

  const toggleWeekDay = (dayValue: string) => {
    setSelectedWeekDays((prev) => (prev.includes(dayValue) ? prev.filter((d) => d !== dayValue) : [...prev, dayValue]))
  }

  const handleSave = () => {
    const data: CustomRecurrenceData = {
      frequency,
      interval,
      weekDays: selectedWeekDays,
      endType,
      endDate: endType === "date" ? endDate : undefined,
      endCount: endType === "count" ? endCount : undefined,
    }
    onSave(data)
    onClose()
  }

  const getIntervalLabel = () => {
    const option = intervalOptions.find((opt) => opt.value === interval)
    return frequency === 1 ? option?.label : option?.plural
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recorrência personalizada</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Repetir a cada */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Repetir a cada:</Label>
            <Input
              type="number"
              min="1"
              max="999"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-16 text-center"
            />
            <Select value={interval} onValueChange={(value: "day" | "week" | "month" | "year") => setInterval(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {intervalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {frequency === 1 ? option.label : option.plural}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dias da semana (apenas para repetição semanal) */}
          {interval === "week" && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Repetir:</Label>
              <div className="flex gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={selectedWeekDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => toggleWeekDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Termina em */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Termina em</Label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "never"}
                  onChange={() => setEndType("never")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Nunca</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "date"}
                  onChange={() => setEndType("date")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Em</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={endType !== "date"}
                  className="w-36 h-8 text-sm"
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="endType"
                  checked={endType === "count"}
                  onChange={() => setEndType("count")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Após</span>
                <Input
                  type="number"
                  min="1"
                  max="999"
                  value={endCount}
                  onChange={(e) => setEndCount(Number(e.target.value))}
                  disabled={endType !== "count"}
                  className="w-16 h-8 text-center text-sm"
                />
                <span className="text-sm text-muted-foreground">ocorrências</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomRecurrencePopup
