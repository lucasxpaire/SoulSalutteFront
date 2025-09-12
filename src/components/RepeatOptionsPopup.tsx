"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface RepeatOption {
  value: string
  label: string
}

interface RepeatOptionsPopupProps {
  isOpen: boolean
  onClose: () => void
  onRepeatSelect: (option: RepeatOption) => void
  onCustomizeClick: () => void
  selectedRepeat?: RepeatOption
}

const RepeatOptionsPopup: React.FC<RepeatOptionsPopupProps> = ({
  isOpen,
  onClose,
  onRepeatSelect,
  onCustomizeClick,
  selectedRepeat,
}) => {
  const repeatOptions: RepeatOption[] = [
    { value: "none", label: "Não se repete" },
    { value: "daily", label: "Todos os dias" },
    { value: "weekly", label: "Semanal: cada sexta-feira" },
    { value: "monthly", label: "Mensal no(a) segundo(a) sexta-feira" },
    { value: "yearly", label: "Anual em setembro 12" },
    { value: "weekdays", label: "Todos os dias da semana (segunda a sexta-feira)" },
  ]

  const handleRepeatClick = (option: RepeatOption) => {
    onRepeatSelect(option)
    onClose()
  }

  const handleCustomizeClick = () => {
    onClose()
    onCustomizeClick()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Repetir</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {repeatOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedRepeat?.value === option.value ? "default" : "ghost"}
              onClick={() => handleRepeatClick(option)}
              className="w-full justify-start h-10 text-sm font-normal"
            >
              {option.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={handleCustomizeClick}
            className="w-full justify-start h-10 text-sm font-normal"
          >
            Personalizar...
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RepeatOptionsPopup
