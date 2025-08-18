import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sessao, Cliente } from '@/types';
import { toast } from 'sonner';
import { createSessao, updateSessao, getClientes } from '@/services/api';
import { format } from 'date-fns';

interface SessaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  sessao?: Sessao;
  initialDate?: Date;
  onSave: () => void;
}

const SessaoForm: React.FC<SessaoFormProps> = ({ isOpen, onClose, sessao, initialDate, onSave }) => {
  const [formData, setFormData] = useState<Partial<Sessao>>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    getClientes().then(setClientes).catch(() => toast.error("Falha ao carregar clientes."));
    
    if (sessao) {
      setFormData({
        ...sessao,
        dataHoraInicio: format(new Date(sessao.dataHoraInicio), "yyyy-MM-dd'T'HH:mm"),
        dataHoraFim: format(new Date(sessao.dataHoraFim), "yyyy-MM-dd'T'HH:mm"),
      });
    } else {
      setFormData({
        nome: 'Sessão de Fisioterapia',
        dataHoraInicio: format(initialDate || new Date(), "yyyy-MM-dd'T'09:00'"),
        dataHoraFim: format(initialDate || new Date(), "yyyy-MM-dd'T'10:00'"),
        status: 'AGENDADA',
        notasSessao: '',
      } as Partial<Sessao>); 
    }
  }, [sessao, initialDate, isOpen]);

  const handleChange = (field: keyof Sessao, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.clienteId || !formData.dataHoraInicio || !formData.dataHoraFim) {
      toast.error('Cliente e datas são obrigatórios.');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        nome: formData.nome || 'Sessão de Fisioterapia'
      };

      if (sessao && sessao.id) {
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
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sessao ? 'Editar Sessão' : 'Agendar Nova Sessão'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clienteId">Cliente</Label>
            <Select
              value={formData.clienteId?.toString() || ' '}
              onValueChange={value => handleChange('clienteId', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataHoraInicio">Início</Label>
              <Input id="dataHoraInicio" type="datetime-local" value={formData.dataHoraInicio || ''} onChange={e => handleChange('dataHoraInicio', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataHoraFim">Fim</Label>
              <Input id="dataHoraFim" type="datetime-local" value={formData.dataHoraFim || ''} onChange={e => handleChange('dataHoraFim', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status || ' '} onValueChange={value => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGENDADA">Agendada</SelectItem>
                <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notasSessao">Notas</Label>
            <Textarea id="notasSessao" value={formData.notasSessao || ''} onChange={e => handleChange('notasSessao', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessaoForm;
