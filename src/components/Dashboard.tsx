import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Users, FileText, Clock } from 'lucide-react';
import { mockSessoes, mockClientes, mockAvaliacoes } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Calcular estatísticas
  const totalClientes = mockClientes.length;
  const totalAvaliacoes = mockAvaliacoes.length;
  const sessoesHoje = mockSessoes.filter(sessao => {
    const hoje = format(new Date(), 'yyyy-MM-dd');
    const dataSessao = format(new Date(sessao.DATA_HORA_INICIO), 'yyyy-MM-dd');
    return dataSessao === hoje;
  });
  
  const sessoesAgendadas = mockSessoes.filter(sessao => sessao.STATUS === 'AGENDADA');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-primary text-primary-foreground';
      case 'CONCLUIDA':
        return 'bg-green-500 text-white';
      case 'CANCELADA':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs opacity-80">
              clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Hoje</CardTitle>
            <CalendarDays className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessoesHoje.length}</div>
            <p className="text-xs opacity-80">
              sessões agendadas para hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvaliacoes}</div>
            <p className="text-xs opacity-80">
              fichas de avaliação
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Sessões</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessoesAgendadas.length}</div>
            <p className="text-xs opacity-80">
              sessões agendadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Próximas Sessões do Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Sessões de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessoesHoje.length > 0 ? (
                sessoesHoje.map((sessao) => {
                  const cliente = mockClientes.find(c => c.ID_CLIENTE === sessao.CLIENTE_ID);
                  const horario = format(new Date(sessao.DATA_HORA_INICIO), 'HH:mm', { locale: ptBR });
                  
                  return (
                    <div key={sessao.ID_SESSAO} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{cliente?.NOME}</div>
                        <div className="text-sm text-muted-foreground">{horario}</div>
                        {sessao.NOTAS_SESSAO && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {sessao.NOTAS_SESSAO}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(sessao.STATUS)}>
                        {sessao.STATUS.toLowerCase()}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma sessão agendada para hoje
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessões Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSessoes.map((sessao) => {
              const cliente = mockClientes.find(c => c.ID_CLIENTE === sessao.CLIENTE_ID);
              const dataFormatada = format(new Date(sessao.DATA_HORA_INICIO), 'dd/MM/yyyy HH:mm', { locale: ptBR });
              
              return (
                <div key={sessao.ID_SESSAO} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{cliente?.NOME}</div>
                    <div className="text-sm text-muted-foreground">{dataFormatada}</div>
                    {sessao.NOTAS_SESSAO && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {sessao.NOTAS_SESSAO}
                      </div>
                    )}
                  </div>
                  <Badge className={getStatusColor(sessao.STATUS)}>
                    {sessao.STATUS.toLowerCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;