import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { mockClientes } from '@/data/mockData';
import { Cliente } from '@/types';

interface ClientesPageProps {
  onSelectCliente: (cliente: Cliente) => void;
  onAddCliente: () => void;
}

const ClientesPage: React.FC<ClientesPageProps> = ({ onSelectCliente, onAddCliente }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClientes = mockClientes.filter(cliente =>
    cliente.NOME.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.EMAIL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.TELEFONE.includes(searchTerm)
  );

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus pacientes e suas informações
          </p>
        </div>
        <Button onClick={onAddCliente} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Barra de Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockClientes.length}</div>
            <p className="text-sm opacity-80">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredClientes.length}</div>
            <p className="text-sm opacity-80">Resultados da Busca</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockClientes.filter(c => c.SEXO === 'F').length}/{mockClientes.filter(c => c.SEXO === 'M').length}
            </div>
            <p className="text-sm opacity-80">Mulheres / Homens</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map((cliente) => (
          <Card 
            key={cliente.ID_CLIENTE} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectCliente(cliente)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{cliente.NOME}</CardTitle>
                <Badge variant={cliente.SEXO === 'F' ? 'secondary' : 'outline'}>
                  {cliente.SEXO === 'F' ? 'F' : 'M'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{cliente.EMAIL}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                <span>{formatarTelefone(cliente.TELEFONE)}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{cliente.BAIRRO}, {cliente.CIDADE}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  {calcularIdade(cliente.DATA_NASCIMENTO)} anos
                </span>
                <span className="text-sm text-muted-foreground">
                  {cliente.PROFISSAO}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Cadastrado em {cliente.DATA_CADASTRO ? new Date(cliente.DATA_CADASTRO).toLocaleDateString('pt-BR') : 'Data não informada'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum cliente encontrado com os termos da busca.
            </p>
            <Button 
              onClick={onAddCliente} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientesPage;