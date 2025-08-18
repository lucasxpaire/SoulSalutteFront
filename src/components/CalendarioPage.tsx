import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { PlusCircle, Edit } from 'lucide-react';
import { Sessao, Cliente } from '@/types';
import { getSessoes, getClientes } from '@/services/api';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface CalendarioPageProps {
  onAddSessao: (date: Date) => void;
  onEditSessao: (sessao: Sessao) => void;
}

const CalendarioPage: React.FC<CalendarioPageProps> = ({ onAddSessao, onEditSessao }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessoesData, clientesData] = await Promise.all([getSessoes(), getClientes()]);
        setSessoes(sessoesData);
        setClientes(clientesData);
      } catch (error) {
        toast.error('Erro ao carregar agendamentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const clienteMap = useMemo(() => {
    return new Map(clientes.map(c => [c.id, c.nome]));
  }, [clientes]);

  const sessoesDoDia = useMemo(() => {
    if (!selectedDate) return [];
    return sessoes
      .filter(sessao => isSameDay(new Date(sessao.dataHoraInicio), selectedDate))
      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
  }, [sessoes, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA': return 'bg-blue-500 hover:bg-blue-500 text-white';
      case 'CONCLUIDA': return 'bg-green-500 hover:bg-green-500 text-white';
      case 'CANCELADA': return 'bg-red-500 hover:bg-red-500 text-white';
      default: return 'bg-gray-500 hover:bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Calendário de Agendamentos</h1>
          <p className="text-muted-foreground">Visualize e gerencie as sessões.</p>
        </div>
        <Button onClick={() => onAddSessao(selectedDate || new Date())}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="p-3"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Sessões para {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando...</p>
              ) : sessoesDoDia.length > 0 ? (
                <div className="space-y-4">
                  {sessoesDoDia.map(sessao => (
                    <div key={sessao.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-bold">{clienteMap.get(sessao.clienteId) || 'Cliente não encontrado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(sessao.dataHoraInicio), 'HH:mm')} - {format(new Date(sessao.dataHoraFim), 'HH:mm')}
                        </p>
                        <p className="text-xs mt-1">{sessao.notasSessao}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Badge className={getStatusColor(sessao.status)}>{sessao.status}</Badge>
                         <Button variant="ghost" size="icon" onClick={() => onEditSessao(sessao)}>
                            <Edit className="w-4 h-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhuma sessão para esta data.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;
