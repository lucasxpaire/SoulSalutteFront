"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Sessao, Cliente } from "@/types"
import { toast } from "sonner"
import { createSessao, updateSessao, getClientes } from "@/services/api"
import { format, addMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { User, Mail, Clock, ChevronDown, Repeat } from "lucide-react"
import CustomCalendar from "./CustomCalendar"
import TimePickerPopup from "./TimePickerPopup"
import RepeatOptionsPopup from "./RepeatOptionsPopup"
import CustomRecurrencePopup from "./CustomRecurrencePopup"

interface RepeatOption {
  value: string
  label: string
}

const SessaoForm: React.FC<{
  isOpen: boolean
  onClose: () => void
  sessao?: Sessao
  initialDate?: Date
  initialClienteId?: number
  onSave: () => void
}> = ({ isOpen, onClose, sessao, initialDate, initialClienteId, onSave }) => {
  const [formData, setFormData] = useState<Partial<Sessao>>({})
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date())
  const [selectedStartTime, setSelectedStartTime] = useState<string>("")
  const [selectedEndTime, setSelectedEndTime] = useState<string>("")
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatOption>({ value: "none", label: "Não se repete" })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  const [showRepeatOptions, setShowRepeatOptions] = useState(false)
  const [showCustomRecurrence, setShowCustomRecurrence] = useState(false)

  const handleClose = () => {
    // Reset all popup states immediately
    setShowDatePicker(false)
    setShowStartTimePicker(false)
    setShowEndTimePicker(false)
    setShowRepeatOptions(false)
    setShowCustomRecurrence(false)

    // Call parent close handler
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setShowDatePicker(false)
      setShowStartTimePicker(false)
      setShowEndTimePicker(false)
      setShowRepeatOptions(false)
      setShowCustomRecurrence(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      getClientes()
        .then(setClientes)
        .catch(() => toast.error("Falha ao carregar clientes."))

      if (sessao) {
        const startDate = new Date(sessao.dataHoraInicio)
        const endDate = new Date(sessao.dataHoraFim)

        setFormData(sessao)
        setSelectedDate(startDate)
        setSelectedStartTime(format(startDate, "HH:mm"))
        setSelectedEndTime(format(endDate, "HH:mm"))
      } else {
        const defaultDate = initialDate || new Date()
        const newSessionData: Partial<Sessao> = {
          nome: "Sessão de Fisioterapia",
          status: "AGENDADA",
          notasSessao: "",
          notificacao: true,
        }

        if (initialClienteId !== undefined) {
          newSessionData.clienteId = initialClienteId
        }

        setFormData(newSessionData)
        setSelectedDate(defaultDate)
        setSelectedStartTime("09:00")
        setSelectedEndTime("10:00")
      }
    }
  }, [sessao, initialDate, initialClienteId, isOpen])

  useEffect(() => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      const startDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedStartTime}`)
      const endDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedEndTime}`)

      setFormData((prev) => ({
        ...prev,
        dataHoraInicio: format(startDateTime, "yyyy-MM-dd'T'HH:mm"),
        dataHoraFim: format(endDateTime, "yyyy-MM-dd'T'HH:mm"),
      }))
    }
  }, [selectedDate, selectedStartTime, selectedEndTime])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setShowDatePicker(false)
    }
  }

  const handleStartTimeSelect = (time: string) => {
    setSelectedStartTime(time)
    // Auto-ajustar hora fim para 1 hora depois
    const [hours, minutes] = time.split(":").map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = addMinutes(startDate, 60)
    setSelectedEndTime(format(endDate, "HH:mm"))
    setShowStartTimePicker(false)
  }

  const handleEndTimeSelect = (time: string) => {
    setSelectedEndTime(time)
    setShowEndTimePicker(false)
  }

  const handleRepeatSelect = (option: RepeatOption) => {
    setSelectedRepeat(option)
    setShowRepeatOptions(false)
  }

  const handleCustomRecurrenceClick = () => {
    setShowRepeatOptions(false)
    setShowCustomRecurrence(true)
  }

  const handleCustomRecurrenceSave = (data: any) => {
    // Criar label personalizado baseado nos dados
    let customLabel = `A cada ${data.frequency} ${
      data.frequency === 1
        ? data.interval === "week"
          ? "semana"
          : data.interval === "day"
            ? "dia"
            : data.interval === "month"
              ? "mês"
              : "ano"
        : data.interval === "week"
          ? "semanas"
          : data.interval === "day"
            ? "dias"
            : data.interval === "month"
              ? "meses"
              : "anos"
    }`

    if (data.interval === "week" && data.weekDays.length > 0) {
      const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      const selectedDays = data.weekDays.map((day: string) => dayNames[Number.parseInt(day)]).join(", ")
      customLabel += ` (${selectedDays})`
    }

    setSelectedRepeat({ value: "custom", label: customLabel })
    setShowCustomRecurrence(false)
  }

  const formatDateDisplay = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clienteId || !formData.dataHoraInicio) {
      toast.error("Cliente, data e horário são obrigatórios.")
      return
    }
    try {
      const dataToSave = { ...formData }
      if (sessao?.id) {
        await updateSessao(sessao.id, dataToSave as Sessao)
        toast.success("Sessão atualizada com sucesso!")
      } else {
        await createSessao(dataToSave as Omit<Sessao, "id">)
        toast.success("Sessão agendada com sucesso!")
      }
      onSave()
      handleClose()
    } catch (error) {
      toast.error("Erro ao salvar sessão.")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col p-0 bg-card">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl text-primary">
              {sessao ? "Editar Sessão" : "Agendar Nova Sessão"}
            </DialogTitle>
            <DialogDescription>Configure os detalhes da sessão de fisioterapia.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              <Select
                value={formData.clienteId?.toString() || ""}
                onValueChange={(value) => setFormData((p) => ({ ...p, clienteId: Number(value) }))}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Selecione um cliente" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {/* Data e Horários */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />

                  {/* Seletor de Data */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDatePicker(true)}
                    className="flex-1 justify-start text-left font-normal"
                  >
                    {formatDateDisplay(selectedDate)}
                  </Button>

                  {/* Seletor de Hora Início */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStartTimePicker(true)}
                    className="w-24 justify-center"
                  >
                    {selectedStartTime}
                  </Button>

                  <span className="text-muted-foreground">–</span>

                  {/* Seletor de Hora Fim */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEndTimePicker(true)}
                    className="w-24 justify-center"
                  >
                    {selectedEndTime}
                  </Button>
                </div>

                {/* Seletor de Repetição - moved to separate row to prevent overflow */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5" /> {/* Spacer to align with clock icon */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRepeatOptions(true)}
                    className="flex-1 justify-start gap-2 overflow-hidden"
                  >
                    <Repeat className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectedRepeat.label}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notasSessao">Notas Adicionais</Label>
              <Textarea
                id="notasSessao"
                value={formData.notasSessao || ""}
                onChange={(e) => setFormData((p) => ({ ...p, notasSessao: e.target.value }))}
                placeholder="Adicione observações sobre a sessão..."
                className="bg-muted/50"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-notification" className="flex items-center text-base">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Notificar paciente por E-mail
                </Label>
                <DialogDescription>Uma confirmação será enviada para o e-mail cadastrado.</DialogDescription>
              </div>
              <Switch
                id="email-notification"
                checked={formData.notificacao ?? false}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, notificacao: checked }))}
              />
            </div>
          </form>

          <DialogFooter className="p-6 border-t bg-muted/50">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {sessao ? "Salvar Alterações" : "Agendar Sessão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Date Picker */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Data</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <CustomCalendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Picker Popups */}
      <TimePickerPopup
        isOpen={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onTimeSelect={handleStartTimeSelect}
        selectedTime={selectedStartTime}
        title="Hora de início"
      />

      <TimePickerPopup
        isOpen={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onTimeSelect={handleEndTimeSelect}
        selectedTime={selectedEndTime}
        title="Hora de término"
      />

      {/* Repeat Options Popup */}
      <RepeatOptionsPopup
        isOpen={showRepeatOptions}
        onClose={() => setShowRepeatOptions(false)}
        onRepeatSelect={handleRepeatSelect}
        onCustomizeClick={handleCustomRecurrenceClick}
        selectedRepeat={selectedRepeat}
      />

      {/* Custom Recurrence Popup */}
      <CustomRecurrencePopup
        isOpen={showCustomRecurrence}
        onClose={() => setShowCustomRecurrence(false)}
        onSave={handleCustomRecurrenceSave}
      />
    </>
  )
}

export default SessaoForm
