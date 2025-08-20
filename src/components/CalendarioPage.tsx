import React, { useState, useEffect, useMemo } from 'react';
import { Sessao, Cliente } from '@/types';
import { getSessoes, getClientes } from '@/services/api';
import { isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { ContinuousCalendar } from './ContinuousCalendar';

interface CalendarioPageProps {
  onAddSessao: (date: Date, clienteId?: number) => void;
  onEditSessao: (sessao: Sessao) => void;
}

const CalendarioPage: React.FC<CalendarioPageProps> = ({ onAddSessao, onEditSessao }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessoesData = await getSessoes();
        setSessoes(sessoesData);
      } catch (error) {
        toast.error('Erro ao carregar agendamentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDayClick = (day: number, month: number, year: number) => {
    setSelectedDate(new Date(year, month, day));
  }

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-theme(spacing.16))]">
        <div className="flex-1 overflow-hidden">
            <ContinuousCalendar 
              onClick={handleDayClick} 
              onAddEventClick={() => onAddSessao(selectedDate || new Date())}
              sessoes={sessoes}
            />
        </div>
    </div>
  );
};

export default CalendarioPage;