import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from './ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Sessao, Cliente } from '@/types';
import { toast } from 'sonner';
import { createSessao, updateSessao, getClientes, getDisponibilidade } from '@/services/api';
import { format, addMinutes, parseISO, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Calendar as CalendarIcon, Mail, ClipboardList, Clock, Timer } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface BusyPeriod {
  start: { dateTime: string };
  end: { dateTime: string };
}

const sessionDurations = [
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '120 min' },
];

const SessaoForm: React.FC<{ isOpen: boolean; onClose: () => void; sessao?: Sessao; initialDate?: Date; initialClienteId?: number; onSave: () => void; }> = ({ isOpen, onClose, sessao, initialDate, initialClienteId, onSave }) => {
  const [formData, setFormData] = useState<Partial<Sessao>>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [busySlots, setBusySlots] = useState<BusyPeriod[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentSessionDuration, setCurrentSessionDuration] = useState<number>(60);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
        getClientes().then(setClientes).catch(() => toast.error("Falha ao carregar clientes."));
        
        if (sessao) {
            const startDate = new Date(sessao.dataHoraInicio);
            const endDate = new Date(sessao.dataHoraFim);
            const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
            
            setFormData(sessao);
            setSelectedDate(startDate);
            setSelectedTime(format(startDate, 'HH:mm'));
            setCurrentSessionDuration(duration);
        } else {
            const defaultDate = initialDate || new Date();
            const newSessionData: Partial<Sessao> = {
                nome: 'Sessão de Fisioterapia',
                status: 'AGENDADA',
                notasSessao: '',
                notificacao: true,
            };

            if (initialClienteId !== undefined) {
                newSessionData.clienteId = initialClienteId;
            }
            
            setFormData(newSessionData);
            setSelectedDate(defaultDate);
            setSelectedTime(null);
            setCurrentSessionDuration(60);
        }
    }
  }, [sessao, initialDate, initialClienteId, isOpen]);

  useEffect(() => {
    if (!selectedDate || !isOpen) return;

    const fetchAvailability = async () => {
        setIsLoadingSlots(true);
        setSelectedTime(null);
        setFormData(prev => {
            const newState = {...prev};
            delete newState.dataHoraInicio;
            delete newState.dataHoraFim;
            return newState;
        });
        try {
            const dateString = format(selectedDate, 'yyyy-MM-dd');
            const busyData = await getDisponibilidade(dateString);
            setBusySlots(busyData);
        } catch (error) {
            toast.error('Não foi possível carregar os horários da agenda.');
            setBusySlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    };
    fetchAvailability();
  }, [selectedDate, isOpen]);

  const availableTimeSlots = useMemo(() => {
    const startHour = 8;
    const endHour = 18;
    const interval = 30;

    const slots: { time: string; isBusy: boolean }[] = [];
    const now = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

    for (let currentSlotMinutes = startHour * 60; currentSlotMinutes < endHour * 60; currentSlotMinutes += interval) {
        const hour = Math.floor(currentSlotMinutes / 60);
        const minute = currentSlotMinutes % 60;
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const slotStartDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${timeString}:00`);
        const slotEndDateTime = addMinutes(slotStartDateTime, currentSessionDuration);

        if (isToday && isBefore(slotStartDateTime, now)) {
            slots.push({ time: timeString, isBusy: true });
            continue;
        }

        const isSlotBusy = busySlots.some(busyPeriod => {
            const busyStart = parseISO(busyPeriod.start.dateTime);
            const busyEnd = parseISO(busyPeriod.end.dateTime);
            return isBefore(slotStartDateTime, busyEnd) && isBefore(busyStart, slotEndDateTime);
        });

        slots.push({ time: timeString, isBusy: isSlotBusy });
    }
    return slots;
  }, [selectedDate, busySlots, currentSessionDuration]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsCalendarOpen(false);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    const startDate = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${time}`);
    const endDate = addMinutes(startDate, currentSessionDuration);
    setFormData(prev => ({
        ...prev,
        dataHoraInicio: format(startDate, "yyyy-MM-dd'T'HH:mm"),
        dataHoraFim: format(endDate, "yyyy-MM-dd'T'HH:mm"),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.dataHoraInicio) {
      toast.error('Cliente, data e horário são obrigatórios.');
      return;
    }
    try {
      const dataToSave = { ...formData };
      if (sessao?.id) {
        await updateSessao(sessao.id, dataToSave as Sessao);
        toast.success('Sessão atualizada com sucesso!');
      } else {
        await createSessao(dataToSave as Omit<Sessao, 'id'>);
        toast.success('Sessão agendada com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar sessão.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col p-0 bg-card">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl text-primary">{sessao ? 'Editar Sessão' : 'Agendar Nova Sessão'}</DialogTitle>
          <DialogDescription>Selecione o cliente, a data, a duração e o horário para o agendamento.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente *</Label>
                    <Select value={formData.clienteId?.toString() || ''} onValueChange={value => setFormData(p => ({...p, clienteId: Number(value)}))}>
                        <SelectTrigger><div className='flex items-center'><User className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Selecione um cliente" /></div></SelectTrigger>
                        <SelectContent>{clientes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Data da Sessão *</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    // A LINHA "initialFocus" FOI REMOVIDA DAQUI
                                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sessionDuration">Duração da Sessão *</Label>
                        <Select value={currentSessionDuration.toString()} onValueChange={v => setCurrentSessionDuration(Number(v))}>
                            <SelectTrigger className="w-full sm:w-[180px]"><div className="flex items-center gap-2"><Timer className="w-4 h-4 text-muted-foreground"/><SelectValue /></div></SelectTrigger>
                            <SelectContent>{sessionDurations.map(d => <SelectItem key={d.value} value={d.value.toString()}>{d.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Horários Disponíveis para {format(selectedDate, 'dd/MM')} *</Label>
                    {isLoadingSlots ? <div className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2 animate-spin" /> Carregando...</div> :
                        <div className="grid grid-cols-4 gap-2">
                            {availableTimeSlots.map(({ time, isBusy }) => (
                                <Button key={time} type="button" variant={selectedTime === time ? "default" : "outline"} disabled={isBusy} onClick={() => handleTimeSelect(time)}>
                                    {time}
                                </Button>
                            ))}
                        </div>
                    }
                    {!isLoadingSlots && availableTimeSlots.filter(s => !s.isBusy).length === 0 && <p className="text-sm text-center text-muted-foreground pt-2">Nenhum horário disponível para este dia.</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notasSessao">Notas Adicionais</Label>
                <Textarea id="notasSessao" value={formData.notasSessao || ''} onChange={e => setFormData(p => ({...p, notasSessao: e.target.value}))} placeholder="Adicione observações sobre a sessão..." className="bg-muted/50"/>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="email-notification" className="flex items-center text-base"><Mail className="w-5 h-5 mr-2 text-primary" />Notificar paciente por E-mail</Label>
                    <DialogDescription>Uma confirmação será enviada para o e-mail cadastrado.</DialogDescription>
                </div>
                <Switch id="email-notification" checked={formData.notificacao ?? false} onCheckedChange={(checked) => setFormData(p => ({...p, notificacao: checked}))}/>
            </div>
        </form>
        
        <DialogFooter className="p-6 border-t bg-muted/50">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{sessao ? 'Salvar Alterações' : 'Agendar Sessão'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessaoForm;