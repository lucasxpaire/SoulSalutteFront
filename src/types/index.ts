export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  dataCadastro: string;
  sexo?: string;
  cidade?: string;
  bairro?: string;
  profissao?: string;
  enderecoResidencial?: string;
  enderecoComercial?: string;
  naturalidade?: string;
  estadoCivil?: string;
}

export interface Avaliacao {
  id: number;
  cliente?: Cliente;
  dataAvaliacao: string;

  diagnosticoClinico: string;
  diagnosticoFisioterapeutico: string;

  historiaClinica: string;
  queixaPrincipal: string;
  habitosVida: string;
  hma: string;
  hmp: string;
  antecedentesPessoais: string;
  antecedentesFamiliares: string;
  tratamentosRealizados: string;

  deambulando: boolean;
  deambulandoComApoio: boolean;
  cadeiraDeRodas: boolean;
  internado: boolean;
  orientado: boolean;
  temExamesComplementares: boolean;
  examesComplementaresDescricao: string;
  usaMedicamentos: boolean;
  medicamentosDescricao: string;
  realizouCirurgia: boolean;
  cirurgiasDescricao: string;
  inspecaoNormal: boolean;
  inspecaoEdema: boolean;
  inspecaoCicatrizacaoIncompleta: boolean;
  inspecaoEritemas: boolean;
  inspecaoOutros: boolean;
  inspecaoOutrosDescricao: string;
  semiologia: string;
  testesEspecificos: string;
  avaliacaoDor: number;

  objetivosTratamento: string;
  recursosTerapeuticos: string;
  planoTratamento: string;
  evolucao: string;
}

export interface Sessao {
  id: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA'; 
  notasSessao?: string; 
  cliente?: Cliente;
}