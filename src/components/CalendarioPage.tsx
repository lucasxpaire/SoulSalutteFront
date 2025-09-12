import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sessao } from '@/types';

interface CalendarioPageProps {
  // Mantemos as props para futuras funcionalidades, como o botão de adicionar
  onAddSessao: (date: Date) => void;
  onEditSessao: (sessao: Sessao) => void;
}

const CalendarioPage: React.FC<CalendarioPageProps> = ({ onAddSessao }) => {
  const googleCalendarEmbedUrl = "https://calendar.google.com/calendar/embed?src=soulsalutte%40gmail.com&ctz=America%2FSao_Paulo";

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agenda de Disponibilidade</h1>
          <p className="text-muted-foreground">
            Visualize os horários ocupados. Para agendar, entre em contato.
          </p>
        </div>
        <Button onClick={() => onAddSessao(new Date())}>
          <Plus className="w-4 h-4 mr-2" />
          Agendar Nova Sessão
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 rounded-lg overflow-hidden">
          {/* O iframe do Google Calendar ocupará todo o espaço do card */}
          <iframe
            src={googleCalendarEmbedUrl}
            style={{ borderWidth: 0 }}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarioPage;