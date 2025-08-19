import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AvaliacaoFisioterapeutica, Evolucao } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { adicionarEvolucao } from '@/services/api';

interface AvaliacaoDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  avaliacao: AvaliacaoFisioterapeutica | null;
  onUpdate: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm font-semibold text-muted-foreground">{label}</p>
    <p className="text-base text-foreground whitespace-pre-wrap">{value || 'Não informado'}</p>
  </div>
);

const CheckboxDetail: React.FC<{ label: string; checked: boolean; }> = ({ label, checked }) => (
    <div className="flex items-center gap-2 text-sm">
        {checked ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
        <span>{label}</span>
    </div>
);


const AvaliacaoDetalhesModal: React.FC<AvaliacaoDetalhesModalProps> = ({ isOpen, onClose, avaliacao: initialAvaliacao, onUpdate }) => {
  const [avaliacao, setAvaliacao] = useState<AvaliacaoFisioterapeutica | null>(initialAvaliacao);
  const [novaEvolucao, setNovaEvolucao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setAvaliacao(initialAvaliacao);
    setNovaEvolucao(''); // Limpa o campo ao abrir/trocar de avaliação
  }, [initialAvaliacao, isOpen]);

  const handleAdicionarEvolucao = async () => {
    if (!avaliacao || !novaEvolucao.trim()) {
      toast.warning("O campo de evolução não pode estar vazio.");
      return;
    }
    setIsSubmitting(true);
    try {
      // A API retorna a avaliação completa e atualizada
      const avaliacaoAtualizada = await adicionarEvolucao(avaliacao.id, novaEvolucao);
      setAvaliacao(avaliacaoAtualizada); // Atualiza o estado local para refletir a nova evolução imediatamente
      setNovaEvolucao('');
      toast.success("Evolução adicionada com sucesso!");
      onUpdate(); // Chama a função para atualizar a lista na página de detalhes do cliente
    } catch (error) {
      toast.error("Falha ao adicionar evolução.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!avaliacao) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes da Avaliação</DialogTitle>
          <DialogDescription>
            Realizada em {format(new Date(avaliacao.dataAvaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 pl-1 space-y-6">
          
          {/* AVALIAÇÃO */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary border-b pb-1">2.0 AVALIAÇÃO</h3>
            <div className="p-4">
              <DetailItem label="2.1 História Clínica" value={avaliacao.historiaClinica} />
              <DetailItem label="2.2 Queixa Principal do Paciente" value={avaliacao.queixaPrincipal} />
              <DetailItem label="2.3 Hábitos de Vida" value={avaliacao.habitosVida} />
              <DetailItem label="2.4 HMA (História da Moléstia Atual)" value={avaliacao.hma} />
              <DetailItem label="2.5 HMP (História da Moléstia Pregressa)" value={avaliacao.hmp} />
              <DetailItem label="2.6 Antecedentes Pessoais" value={avaliacao.antecedentesPessoais} />
              <DetailItem label="2.7 Antecedentes Familiares" value={avaliacao.antecedentesFamiliares} />
              <DetailItem label="2.8 Tratamentos Realizados" value={avaliacao.tratamentosRealizados} />
            </div>
          </div>

          {/* EXAME CLÍNICO/FÍSICO */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary border-b pb-1">3.0 EXAME CLÍNICO/FÍSICO</h3>
            <div className="p-4 space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">3.1 Apresentação do Paciente</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <CheckboxDetail label="Deambulando" checked={!!avaliacao.deambulando} />
                        <CheckboxDetail label="Com Apoio" checked={!!avaliacao.deambulandoComApoio} />
                        <CheckboxDetail label="Cadeira de Rodas" checked={!!avaliacao.cadeiraDeRodas} />
                        <CheckboxDetail label="Internado" checked={!!avaliacao.internado} />
                        <CheckboxDetail label="Orientado" checked={!!avaliacao.orientado} />
                    </div>
                </div>
                <DetailItem label="3.2 Exames Complementares" value={avaliacao.temExamesComplementares ? avaliacao.examesComplementaresDescricao : 'Não'} />
                <DetailItem label="3.3 Usa Medicamentos" value={avaliacao.usaMedicamentos ? avaliacao.medicamentosDescricao : 'Não'} />
                <DetailItem label="3.4 Realizou Cirurgia" value={avaliacao.realizouCirurgia ? avaliacao.cirurgiasDescricao : 'Não'} />
                 <div>
                    <h4 className="font-semibold mb-2">3.5 Inspeção/Palpação</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <CheckboxDetail label="Normal" checked={!!avaliacao.inspecaoNormal} />
                        <CheckboxDetail label="Edema" checked={!!avaliacao.inspecaoEdema} />
                        <CheckboxDetail label="Cicatrização Incompleta" checked={!!avaliacao.inspecaoCicatrizacaoIncompleta} />
                        <CheckboxDetail label="Eritemas" checked={!!avaliacao.inspecaoEritemas} />
                        <CheckboxDetail label="Outros" checked={!!avaliacao.inspecaoOutros} />
                    </div>
                     {avaliacao.inspecaoOutros && <DetailItem label="Descrição (Outros)" value={avaliacao.inspecaoOutrosDescricao} />}
                </div>
                <DetailItem label="3.6 Semiologia" value={avaliacao.semiologia} />
                <DetailItem label="3.7 Testes Específicos" value={avaliacao.testesEspecificos} />
                 <div className='flex items-center gap-2'>
                    <p className="text-sm font-semibold text-muted-foreground">3.8 Avaliação da Dor (EVA):</p>
                    <Badge variant="destructive">{avaliacao.avaliacaoDor} / 10</Badge>
                </div>
            </div>
          </div>

          {/* PLANO TERAPÊUTICO */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary border-b pb-1">4.0 PLANO TERAPÊUTICO</h3>
            <div className="p-4">
              <DetailItem label="4.1 Objetivos de Tratamento" value={avaliacao.objetivosTratamento} />
              <DetailItem label="4.2 Recursos Terapêuticos" value={avaliacao.recursosTerapeuticos} />
              <DetailItem label="4.3 Plano de Tratamento" value={avaliacao.planoTratamento} />
            </div>
          </div>

{/* Seção de Evolução - MODIFICADA */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary border-b pb-1">4.4 Evolução</h3>
            <div className="p-4 space-y-4">
              {/* Formulário para adicionar nova evolução */}
              <div className="space-y-2">
                <Textarea 
                  placeholder="Adicionar nova evolução..."
                  value={novaEvolucao}
                  onChange={(e) => setNovaEvolucao(e.target.value)}
                />
                <Button onClick={handleAdicionarEvolucao} disabled={isSubmitting} size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'A Adicionar...' : 'Adicionar Evolução'}
                </Button>
              </div>
              {/* Lista de evoluções existentes */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {avaliacao.evolucoes && avaliacao.evolucoes.length > 0 ? (
                  avaliacao.evolucoes.map((evo: Evolucao) => (
                    <div key={evo.id} className="p-3 border rounded-md bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {format(new Date(evo.dataEvolucao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{evo.evolucao}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-4">Nenhuma evolução registrada.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvaliacaoDetalhesModal;
