"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TimePickerPopupProps {
  isOpen: boolean
  onClose: () => void
  onTimeSelect: (time: string) => void
  selectedTime?: string
  title: string
}

const TimePickerPopup: React.FC<TimePickerPopupProps> = ({ isOpen, onClose, onTimeSelect, selectedTime, title }) => {
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleTimeClick = (time: string) => {
    onTimeSelect(time)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-64 overflow-y-auto border rounded-md">
          <div className="grid grid-cols-2 gap-1 p-1">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTimeClick(time)}
                className="justify-start h-8 text-sm"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TimePickerPopup
