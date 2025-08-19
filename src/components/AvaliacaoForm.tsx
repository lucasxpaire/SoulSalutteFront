import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
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

const initialFormData = {
    dataAvaliacao: new Date().toISOString().split('T')[0],
    diagnosticoClinico: '',
    diagnosticoFisioterapeutico: '',
    queixaPrincipal: '',
    historiaClinica: '',
    habitosVida: '',
    hma: '',
    hmp: '',
    antecedentesPessoais: '',
    antecedentesFamiliares: '',
    tratamentosRealizados: '',
    deambulando: false,
    deambulandoComApoio: false,
    cadeiraDeRodas: false,
    internado: false,
    orientado: false,
    temExamesComplementares: false,
    examesComplementaresDescricao: '',
    usaMedicamentos: false,
    medicamentosDescricao: '',
    realizouCirurgia: false,
    cirurgiasDescricao: '',
    inspecaoNormal: false,
    inspecaoEdema: false,
    inspecaoCicatrizacaoIncompleta: false,
    inspecaoEritemas: false,
    inspecaoOutros: false,
    inspecaoOutrosDescricao: '',
    semiologia: '',
    testesEspecificos: '',
    avaliacaoDor: 0,
    objetivosTratamento: '',
    recursosTerapeuticos: '',
    planoTratamento: '',
    evolucao: '',
} as Omit<AvaliacaoFisioterapeutica, 'id' | 'clienteId'>;

const CheckboxWithLabel: React.FC<{id: string, label: string, checked: boolean, onCheckedChange: (checked: boolean) => void}> = ({id, label, checked, onCheckedChange}) => (
    <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id} className="font-normal">{label}</Label>
    </div>
);

