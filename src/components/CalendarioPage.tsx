"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import type { Sessao } from "@/types"
import { getSessoes } from "@/services/api"
import { toast } from "sonner"
import Calendario from "./Calendario"

interface CalendarioPageProps {
  onAddSessao: (date: Date) => void
  onEditSessao: (sessao: Sessao) => void
}

const CalendarioPage: React.FC<CalendarioPageProps> = ({ onAddSessao, onEditSessao }) => {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadSessoes = async () => {
    try {
      setLoading(true)
      const data = await getSessoes()
      setSessoes(data)
    } catch (error) {
      toast.error("Erro ao carregar sessões")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessoes()
  }, [refreshKey])

  const handleSessaoUpdated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Calendário
          </h1>
          <p className="text-muted-foreground">Gerencie suas sessões com funcionalidades de edição e visualização.</p>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando sessões...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Calendario
            sessoes={sessoes}
            onEditSessao={onEditSessao}
            onAddSessao={onAddSessao}
            onSessaoUpdated={handleSessaoUpdated}
          />
        )}
      </div>
    </div>
  )
}

export default CalendarioPage
