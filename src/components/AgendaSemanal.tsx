// src/components/AgendaSemanal.tsx

import React from 'react';
import { Calendar, dateFnsLocalizer, Views, EventProps, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sessao, Cliente } from '@/types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AgendaSemanal.css'; // Criaremos este arquivo para estilos customizados

// Configuração do localizador para usar date-fns com o idioma português
const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

// Tipos para os props do nosso componente
interface AgendaSemanalProps {
  sessoes: Sessao[];
  clientes: Cliente[];
  onSelectSessao: (sessao: Sessao) => void;
  onSelectSlot: (start: Date, end: Date) => void;
}

// Formato do evento que o react-big-calendar espera
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Sessao; // Guardamos a sessão original aqui
}

// Componente customizado para exibir o evento no calendário
const EventoCustomizado = ({ event }: EventProps<CalendarEvent>) => {
  const statusClasses = {
    AGENDADA: 'bg-blue-100 border-blue-500 text-blue-800',
    CONCLUIDA: 'bg-green-100 border-green-500 text-green-800',
    CANCELADA: 'bg-red-100 border-red-500 text-red-800',
  };
  
  return (
    <div className={`p-1 h-full text-xs rounded-md ${statusClasses[event.resource.status]}`}>
      <strong>{format(event.start, 'HH:mm')}</strong> - {event.title}
      <p className="truncate">{event.resource.nome}</p>
    </div>
  );
};

export const AgendaSemanal: React.FC<AgendaSemanalProps> = ({ sessoes, clientes, onSelectSessao, onSelectSlot }) => {

  // Converte nossas sessões para o formato que a biblioteca entende
  const eventos: CalendarEvent[] = sessoes.map(sessao => {
    const cliente = clientes.find(c => c.id === sessao.clienteId);
    return {
      id: sessao.id,
      title: cliente ? cliente.nome : 'Cliente desconhecido',
      start: new Date(sessao.dataHoraInicio),
      end: new Date(sessao.dataHoraFim),
      resource: sessao,
    };
  });

  // Função para estilizar os eventos baseados no status da sessão
  const eventPropGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    const style = {
      backgroundColor: '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    if (status === 'CONCLUIDA') {
      style.backgroundColor = '#28a745';
    } else if (status === 'CANCELADA') {
      style.backgroundColor = '#dc3545';
    }
    return { style };
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-white p-4 rounded-lg shadow-md">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={['day', 'week', 'month']}
        selectable
        onSelectEvent={(event) => onSelectSessao(event.resource)}
        onSelectSlot={(slotInfo) => onSelectSlot(slotInfo.start, slotInfo.end)}
        culture="pt-BR"
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há eventos neste período.",
          showMore: total => `+ Ver mais (${total})`
        }}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventoCustomizado, // Usamos nosso componente customizado
        }}
        min={new Date(0, 0, 0, 8, 0, 0)} // Início do dia às 8h
        max={new Date(0, 0, 0, 20, 0, 0)} // Fim do dia às 20h
      />
    </div>
  );
};