const ConditionalTextarea: React.FC<{
    checkboxId: string;
    checkboxLabel: string;
    textareaId: string;
    textareaPlaceholder: string;
    isChecked: boolean;
    textValue: string;
    onCheckedChange: (checked: boolean) => void;
    onTextChange: (value: string) => void;
}> = ({ checkboxId, checkboxLabel, textareaId, textareaPlaceholder, isChecked, textValue, onCheckedChange, onTextChange }) => (
    <div className="space-y-2">
        <h4 className="font-semibold">{checkboxLabel}</h4>
        <div className="flex items-center space-x-4 p-2">
            <div className="flex items-center space-x-2">
                <Checkbox id={`${checkboxId}-sim`} checked={isChecked} onCheckedChange={onCheckedChange} />
                <Label htmlFor={`${checkboxId}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id={`${checkboxId}-nao`} checked={!isChecked} onCheckedChange={(c) => onCheckedChange(!c)} />
                <Label htmlFor={`${checkboxId}-nao`}>Não</Label>
            </div>
        </div>
        {isChecked && <Textarea id={textareaId} placeholder={textareaPlaceholder} value={textValue} onChange={(e) => onTextChange(e.target.value)} />}
    </div>
);


const AvaliacaoForm: React.FC<AvaliacaoFormProps> = ({ isOpen, onClose, clienteId, avaliacao, onSave }) => {
  const [formData, setFormData] = useState<Partial<AvaliacaoFisioterapeutica>>(initialFormData);

  useEffect(() => {
    if (avaliacao) {
      setFormData(avaliacao);
    } else {
      setFormData({ ...initialFormData, clienteId });
    }
  }, [avaliacao, clienteId, isOpen]);

  const handleChange = (field: keyof AvaliacaoFisioterapeutica, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (avaliacao && avaliacao.id) {
        await updateAvaliacao(avaliacao.id, formData as AvaliacaoFisioterapeutica);
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        await createAvaliacao(formData as Omit<AvaliacaoFisioterapeutica, 'id'>);
        toast.success('Avaliação criada com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar avaliação.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{avaliacao ? 'Editar Avaliação' : 'Nova Avaliação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4">
          
          <div className="space-y-2">
              <Label htmlFor="dataAvaliacao">Data da Avaliação</Label>
              <Input id="dataAvaliacao" type="date" value={formData.dataAvaliacao?.toString().split('T')[0] || ''} onChange={e => handleChange('dataAvaliacao', e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="diagnosticoClinico">Diagnóstico Clínico</Label>
              <Textarea id="diagnosticoClinico" value={formData.diagnosticoClinico || ''} onChange={e => handleChange('diagnosticoClinico', e.target.value)} />
          </div>
          <div className="space-y-2">
              <Label htmlFor="diagnosticoFisioterapeutico">Diagnóstico Fisioterapêutico</Label>
              <Textarea id="diagnosticoFisioterapeutico" value={formData.diagnosticoFisioterapeutico || ''} onChange={e => handleChange('diagnosticoFisioterapeutico', e.target.value)} />
          </div>

          <Accordion type="multiple" defaultValue={['item-2']} className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger>2.0 AVALIAÇÃO</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="queixaPrincipal">2.2 Queixa Principal do Paciente</Label>
                    <Textarea id="queixaPrincipal" value={formData.queixaPrincipal || ''} onChange={e => handleChange('queixaPrincipal', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="historiaClinica">2.1 História Clínica</Label>
                    <Textarea id="historiaClinica" value={formData.historiaClinica || ''} onChange={e => handleChange('historiaClinica', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="habitosVida">2.3 Hábitos de Vida</Label>
                    <Textarea id="habitosVida" value={formData.habitosVida || ''} onChange={e => handleChange('habitosVida', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hma">2.4 HMA (História da Moléstia Atual)</Label>
                    <Textarea id="hma" value={formData.hma || ''} onChange={e => handleChange('hma', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hmp">2.5 HMP (História da Moléstia Pregressa)</Label>
                    <Textarea id="hmp" value={formData.hmp || ''} onChange={e => handleChange('hmp', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="antecedentesPessoais">2.6 Antecedentes Pessoais</Label>
                    <Textarea id="antecedentesPessoais" value={formData.antecedentesPessoais || ''} onChange={e => handleChange('antecedentesPessoais', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="antecedentesFamiliares">2.7 Antecedentes Familiares</Label>
                    <Textarea id="antecedentesFamiliares" value={formData.antecedentesFamiliares || ''} onChange={e => handleChange('antecedentesFamiliares', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tratamentosRealizados">2.8 Tratamentos Realizados</Label>
                    <Textarea id="tratamentosRealizados" value={formData.tratamentosRealizados || ''} onChange={e => handleChange('tratamentosRealizados', e.target.value)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3.0 EXAME CLÍNICO/FÍSICO</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                    <h4 className="font-semibold">3.1 Apresentação do Paciente</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                        <CheckboxWithLabel id="deambulando" label="Deambulando" checked={!!formData.deambulando} onCheckedChange={c => handleChange('deambulando', c)} />
                        <CheckboxWithLabel id="deambulandoComApoio" label="Com Apoio" checked={!!formData.deambulandoComApoio} onCheckedChange={c => handleChange('deambulandoComApoio', c)} />
                        <CheckboxWithLabel id="cadeiraDeRodas" label="Cadeira de Rodas" checked={!!formData.cadeiraDeRodas} onCheckedChange={c => handleChange('cadeiraDeRodas', c)} />
                        <CheckboxWithLabel id="internado" label="Internado" checked={!!formData.internado} onCheckedChange={c => handleChange('internado', c)} />
                        <CheckboxWithLabel id="orientado" label="Orientado" checked={!!formData.orientado} onCheckedChange={c => handleChange('orientado', c)} />
                    </div>
                </div>
                <ConditionalTextarea
                    checkboxId="examesComp"
                    checkboxLabel="3.2 Exames Complementares"
                    textareaId="examesCompDesc"
                    textareaPlaceholder="Se sim, quais?"
                    isChecked={!!formData.temExamesComplementares}
                    textValue={formData.examesComplementaresDescricao || ''}
                    onCheckedChange={c => handleChange('temExamesComplementares', c)}
                    onTextChange={v => handleChange('examesComplementaresDescricao', v)}
                />
                <ConditionalTextarea
                    checkboxId="usaMeds"
                    checkboxLabel="3.3 Usa Medicamentos"
                    textareaId="usaMedsDesc"
                    textareaPlaceholder="Se sim, quais?"
                    isChecked={!!formData.usaMedicamentos}
                    textValue={formData.medicamentosDescricao || ''}
                    onCheckedChange={c => handleChange('usaMedicamentos', c)}
                    onTextChange={v => handleChange('medicamentosDescricao', v)}
                />
                 <ConditionalTextarea
                    checkboxId="realizouCirurgia"
                    checkboxLabel="3.4 Realizou Cirurgia"
                    textareaId="realizouCirurgiaDesc"
                    textareaPlaceholder="Se sim, quais?"
                    isChecked={!!formData.realizouCirurgia}
                    textValue={formData.cirurgiasDescricao || ''}
                    onCheckedChange={c => handleChange('realizouCirurgia', c)}
                    onTextChange={v => handleChange('cirurgiasDescricao', v)}
                />
                 <div className="space-y-2">
                    <h4 className="font-semibold">3.5 Inspeção/Palpação</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                        <CheckboxWithLabel id="inspecaoNormal" label="Normal" checked={!!formData.inspecaoNormal} onCheckedChange={c => handleChange('inspecaoNormal', c)} />
                        <CheckboxWithLabel id="inspecaoEdema" label="Edema" checked={!!formData.inspecaoEdema} onCheckedChange={c => handleChange('inspecaoEdema', c)} />
                        <CheckboxWithLabel id="inspecaoCicatrizacaoIncompleta" label="Cicatrização Incompleta" checked={!!formData.inspecaoCicatrizacaoIncompleta} onCheckedChange={c => handleChange('inspecaoCicatrizacaoIncompleta', c)} />
                        <CheckboxWithLabel id="inspecaoEritemas" label="Eritemas" checked={!!formData.inspecaoEritemas} onCheckedChange={c => handleChange('inspecaoEritemas', c)} />
                        <CheckboxWithLabel id="inspecaoOutros" label="Outros" checked={!!formData.inspecaoOutros} onCheckedChange={c => handleChange('inspecaoOutros', c)} />
                    </div>
                     {formData.inspecaoOutros && <Textarea placeholder="Descreva outras observações da inspeção..." value={formData.inspecaoOutrosDescricao || ''} onChange={e => handleChange('inspecaoOutrosDescricao', e.target.value)} />}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semiologia">3.6 Semiologia</Label>
                    <Textarea id="semiologia" value={formData.semiologia || ''} onChange={e => handleChange('semiologia', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="testesEspecificos">3.7 Testes Específicos</Label>
                    <Textarea id="testesEspecificos" value={formData.testesEspecificos || ''} onChange={e => handleChange('testesEspecificos', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="avaliacaoDor">3.8 Avaliação da Dor (EVA 0-10)</Label>
                    <Input id="avaliacaoDor" type="number" min="0" max="10" value={formData.avaliacaoDor || 0} onChange={e => handleChange('avaliacaoDor', parseInt(e.target.value))} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>4.0 PLANO TERAPÊUTICO</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="objetivosTratamento">4.1 Objetivos de Tratamento</Label>
                    <Textarea id="objetivosTratamento" value={formData.objetivosTratamento || ''} onChange={e => handleChange('objetivosTratamento', e.target.value)} rows={4} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="recursosTerapeuticos">4.2 Recursos Terapêuticos</Label>
                    <Textarea id="recursosTerapeuticos" value={formData.recursosTerapeuticos || ''} onChange={e => handleChange('recursosTerapeuticos', e.target.value)} rows={4} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="planoTratamento">4.3 Plano de Tratamento</Label>
                    <Textarea id="planoTratamento" value={formData.planoTratamento || ''} onChange={e => handleChange('planoTratamento', e.target.value)} rows={4} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="evolucao">4.4 Evolução</Label>
                    <Textarea id="evolucao" value={formData.evolucao || ''} onChange={e => handleChange('evolucao', e.target.value)} rows={4} />
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
