"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, Send as Sync, AlertCircle, CheckCircle, Settings } from "lucide-react"
import { useGoogleCalendar } from "@/services/googleCalendar"
import { toast } from "sonner"

interface GoogleCalendarSyncProps {
  onSyncStatusChange?: (isEnabled: boolean) => void
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ onSyncStatusChange }) => {
  const { service, isAuthenticated, authenticate } = useGoogleCalendar()
  const [isSyncEnabled, setIsSyncEnabled] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const success = await authenticate()
      if (success) {
        toast.success("Conectado ao Google Calendar com sucesso!")
        setIsSyncEnabled(true)
        onSyncStatusChange?.(true)
      } else {
        toast.error("Falha ao conectar com Google Calendar. Verifique as permissões.")
      }
    } catch (error) {
      toast.error("Erro ao conectar com Google Calendar")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSyncToggle = (enabled: boolean) => {
    setIsSyncEnabled(enabled)
    onSyncStatusChange?.(enabled)

    if (enabled && !isAuthenticated) {
      handleConnect()
    } else {
      toast.success(enabled ? "Sincronização ativada" : "Sincronização desativada")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Sincronização Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sync-toggle">Sincronizar com Google Calendar</Label>
            <p className="text-sm text-muted-foreground">
              Sincronize automaticamente suas sessões com o Google Calendar
            </p>
          </div>
          <Switch
            id="sync-toggle"
            checked={isSyncEnabled && isAuthenticated}
            onCheckedChange={handleSyncToggle}
            disabled={isConnecting}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Desconectado
              </>
            )}
          </Badge>

          {isSyncEnabled && (
            <Badge variant="outline">
              <Sync className="w-3 h-3 mr-1" />
              Sincronização Ativa
            </Badge>
          )}
        </div>

        {!isAuthenticated && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Como conectar:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Clique em "Conectar Google Calendar"</li>
                  <li>Faça login na sua conta Google</li>
                  <li>Autorize o acesso ao seu calendário</li>
                  <li>Suas sessões serão sincronizadas automaticamente</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isAuthenticated && (
            <Button onClick={handleConnect} disabled={isConnecting} className="flex-1">
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Conectar Google Calendar
                </>
              )}
            </Button>
          )}

          {isAuthenticated && (
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          )}
        </div>

        {isAuthenticated && isSyncEnabled && (
          <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-800">
                Suas sessões estão sendo sincronizadas automaticamente com o Google Calendar. Alterações feitas aqui
                aparecerão no seu calendário e vice-versa.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GoogleCalendarSync
