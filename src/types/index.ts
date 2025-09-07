export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  dataCadastro: string;
  sexo: 'M' | 'F' | 'Outro';
  cidade: string;
  bairro: string;
  profissao: string;
  enderecoResidencial: string;
  enderecoComercial: string;
  naturalidade: string;
  estadoCivil: 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo' | 'União Estável';
}

export interface Evolucao {
  id: number;
  evolucao: string;
  dataEvolucao: string;
}

export interface AvaliacaoFisioterapeutica {
  id: number;
  clienteId: number;
  dataAvaliacao: string;
  
  // 2.0 AVALIAÇÃO
  diagnosticoClinico: string;
  diagnosticoFisioterapeutico: string;
  historiaClinica: string;
  queixaPrincipal: string;
  habitosVida: string;
  hma: string; // História da Moléstia Atual
  hmp: string; // História da Moléstia Pregressa
  antecedentesPessoais: string;
  antecedentesFamiliares: string;
  tratamentosRealizados: string;

  // 3.0 EXAME CLÍNICO/FÍSICO
  // 3.1 Apresentação
  deambulando: boolean;
  deambulandoComApoio: boolean;
  cadeiraDeRodas: boolean;
  internado: boolean;
  orientado: boolean;
  
  // 3.2 Exames
  temExamesComplementares: boolean;
  examesComplementaresDescricao: string;

  // 3.3 Medicamentos
  usaMedicamentos: boolean;
  medicamentosDescricao: string;

  // 3.4 Cirurgias
  realizouCirurgia: boolean;
  cirurgiasDescricao: string;

  // 3.5 Inspeção/Palpação
  inspecaoNormal: boolean;
  inspecaoEdema: boolean;
  inspecaoCicatrizacaoIncompleta: boolean;
  inspecaoEritemas: boolean;
  inspecaoOutros: boolean;
  inspecaoOutrosDescricao: string;

  // 3.6, 3.7, 3.8
  semiologia: string;
  testesEspecificos: string;
  avaliacaoDor: number; // 0-10

  // 4.0 PLANO TERAPÊUTICO
  objetivosTratamento: string;
  recursosTerapeuticos: string;
  planoTratamento: string;

  evolucoes: Evolucao[];
  createdAt: string;
  updatedAt: string;
}

export interface Sessao {
  id: number;
  nome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  notasSessao: string;
  clienteId: number;
  notificacao?: boolean; 
}

export interface User {
  id: string;
  email: string;
  name: string;
}
