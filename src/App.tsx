import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ClientesPage from '@/components/ClientesPage';
import ClienteForm from '@/components/ClienteForm';
import { Toaster } from '@/components/ui/sonner';
import { Cliente, AvaliacaoFisioterapeutica } from '@/types';
import 'date-fns/locale/pt-BR';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  
  // Modal states
  const [isClienteFormOpen, setIsClienteFormOpen] = useState(false);
  const [isAvaliacaoFormOpen, setIsAvaliacaoFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(undefined);
  const [editingAvaliacao, setEditingAvaliacao] = useState<AvaliacaoFisioterapeutica | undefined>(undefined);
  const [avaliacaoClienteId, setAvaliacaoClienteId] = useState<string>('');

  // Handlers
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedCliente(null);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setCurrentPage('cliente-detalhes');
  };

  const handleBackFromClienteDetalhes = () => {
    setSelectedCliente(null);
    setCurrentPage('clientes');
  };

  const handleAddCliente = () => {
    setEditingCliente(undefined);
    setIsClienteFormOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsClienteFormOpen(true);
  };

  const handleSaveCliente = (cliente: Cliente) => {
    // Simula salvamento - em produção faria POST/PUT para API
    console.log('Salvando cliente:', cliente);
    setIsClienteFormOpen(false);
    setEditingCliente(undefined);
  };

  const handleAddAvaliacao = (clienteId: string) => {
    setAvaliacaoClienteId(clienteId);
    setEditingAvaliacao(undefined);
    setIsAvaliacaoFormOpen(true);
  };

  const handleEditAvaliacao = (avaliacao: AvaliacaoFisioterapeutica) => {
    setAvaliacaoClienteId(avaliacao.ID_CLIENTE);
    setEditingAvaliacao(avaliacao);
    setIsAvaliacaoFormOpen(true);
  };

  const handleSaveAvaliacao = (avaliacao: AvaliacaoFisioterapeutica) => {
    // Simula salvamento - em produção faria POST/PUT para API
    console.log('Salvando avaliação:', avaliacao);
    setIsAvaliacaoFormOpen(false);
    setEditingAvaliacao(undefined);
    setAvaliacaoClienteId('');
  };

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'clientes':
        return (
          <ClientesPage
            onSelectCliente={handleSelectCliente}
            onAddCliente={handleAddCliente}
          />
        );
      
      case 'cliente-detalhes':
        return selectedCliente ? (
          <div className="p-6">
            <h1>Detalhes do Cliente: {selectedCliente.NOME}</h1>
            <p>Componente ClienteDetalhes será implementado em breve...</p>
            <button onClick={handleBackFromClienteDetalhes} className="mt-4 px-4 py-2 bg-primary text-white rounded">
              Voltar para Clientes
            </button>
          </div>
        ) : null;
      
      case 'calendario':
        return (
          <div className="p-6">
            <h1>Calendário</h1>
            <p>Componente CalendarioPage será implementado em breve...</p>
          </div>
        );
      
      case 'avaliacoes':
        return (
          <div className="p-6">
            <h1>Avaliações</h1>
            <p>Componente AvaliacoesPage será implementado em breve...</p>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
      
      {/* Modals */}
      <ClienteForm
        isOpen={isClienteFormOpen}
        onClose={() => setIsClienteFormOpen(false)}
        cliente={editingCliente}
        onSave={handleSaveCliente}
      />
      
      {/* Temporariamente comentado até migrar o componente */}
      {/*
      <AvaliacaoForm
        isOpen={isAvaliacaoFormOpen}
        onClose={() => setIsAvaliacaoFormOpen(false)}
        clienteId={avaliacaoClienteId}
        avaliacao={editingAvaliacao}
        onSave={handleSaveAvaliacao}
      />
      */}
      
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