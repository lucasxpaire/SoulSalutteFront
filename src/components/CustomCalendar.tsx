"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"

interface CustomCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  disabled?: (date: Date) => boolean
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onDateSelect, disabled = () => false }) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate

  // Cabeçalho dos dias da semana
  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"]

  // Gerar as semanas
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isSelected = isSameDay(day, selectedDate)
      const isDisabled = disabled(day)
      const isToday = isSameDay(day, new Date())

      days.push(
        <div key={day.toString()} className="p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`
              w-8 h-8 p-0 font-normal text-sm rounded-full
              ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
              ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
              ${isToday && !isSelected ? "bg-blue-50 text-blue-600 font-medium" : ""}
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
            disabled={isDisabled}
            onClick={() => !isDisabled && onDateSelect(cloneDay)}
          >
            {format(day, dateFormat)}
          </Button>
        </div>,
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>,
    )
    days = []
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 w-80">
      {/* Cabeçalho com navegação */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-1">
            <div className="text-xs font-medium text-gray-500 text-center">{day}</div>
          </div>
        ))}
      </div>

      {/* Grade do calendário */}
      <div className="space-y-1">{rows}</div>
    </div>
  )
}

export default CustomCalendar
