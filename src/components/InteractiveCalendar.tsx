"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
  parseISO,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Badge } from "@/components/ui/badge"
import type { Sessao, Cliente } from "@/types"
import { toast } from "sonner"
import { deleteSessao, getClientes, updateSessao } from "@/services/api"
import { useGoogleCalendar } from "@/services/googleCalendar"

interface InteractiveCalendarProps {
  sessoes: Sessao[]
  onEditSessao: (sessao: Sessao) => void
  onAddSessao: (date: Date) => void
  onSessaoUpdated: () => void
}

interface DraggedEvent {
  sessao: Sessao
  startX: number
  startY: number
}

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  sessoes,
  onEditSessao,
  onAddSessao,
  onSessaoUpdated,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [draggedEvent, setDraggedEvent] = useState<DraggedEvent | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false)

  const { isAuthenticated, createEvent, updateEvent, deleteEvent, moveEvent } = useGoogleCalendar()

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(() => {
        toast.error("Erro ao carregar clientes")
      })
  }, [])

  const getClienteNome = useCallback(
    (clienteId: number) => {
      const cliente = clientes.find((c) => c.id === clienteId)
      return cliente?.nome || "Cliente não encontrado"
    },
    [clientes],
  )

  const handleDeleteSessao = async (sessaoId: number) => {
    try {
      await deleteSessao(sessaoId)

      if (googleSyncEnabled && isAuthenticated) {
        toast.success("Sessão excluída e removida do Google Calendar!")
      } else {
        toast.success("Sessão excluída com sucesso!")
      }

      onSessaoUpdated()
    } catch (error) {
      toast.error("Erro ao excluir sessão")
    }
    setSelectedDate(null)
  }

  const handleDragStart = (e: React.DragEvent, sessao: Sessao) => {
    setDraggedEvent({
      sessao,
      startX: e.clientX,
      startY: e.clientY,
    })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    if (!draggedEvent) return

    const originalDate = parseISO(draggedEvent.sessao.dataHoraInicio)
    const timeDiff = targetDate.getTime() - originalDate.getTime()

    const newStartDate = new Date(originalDate.getTime() + timeDiff)
    const newEndDate = new Date(parseISO(draggedEvent.sessao.dataHoraFim).getTime() + timeDiff)

    const updatedSessao = {
      ...draggedEvent.sessao,
      dataHoraInicio: format(newStartDate, "yyyy-MM-dd'T'HH:mm"),
      dataHoraFim: format(newEndDate, "yyyy-MM-dd'T'HH:mm"),
    }

    try {
      await updateSessao(draggedEvent.sessao.id, updatedSessao)

      if (googleSyncEnabled && isAuthenticated) {
        toast.success("Sessão movida e sincronizada com Google Calendar!")
      } else {
        toast.success("Sessão movida com sucesso!")
      }

      onSessaoUpdated()
    } catch (error) {
      toast.error("Erro ao mover sessão")
    }

    setDraggedEvent(null)
  }

  const handleSyncStatusChange = (isEnabled: boolean) => {
    setGoogleSyncEnabled(isEnabled)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const getSessoesForDate = (date: Date): Sessao[] => {
    return sessoes.filter((sessao) => {
      const sessaoDate = parseISO(sessao.dataHoraInicio)
      return isSameDay(sessaoDate, date)
    })
  }

  const renderCalendarDays = () => {
    const days = []
    let day = startDate

    while (day <= endDate) {
      const cloneDay = day
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isToday = isSameDay(day, new Date())
      const isSelected = selectedDate && isSameDay(day, selectedDate)
      const daysSessoes = getSessoesForDate(day)

      days.push(
        <div
          key={day.toString()}
          className={`
            min-h-[120px] border border-gray-200 p-2 cursor-pointer transition-colors group
            ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white hover:bg-gray-50"}
            ${isToday ? "bg-blue-50 border-blue-200" : ""}
            ${isSelected ? "bg-blue-100 border-blue-300" : ""}
          `}
          onClick={() => setSelectedDate(cloneDay)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, cloneDay)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{format(day, "d")}</span>
            {isCurrentMonth && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddSessao(cloneDay)
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="space-y-1">
            {daysSessoes.slice(0, 3).map((sessao) => (
              <ContextMenu key={sessao.id}>
                <ContextMenuTrigger>
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, sessao)}
                    className={`
                      text-xs p-1 rounded cursor-move transition-all hover:shadow-sm
                      ${sessao.status === "AGENDADA" ? "bg-blue-100 text-blue-800 border border-blue-200" : ""}
                      ${sessao.status === "CONCLUIDA" ? "bg-green-100 text-green-800 border border-green-200" : ""}
                      ${sessao.status === "CANCELADA" ? "bg-red-100 text-red-800 border border-red-200" : ""}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">{format(parseISO(sessao.dataHoraInicio), "HH:mm")}</span>
                      {googleSyncEnabled && isAuthenticated && (
                        <Calendar className="h-3 w-3 text-green-600" title="Sincronizado com Google Calendar" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{getClienteNome(sessao.clienteId)}</span>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      setSelectedDate(null)
                      onEditSessao(sessao)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar Sessão
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleDeleteSessao(sessao.id)}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir Sessão
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}

            {daysSessoes.length > 3 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-full text-xs text-gray-500 hover:text-gray-700">
                    +{daysSessoes.length - 3} mais
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sessões de {format(cloneDay, "dd/MM/yyyy")}</h4>
                    {daysSessoes.slice(3).map((sessao) => (
                      <div key={sessao.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            {format(parseISO(sessao.dataHoraInicio), "HH:mm")} - {getClienteNome(sessao.clienteId)}
                            {googleSyncEnabled && isAuthenticated && <Calendar className="h-3 w-3 text-green-600" />}
                          </div>
                          <Badge
                            variant={
                              sessao.status === "AGENDADA"
                                ? "default"
                                : sessao.status === "CONCLUIDA"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {sessao.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => onEditSessao(sessao)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteSessao(sessao.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>,
      )
      day = addDays(day, 1)
    }

    return days
  }

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</h2>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
              Hoje
            </Button>
            <Button onClick={() => onAddSessao(new Date())}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 border-l border-t">{renderCalendarDays()}</div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Agendada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Concluída</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Cancelada</span>
          </div>
          {googleSyncEnabled && isAuthenticated && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-green-600" />
              <span>Sincronizado com Google</span>
            </div>
          )}
          <div className="ml-auto text-xs text-gray-500">
            Clique com o botão direito nas sessões para editar ou excluir • Arraste para mover
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InteractiveCalendar
