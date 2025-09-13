"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Clock, TrendingUp, Activity, Plus } from "lucide-react"
import { getSessoes, getClientes } from "@/services/api"
import type { Sessao, Cliente } from "@/types"
import { format, isToday, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import StatsCard from "./StatsCard"
import QuickActions from "./QuickActions"
import ClienteForm from "./ClienteForm" // Import ClienteForm component
import { AgendaSemanal } from "./AgendaSemanal" // Import AgendaSemanal

interface DashboardProps {
  onAddSessao: (date: Date) => void // Modified to accept a date
  onAddCliente?: () => void
  onNavigate?: (page: string) => void
  onEditSessao: (sessao: Sessao) => void // Added prop
  onDeleteSessao: (sessao: Sessao) => void // Added prop
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

const Dashboard: React.FC<DashboardProps> = ({ onAddSessao, onAddCliente, onNavigate, onEditSessao, onDeleteSessao }) => {
  const { user } = useAuth()
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [totalAvaliacoes, setTotalAvaliacoes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isClienteFormOpen, setIsClienteFormOpen] = useState(false) // State for client modal
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(undefined) // State for editing client

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [sessoesData, clientesData] = await Promise.all([getSessoes(), getClientes()])
        setSessoes(sessoesData)
        setClientes(clientesData)
      } catch (error) {
        toast.error("Erro ao carregar dados do dashboard.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const memoizedStats = useMemo(() => {
    const today = new Date()
    const lastMonth = subMonths(today, 1)

    const sessoesHoje = sessoes.filter((sessao) => isToday(new Date(sessao.dataHoraInicio)))
    const sessoesAgendadas = sessoes.filter(
      (sessao) => new Date(sessao.dataHoraInicio) >= new Date() && sessao.status === "AGENDADA",
    )

    const sessoesEsteMes = sessoes.filter((sessao) => {
      return isWithinInterval(new Date(sessao.dataHoraInicio), {
        start: startOfMonth(today),
        end: endOfMonth(today),
      })
    })

    const sessoesUltimoMes = sessoes.filter((sessao) => {
      return isWithinInterval(new Date(sessao.dataHoraInicio), {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      })
    })

    const clientesTrend = 0 // Removed trend calculation
    const sessoesTrend = 0 // Removed trend calculation

    return {
      totalClientes: clientes.length,
      clientesTrend,
      sessoesHoje,
      sessoesAgendadas: sessoesAgendadas.length,
      sessoesEsteMes: sessoesEsteMes.length,
      sessoesTrend,
    }
  }, [sessoes, clientes])

  const getStatusProps = (status: string) => {
    switch (status) {
      case "AGENDADA":
        return { color: "bg-blue-500", text: "Agendada", variant: "default" as const }
      case "CONCLUIDA":
        return { color: "bg-green-500", text: "Concluída", variant: "secondary" as const }
      case "CANCELADA":
        return { color: "bg-red-500", text: "Cancelada", variant: "destructive" as const }
      default:
        return { color: "bg-gray-500", text: "Outro", variant: "outline" as const }
    }
  }

  const clienteMap = useMemo(() => new Map(clientes.map((c) => [c.id, c.nome])), [clientes])

  const handleAddCliente = () => {
    setEditingCliente(undefined)
    setIsClienteFormOpen(true)
  }

  const handleViewCalendar = () => {
    if (onNavigate) {
      onNavigate("calendario")
    } else {
      toast.info("Funcionalidade em desenvolvimento")
    }
  }

  const handleViewReports = () => {
    toast.info("Funcionalidade em desenvolvimento")
  }

  const handleClienteSave = async () => {
    try {
      const [sessoesData, clientesData] = await Promise.all([getSessoes(), getClientes()])
      setSessoes(sessoesData)
      setClientes(clientesData)
    } catch (error) {
      toast.error("Erro ao recarregar dados.")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 p-6 border border-primary/20">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Hoje é {format(new Date(), "eeee, dd 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Clientes"
          value={memoizedStats.totalClientes}
          description="pacientes ativos"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Sessões Hoje"
          value={memoizedStats.sessoesHoje.length}
          description="agendadas para hoje"
          icon={CalendarDays}
          color="success"
        />
        <StatsCard
          title="Próximas Sessões"
          value={memoizedStats.sessoesAgendadas}
          description="sessões a realizar"
          icon={Clock}
          color="info"
        />
        <StatsCard
          title="Sessões Este Mês"
          value={memoizedStats.sessoesEsteMes}
          description="total no mês atual"
          icon={TrendingUp}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <QuickActions
            onAddSessao={() => onAddSessao(new Date())}
            onAddCliente={handleAddCliente}
            onViewCalendar={handleViewCalendar}
            onViewReports={handleViewReports}
          />
        </div>

        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Agenda do Dia
                  </CardTitle>
                  <CardDescription>{format(new Date(), "eeee, dd 'de' MMMM", { locale: ptBR })}</CardDescription>
                </div>
                <Button onClick={() => onAddSessao(new Date())} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sessão
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto">
                <div className="space-y-3">
                  {memoizedStats.sessoesHoje.length > 0 ? (
                    memoizedStats.sessoesHoje
                      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())
                      .map((sessao, index) => (
                        <div
                          key={sessao.id}
                          className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-border/50 animate-slide-in-right"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={`w-2 h-16 rounded-full ${getStatusProps(sessao.status).color}`}></div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {clienteMap.get(sessao.clienteId) || "Cliente não encontrado"}
                            </p>
                            <p className="text-sm text-muted-foreground">{sessao.nome}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-lg">
                              {format(new Date(sessao.dataHoraInicio), "HH:mm")}
                            </p>
                            <Badge variant={getStatusProps(sessao.status).variant} className="mt-1">
                              {getStatusProps(sessao.status).text}
                            </Badge>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma sessão hoje</h3>
                      <p className="text-muted-foreground mb-4">Aproveite para organizar sua semana.</p>
                      <Button onClick={() => onAddSessao(new Date())} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Agendar Sessão
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Calendário Semanal
          </CardTitle>
          <CardDescription>Visualize e gerencie seus compromissos da semana</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden border border-border/50" style={{ height: "800px" }}>
            <AgendaSemanal
              sessoes={sessoes}
              clientes={clientes}
              onSelectSessao={onEditSessao}
              onDeleteSessao={onDeleteSessao}
              onSelectSlot={(start, end) => onAddSessao(start)}
            />
          </div>
        </CardContent>
      </Card>

      {isClienteFormOpen && (
        <ClienteForm
          isOpen={isClienteFormOpen}
          onClose={() => setIsClienteFormOpen(false)}
          cliente={editingCliente}
          onSave={handleClienteSave}
        />
      )}
    </div>
  )
}

export default Dashboard