import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { AvaliacaoFisioterapeutica } from '@/types';
import { toast } from 'sonner';
import { createAvaliacao, updateAvaliacao } from '@/services/api';

interface AvaliacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: number;
  avaliacao?: AvaliacaoFisioterapeutica;
  onSave: () => void;
}

const AvaliacaoForm: React.FC<AvaliacaoFormProps> = ({ isOpen, onClose, clienteId, avaliacao, onSave }) => {
  const [formData, setFormData] = useState<Partial<AvaliacaoFisioterapeutica>>({});

  useEffect(() => {
    if (avaliacao) {
      setFormData(avaliacao);
    } else {
      setFormData({
        clienteId: clienteId,
        dataAvaliacao: new Date().toISOString().split('T')[0],
        diagnosticoClinico: '',
        diagnosticoFisioterapeutico: '',
        queixaPrincipal: '',
        historiaClinica: '',
        avaliacaoDor: 0,
        objetivosTratamento: '',
      } as Partial<AvaliacaoFisioterapeutica>);
    }
  }, [avaliacao, clienteId, isOpen]);

  const handleChange = (field: keyof AvaliacaoFisioterapeutica, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData, clienteId };

      if (avaliacao && avaliacao.id) {
        await updateAvaliacao(avaliacao.id, dataToSave as AvaliacaoFisioterapeutica);
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        await createAvaliacao(dataToSave as Omit<AvaliacaoFisioterapeutica, 'id'>);
        toast.success('Avaliação criada com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar avaliação.');
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{avaliacao ? 'Editar Avaliação' : 'Nova Avaliação'}</DialogTitle>
          <DialogDescription>Preencha os detalhes da avaliação fisioterapêutica.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4">
          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Diagnóstico e Queixa Principal</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataAvaliacao">Data da Avaliação</Label>
                  <Input id="dataAvaliacao" type="date" value={formData.dataAvaliacao?.toString().split('T')[0] || ''} onChange={e => handleChange('dataAvaliacao', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
                  <Textarea id="queixaPrincipal" value={formData.queixaPrincipal || ''} onChange={e => handleChange('queixaPrincipal', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosticoClinico">Diagnóstico Clínico</Label>
                  <Textarea id="diagnosticoClinico" value={formData.diagnosticoClinico || ''} onChange={e => handleChange('diagnosticoClinico', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosticoFisioterapeutico">Diagnóstico Fisioterapêutico</Label>
                  <Textarea id="diagnosticoFisioterapeutico" value={formData.diagnosticoFisioterapeutico || ''} onChange={e => handleChange('diagnosticoFisioterapeutico', e.target.value)} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Anamnese</AccordionTrigger>
              <AccordionContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="historiaClinica">História Clínica (HMA, HMP, etc.)</Label>
                  <Textarea id="historiaClinica" value={formData.historiaClinica || ''} onChange={e => handleChange('historiaClinica', e.target.value)} rows={5} />
                </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>Plano de Tratamento</AccordionTrigger>
              <AccordionContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="objetivosTratamento">Objetivos do Tratamento</Label>
                  <Textarea id="objetivosTratamento" value={formData.objetivosTratamento || ''} onChange={e => handleChange('objetivosTratamento', e.target.value)} rows={5} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="planoTratamento">Plano de Tratamento</Label>
                  <Textarea id="planoTratamento" value={formData.planoTratamento || ''} onChange={e => handleChange('planoTratamento', e.target.value)} rows={5} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Salvar Avaliação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvaliacaoForm;
