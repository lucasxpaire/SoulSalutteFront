import type { Sessao } from "@/types"

interface GoogleCalendarEvent {
  id?: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
  }>
}

class GoogleCalendarService {
  private accessToken: string | null = null
  private calendarId = "primary" // ou o ID específico do calendário

  constructor() {
    // Recuperar token do localStorage ou de onde estiver armazenado
    this.accessToken = localStorage.getItem("google_calendar_token")
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  // Inicializar autenticação com Google
  async authenticate(): Promise<boolean> {
    try {
      // Implementar fluxo OAuth2 do Google
      // Por enquanto, retorna false indicando que precisa ser implementado
      console.log("Google Calendar authentication needed")
      return false
    } catch (error) {
      console.error("Erro na autenticação:", error)
      return false
    }
  }

  // Converter Sessao para formato do Google Calendar
  private sessaoToGoogleEvent(sessao: Sessao, clienteNome?: string): GoogleCalendarEvent {
    return {
      summary: sessao.nome || "Sessão de Fisioterapia",
      description: `Cliente: ${clienteNome || "N/A"}\nStatus: ${sessao.status}\nNotas: ${sessao.notasSessao || "Nenhuma nota"}`,
      start: {
        dateTime: sessao.dataHoraInicio,
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: sessao.dataHoraFim,
        timeZone: "America/Sao_Paulo",
      },
    }
  }

  // Criar evento no Google Calendar
  async createEvent(sessao: Sessao, clienteNome?: string): Promise<string | null> {
    if (!this.isAuthenticated()) {
      console.warn("Usuário não autenticado no Google Calendar")
      return null
    }

    try {
      const event = this.sessaoToGoogleEvent(sessao, clienteNome)

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        const createdEvent = await response.json()
        return createdEvent.id
      } else {
        console.error("Erro ao criar evento:", await response.text())
        return null
      }
    } catch (error) {
      console.error("Erro ao criar evento no Google Calendar:", error)
      return null
    }
  }

  // Atualizar evento no Google Calendar
  async updateEvent(eventId: string, sessao: Sessao, clienteNome?: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.warn("Usuário não autenticado no Google Calendar")
      return false
    }

    try {
      const event = this.sessaoToGoogleEvent(sessao, clienteNome)

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        },
      )

      return response.ok
    } catch (error) {
      console.error("Erro ao atualizar evento no Google Calendar:", error)
      return false
    }
  }

  // Deletar evento do Google Calendar
  async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.warn("Usuário não autenticado no Google Calendar")
      return false
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      return response.ok
    } catch (error) {
      console.error("Erro ao deletar evento no Google Calendar:", error)
      return false
    }
  }

  // Mover evento para nova data/hora
  async moveEvent(eventId: string, newStartTime: string, newEndTime: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      console.warn("Usuário não autenticado no Google Calendar")
      return false
    }

    try {
      // Primeiro, buscar o evento atual
      const getResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (!getResponse.ok) {
        return false
      }

      const currentEvent = await getResponse.json()

      // Atualizar apenas as datas
      const updatedEvent = {
        ...currentEvent,
        start: {
          ...currentEvent.start,
          dateTime: newStartTime,
        },
        end: {
          ...currentEvent.end,
          dateTime: newEndTime,
        },
      }

      const updateResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        },
      )

      return updateResponse.ok
    } catch (error) {
      console.error("Erro ao mover evento no Google Calendar:", error)
      return false
    }
  }

  // Listar eventos do calendário
  async listEvents(timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    if (!this.isAuthenticated()) {
      console.warn("Usuário não autenticado no Google Calendar")
      return []
    }

    try {
      const params = new URLSearchParams({
        singleEvents: "true",
        orderBy: "startTime",
        ...(timeMin && { timeMin }),
        ...(timeMax && { timeMax }),
      })

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        return data.items || []
      } else {
        console.error("Erro ao listar eventos:", await response.text())
        return []
      }
    } catch (error) {
      console.error("Erro ao listar eventos do Google Calendar:", error)
      return []
    }
  }
}

// Instância singleton do serviço
export const googleCalendarService = new GoogleCalendarService()

// Hook para usar o serviço em componentes React
export const useGoogleCalendar = () => {
  return {
    service: googleCalendarService,
    isAuthenticated: googleCalendarService.isAuthenticated(),
    authenticate: () => googleCalendarService.authenticate(),
    createEvent: (sessao: Sessao, clienteNome?: string) => googleCalendarService.createEvent(sessao, clienteNome),
    updateEvent: (eventId: string, sessao: Sessao, clienteNome?: string) =>
      googleCalendarService.updateEvent(eventId, sessao, clienteNome),
    deleteEvent: (eventId: string) => googleCalendarService.deleteEvent(eventId),
    moveEvent: (eventId: string, newStartTime: string, newEndTime: string) =>
      googleCalendarService.moveEvent(eventId, newStartTime, newEndTime),
  }
}
