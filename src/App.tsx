import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ClientesPage from '@/components/ClientesPage';
import ClienteDetalhesPage from '@/components/ClienteDetalhesPage';
import CalendarioPage from '@/components/CalendarioPage';
import ClienteForm from '@/components/ClienteForm';
import AvaliacaoForm from '@/components/AvaliacaoForm';
import SessaoForm from '@/components/SessaoForm';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { Toaster } from '@/components/ui/sonner';
import { Cliente, Sessao } from '@/types';
import 'date-fns/locale/pt-BR';
import { deleteCliente as apiDeleteCliente } from '@/services/api';
import { toast } from 'sonner';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Modal states
  const [isClienteFormOpen, setIsClienteFormOpen] = useState(false);
  const [isAvaliacaoFormOpen, setIsAvaliacaoFormOpen] = useState(false);
  const [isSessaoFormOpen, setIsSessaoFormOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(undefined);
  const [editingSessao, setEditingSessao] = useState<Sessao | undefined>(undefined);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [avaliacaoClienteId, setAvaliacaoClienteId] = useState<number>(0);
  const [initialSessaoDate, setInitialSessaoDate] = useState<Date>(new Date());

  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  // Handlers
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedCliente(null);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setCurrentPage('cliente-detalhes');
  };

  const handleBack = () => {
    setSelectedCliente(null);
    setCurrentPage('clientes');
    forceRefresh();
  };

  const handleAddCliente = () => {
    setEditingCliente(undefined);
    setIsClienteFormOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsClienteFormOpen(true);
  };

  const handleSaveCliente = () => {
    setIsClienteFormOpen(false);
    setEditingCliente(undefined);
    forceRefresh();
    if (!selectedCliente) {
      setCurrentPage('clientes');
    }
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteCliente = async () => {
    if (clienteToDelete) {
      try {
        await apiDeleteCliente(clienteToDelete.id);
        toast.success(`Cliente ${clienteToDelete.nome} excluído com sucesso.`);
        setClienteToDelete(null);
        setIsConfirmDeleteDialogOpen(false);
        handleBack();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao excluir cliente.');
      }
    }
  };

  const handleAddAvaliacao = (clienteId: number) => {
    setAvaliacaoClienteId(clienteId);
    setIsAvaliacaoFormOpen(true);
  };
  
  const handleSaveAvaliacao = () => {
    setIsAvaliacaoFormOpen(false);
    forceRefresh();
  };

  const handleAddSessao = (date: Date) => {
    setEditingSessao(undefined);
    setInitialSessaoDate(date);
    setIsSessaoFormOpen(true);
  };

  const handleEditSessao = (sessao: Sessao) => {
    setEditingSessao(sessao);
    setIsSessaoFormOpen(true);
  };

  const handleSaveSessao = () => {
    setIsSessaoFormOpen(false);
    setEditingSessao(undefined);
    forceRefresh();
  };

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard key={refreshKey} />;
      
      case 'clientes':
        return (
          <ClientesPage
            key={refreshKey}
            onSelectCliente={handleSelectCliente}
            onAddCliente={handleAddCliente}
          />
        );
      
      case 'cliente-detalhes':
        return selectedCliente ? (
          <ClienteDetalhesPage
            key={selectedCliente.id + refreshKey}
            cliente={selectedCliente}
            onBack={handleBack}
            onEdit={handleEditCliente}
            onDelete={handleDeleteCliente}
            onAddAvaliacao={handleAddAvaliacao}
          />
        ) : null;
      
      case 'calendario':
        return <CalendarioPage key={refreshKey} onAddSessao={handleAddSessao} onEditSessao={handleEditSessao} />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
      
      <ClienteForm
        isOpen={isClienteFormOpen}
        onClose={() => setIsClienteFormOpen(false)}
        cliente={editingCliente}
        onSave={handleSaveCliente}
      />

      <AvaliacaoForm
        isOpen={isAvaliacaoFormOpen}
        onClose={() => setIsAvaliacaoFormOpen(false)}
        clienteId={avaliacaoClienteId}
        onSave={handleSaveAvaliacao}
      />

      <SessaoForm
        isOpen={isSessaoFormOpen}
        onClose={() => setIsSessaoFormOpen(false)}
        {...(editingSessao && { sessao: editingSessao })}
        initialDate={initialSessaoDate}
        onSave={handleSaveSessao}
      />

      <ConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={confirmDeleteCliente}
        title="Confirmar Exclusão"
        description={`Você tem certeza que deseja excluir o cliente "${clienteToDelete?.nome}"? Esta ação não pode ser desfeita.`}
      />
      
      <Toaster />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
