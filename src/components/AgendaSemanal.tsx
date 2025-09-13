// src/components/AgendaSemanal.tsx

import React from 'react';
import { Calendar, dateFnsLocalizer, Views, EventProps, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sessao, Cliente } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AgendaSemanal.css';

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

interface AgendaSemanalProps {
  sessoes: Sessao[];
  clientes: Cliente[];
  onSelectSessao: (sessao: Sessao) => void;
  onDeleteSessao: (sessao: Sessao) => void; // Nova propriedade
  onSelectSlot: (start: Date, end: Date) => void;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Sessao;
}

const EventoCustomizado = ({ event }: EventProps<CalendarEvent>) => {
  const statusClasses = {
    AGENDADA: 'bg-blue-100 border-l-4 border-blue-500 text-blue-800',
    CONCLUIDA: 'bg-green-100 border-l-4 border-green-500 text-green-800',
    CANCELADA: 'bg-red-100 border-l-4 border-red-500 text-red-800',
  };
  
  return (
    <div className={`p-1 h-full text-xs rounded-md ${statusClasses[event.resource.status]}`}>
      <strong>{format(event.start, 'HH:mm')}</strong> - {event.title}
      <p className="truncate">{event.resource.nome}</p>
    </div>
  );
};

export const AgendaSemanal: React.FC<AgendaSemanalProps> = ({ sessoes, clientes, onSelectSessao, onDeleteSessao, onSelectSlot }) => {
  
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

  const eventPropGetter = (event: CalendarEvent) => {
    return { className: `cursor-pointer` };
  };

  const EventWrapper: React.FC<{ children: React.ReactElement, event: CalendarEvent }> = ({ children, event }) => {
    return (
      <Popover>
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</PopoverTrigger>
        <PopoverContent className="w-56 p-2" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{event.title}</h4>
            <p className="text-sm text-muted-foreground">
              {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onSelectSessao(event.resource)}
            >
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full justify-start"
              onClick={() => onDeleteSessao(event.resource)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
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
          event: EventoCustomizado,
          eventWrapper: EventWrapper,
        }}
        min={new Date(0, 0, 0, 6, 0, 0)}
        max={new Date(0, 0, 0, 23, 0, 0)}
      />
    </div>
  );
};