export interface Cliente {
  ID_CLIENTE: string;
  NOME: string;
  EMAIL: string;
  TELEFONE: string;
  DATA_NASCIMENTO: string;
  DATA_CADASTRO: string | undefined;
  SEXO: 'M' | 'F' | 'Outro';
  CIDADE: string;
  BAIRRO: string;
  PROFISSAO: string;
  ENDERECO_RESIDENCIAL: string;
  ENDERECO_COMERCIAL: string;
  NATURALIDADE: string;
  ESTADO_CIVIL: 'Solteiro' | 'Casado' | 'Divorciado' | 'Viúvo' | 'União Estável';
}

export interface AvaliacaoFisioterapeutica {
  ID_AVALIACAO: string;
  ID_CLIENTE: string;
  DATA_AVALIACAO: string;
  DIAGNOSTICO_CLINICO: string;
  DIAGNOSTICO_FISIOTERAPEUTICO: string;
  HISTORIA_CLINICA: string;
  QUEIXA_PRINCIPAL: string;
  HABITOS_VIDA: string;
  HMA: string;
  HMP: string;
  ANTECEDENTES_PESSOAIS: string;
  ANTECEDENTES_FAMILIARES: string;
  TRATAMENTOS_REALIZADOS: string;
  APRESENTACAO_PACIENTE: {
    deambulando: boolean;
    deambulandoComApoio: boolean;
    cadeiradeRodas: boolean;
    internado: boolean;
    orientado: boolean;
  };
  EXAMES_COMPLEMENTARES: {
    possui: boolean;
    descricao: string;
  };
  USO_MEDICAMENTOS: {
    usa: boolean;
    descricao: string;
  };
  CIRURGIAS_REALIZADAS: {
    realizou: boolean;
    descricao: string;
  };
  INSPECAO_PALPACAO: {
    normal: boolean;
    edema: boolean;
    cicatrizacaoIncompleta: boolean;
    eritemas: boolean;
    outros: boolean;
    outrosDescricao: string;
  };
  SEMIOLOGIA: string;
  TESTES_ESPECIFICOS: string;
  AVALIACAO_DOR_EVA: number; // 0-10
  OBJETIVOS_TRATAMENTO: string;
  RECURSOS_TERAPEUTICOS: string;
  PLANO_TRATAMENTO: string;
  EVOLUCAO: string;
}

export interface Sessao {
  ID_SESSAO: string;
  NOME: string;
  DATA_HORA_INICIO: string;
  DATA_HORA_FIM: string;
  STATUS: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  NOTAS_SESSAO: string;
  CLIENTE_ID: string;
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