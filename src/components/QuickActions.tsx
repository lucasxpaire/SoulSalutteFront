"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, FileText, Clock } from "lucide-react"

interface QuickActionsProps {
  onAddSessao: () => void
  onAddCliente: () => void
  onViewCalendar: () => void
  onViewReports: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddSessao, onAddCliente, onViewCalendar, onViewReports }) => {
  const actions = [
    {
      title: "Nova Sessão",
      description: "Agendar consulta",
      icon: Plus,
      onClick: onAddSessao,
      color: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      title: "Novo Cliente",
      description: "Cadastrar paciente",
      icon: Users,
      onClick: onAddCliente,
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    },
    {
      title: "Ver Agenda",
      description: "Calendário completo",
      icon: Calendar,
      onClick: onViewCalendar,
      color: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      title: "Relatórios",
      description: "Análises e dados",
      icon: FileText,
      onClick: onViewReports,
      color: "bg-green-600 text-white hover:bg-green-700",
    },
  ]

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-86 flex flex-col">
          <div className="grid grid-cols-2 gap-4 flex-1">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                className={`h-full p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 ${action.color}`}
                variant="default"
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold text-base">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
