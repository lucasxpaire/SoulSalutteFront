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

export interface AvaliacaoFisioterapeutica {
  id: number;
  clienteId: number;
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
  avaliacaoDor: number; // 0-10
  objetivosTratamento: string;
  recursosTerapeuticos: string;
  planoTratamento: string;
  evolucao: string;
}

export interface Sessao {
  id: number;
  nome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  notasSessao: string;
  clienteId: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

// Tipos adicionais para melhor organização
export interface EstadisticasDashboard {
  clientesAtivos: number;
  sessoesDia: number;
  avaliacoesRealizadas: number;
  proximasSessoes: number;
}

export interface FiltroAvaliacoes {
  clienteId: string;
  dataInicio: string;
  dataFim: string;
  status: 'all' | 'recente' | 'antigo';
}

export interface EventoCalendario {
  id: string;
  titulo: string;
  inicio: Date;
  fim: Date;
  clienteId: string;
  clienteNome: string;
  tipo: 'sessao' | 'avaliacao';
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
}

export interface ConfiguracaoSistema {
  nomeClinica: string;
  endereco: string;
  telefone: string;
  email: string;
  logo?: string;
  horarioFuncionamento: {
    segundaASexta: {
      inicio: string;
      fim: string;
    };
    sabado: {
      inicio: string;
      fim: string;
    };
    domingo: {
      fechado: boolean;
    };
  };
}