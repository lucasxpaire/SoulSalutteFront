// src/components/CalendarioPage.tsx

"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Sessao, Cliente } from "@/types";
import { getSessoes, getClientes } from "@/services/api";
import { toast } from "sonner";
import { AgendaSemanal } from "./AgendaSemanal";

interface CalendarioPageProps {
  onAddSessao: (date: Date) => void;
  onEditSessao: (sessao: Sessao) => void;
  onDeleteSessao: (sessao: Sessao) => void; // Nova propriedade
}

const CalendarioPage: React.FC<CalendarioPageProps> = ({ onAddSessao, onEditSessao, onDeleteSessao }) => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessoesData, clientesData] = await Promise.all([getSessoes(), getClientes()]);
      setSessoes(sessoesData);
      setClientes(clientesData);
    } catch (error) {
      toast.error("Erro ao carregar dados do calendário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);
  
  const handleSelectSlot = (start: Date) => {
    onAddSessao(start);
  };

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Agenda
          </h1>
          <p className="text-muted-foreground">Gerencie suas sessões de forma rápida e intuitiva.</p>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando agendamentos...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <AgendaSemanal
            sessoes={sessoes}
            clientes={clientes}
            onSelectSessao={onEditSessao}
            onDeleteSessao={onDeleteSessao} // Passando a nova função
            onSelectSlot={handleSelectSlot}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarioPage;