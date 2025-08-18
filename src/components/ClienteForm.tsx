import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cliente } from '@/types';
import { toast } from 'sonner';
import { createCliente, updateCliente } from '@/services/api';

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente | undefined;
  onSave: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  isOpen,
  onClose,
  cliente,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        ...cliente,
        dataNascimento: cliente.dataNascimento ? cliente.dataNascimento.split('T')[0] : '',
      } as Partial<Cliente>);
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        sexo: 'F',
        cidade: '',
        bairro: '',
        profissao: '',
        enderecoResidencial: '',
        enderecoComercial: '',
        naturalidade: '',
        estadoCivil: 'Solteiro'
      });
    }
  }, [cliente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    try {
      if (cliente && cliente.id) {
        await updateCliente(cliente.id, formData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await createCliente(formData as Omit<Cliente, 'id' | 'dataCadastro'>);
        toast.success('Cliente cadastrado com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o cliente.');
      console.error(error);
    }
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
                  value={formData.nome || ''}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone || ''}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento || ''}
                  onChange={(e) => handleChange('dataNascimento', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo ?? 'F'} onValueChange={(value) => handleChange('sexo', value)}>
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
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil ?? 'Solteiro'} onValueChange={(value) => handleChange('estadoCivil', value)}>
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
                  value={formData.profissao || ''}
                  onChange={(e) => handleChange('profissao', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="naturalidade">Naturalidade</Label>
                <Input
                  id="naturalidade"
                  value={formData.naturalidade || ''}
                  onChange={(e) => handleChange('naturalidade', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-medium">Endereço</h3>
            
            <div className="space-y-2">
              <Label htmlFor="enderecoResidencial">Endereço Residencial</Label>
              <Input
                id="enderecoResidencial"
                value={formData.enderecoResidencial || ''}
                onChange={(e) => handleChange('enderecoResidencial', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro || ''}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade || ''}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enderecoComercial">Endereço Comercial</Label>
              <Input
                id="enderecoComercial"
                value={formData.enderecoComercial || ''}
                onChange={(e) => handleChange('enderecoComercial', e.target.value)}
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