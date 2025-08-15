import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cliente } from '@/types';
import { toast } from 'sonner';

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente | undefined;
  onSave: (cliente: Cliente) => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  isOpen,
  onClose,
  cliente,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({
    NOME: '',
    EMAIL: '',
    TELEFONE: '',
    DATA_NASCIMENTO: '',
    SEXO: 'F',
    CIDADE: '',
    BAIRRO: '',
    PROFISSAO: '',
    ENDERECO_RESIDENCIAL: '',
    ENDERECO_COMERCIAL: '',
    NATURALIDADE: '',
    ESTADO_CIVIL: 'Solteiro'
  });

  useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      setFormData({
        NOME: '',
        EMAIL: '',
        TELEFONE: '',
        DATA_NASCIMENTO: '',
        SEXO: 'F',
        CIDADE: '',
        BAIRRO: '',
        PROFISSAO: '',
        ENDERECO_RESIDENCIAL: '',
        ENDERECO_COMERCIAL: '',
        NATURALIDADE: '',
        ESTADO_CIVIL: 'Solteiro'
      });
    }
  }, [cliente, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.NOME || !formData.EMAIL || !formData.TELEFONE) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    const clienteToSave: Cliente = {
      ID_CLIENTE: cliente?.ID_CLIENTE || Date.now().toString(),
      DATA_CADASTRO: cliente?.DATA_CADASTRO ?? new Date().toISOString().split('T')[0],
      NOME: formData.NOME!,
      EMAIL: formData.EMAIL!,
      TELEFONE: formData.TELEFONE!,
      DATA_NASCIMENTO: formData.DATA_NASCIMENTO || '',
      SEXO: formData.SEXO as 'M' | 'F' | 'Outro',
      CIDADE: formData.CIDADE || '',
      BAIRRO: formData.BAIRRO || '',
      PROFISSAO: formData.PROFISSAO || '',
      ENDERECO_RESIDENCIAL: formData.ENDERECO_RESIDENCIAL || '',
      ENDERECO_COMERCIAL: formData.ENDERECO_COMERCIAL || '',
      NATURALIDADE: formData.NATURALIDADE || '',
      ESTADO_CIVIL: formData.ESTADO_CIVIL as 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo' | 'União Estável'
    };

    onSave(clienteToSave);
    toast.success(cliente ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
    onClose();
  };

  const handleChange = (field: keyof Cliente, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {cliente 
              ? 'Atualize as informações do cliente'
              : 'Preencha os dados do novo cliente'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-medium">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.NOME}
                  onChange={(e) => handleChange('NOME', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.EMAIL}
                  onChange={(e) => handleChange('EMAIL', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.TELEFONE}
                  onChange={(e) => handleChange('TELEFONE', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.DATA_NASCIMENTO}
                  onChange={(e) => handleChange('DATA_NASCIMENTO', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.SEXO ?? ''} onValueChange={(value) => handleChange('SEXO', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado_civil">Estado Civil</Label>
                <Select value={formData.ESTADO_CIVIL ?? 'Solteiro'} onValueChange={(value) => handleChange('ESTADO_CIVIL', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                    <SelectItem value="União Estável">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.PROFISSAO}
                  onChange={(e) => handleChange('PROFISSAO', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="naturalidade">Naturalidade</Label>
                <Input
                  id="naturalidade"
                  value={formData.NATURALIDADE}
                  onChange={(e) => handleChange('NATURALIDADE', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-medium">Endereço</h3>
            
            <div className="space-y-2">
              <Label htmlFor="endereco_residencial">Endereço Residencial</Label>
              <Input
                id="endereco_residencial"
                value={formData.ENDERECO_RESIDENCIAL}
                onChange={(e) => handleChange('ENDERECO_RESIDENCIAL', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.BAIRRO}
                  onChange={(e) => handleChange('BAIRRO', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.CIDADE}
                  onChange={(e) => handleChange('CIDADE', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco_comercial">Endereço Comercial</Label>
              <Input
                id="endereco_comercial"
                value={formData.ENDERECO_COMERCIAL}
                onChange={(e) => handleChange('ENDERECO_COMERCIAL', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {cliente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;