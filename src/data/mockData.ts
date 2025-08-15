import { Cliente, AvaliacaoFisioterapeutica, Sessao } from '@/types';

export const mockClientes: Cliente[] = [
  {
    ID_CLIENTE: '1',
    NOME: 'Maria Silva',
    EMAIL: 'maria.silva@email.com',
    TELEFONE: '(11) 99999-9999',
    DATA_NASCIMENTO: '1985-03-15',
    DATA_CADASTRO: '2024-01-10',
    SEXO: 'F',
    CIDADE: 'São Paulo',
    BAIRRO: 'Vila Madalena',
    PROFISSAO: 'Enfermeira',
    ENDERECO_RESIDENCIAL: 'Rua das Flores, 123',
    ENDERECO_COMERCIAL: 'Hospital São Paulo, Av. Principal, 456',
    NATURALIDADE: 'São Paulo',
    ESTADO_CIVIL: 'Casado'
  },
  {
    ID_CLIENTE: '2',
    NOME: 'João Santos',
    EMAIL: 'joao.santos@email.com',
    TELEFONE: '(11) 88888-8888',
    DATA_NASCIMENTO: '1978-07-22',
    DATA_CADASTRO: '2024-01-15',
    SEXO: 'M',
    CIDADE: 'São Paulo',
    BAIRRO: 'Pinheiros',
    PROFISSAO: 'Advogado',
    ENDERECO_RESIDENCIAL: 'Av. Brasil, 789',
    ENDERECO_COMERCIAL: 'Escritório Central, Rua Comercial, 321',
    NATURALIDADE: 'Rio de Janeiro',
    ESTADO_CIVIL: 'Solteiro'
  },
  {
    ID_CLIENTE: '3',
    NOME: 'Ana Costa',
    EMAIL: 'ana.costa@email.com',
    TELEFONE: '(11) 77777-7777',
    DATA_NASCIMENTO: '1992-11-08',
    DATA_CADASTRO: '2024-02-01',
    SEXO: 'F',
    CIDADE: 'São Paulo',
    BAIRRO: 'Itaim Bibi',
    PROFISSAO: 'Professora',
    ENDERECO_RESIDENCIAL: 'Rua Escola, 555',
    ENDERECO_COMERCIAL: 'Colégio Municipal, Rua Educação, 888',
    NATURALIDADE: 'São Paulo',
    ESTADO_CIVIL: 'União Estável'
  }
];

export const mockAvaliacoes: AvaliacaoFisioterapeutica[] = [
  {
    ID_AVALIACAO: '1',
    ID_CLIENTE: '1',
    DATA_AVALIACAO: '2024-01-15',
    DIAGNOSTICO_CLINICO: 'Lombalgia crônica',
    DIAGNOSTICO_FISIOTERAPEUTICO: 'Disfunção lombossacra com limitação funcional',
    HISTORIA_CLINICA: 'Paciente relata dor lombar há 6 meses',
    QUEIXA_PRINCIPAL: 'Dor intensa na região lombar que piora ao final do dia',
    HABITOS_VIDA: 'Trabalha 8h em pé, pratica caminhada 2x na semana',
    HMA: 'Início dos sintomas após trabalho prolongado em pé',
    HMP: 'Sem antecedentes relevantes',
    ANTECEDENTES_PESSOAIS: 'Nega cirurgias prévias',
    ANTECEDENTES_FAMILIARES: 'Mãe com artrose',
    TRATAMENTOS_REALIZADOS: 'Fisioterapia anterior há 2 anos',
    APRESENTACAO_PACIENTE: {
      deambulando: true,
      deambulandoComApoio: false,
      cadeiradeRodas: false,
      internado: false,
      orientado: true
    },
    EXAMES_COMPLEMENTARES: {
      possui: true,
      descricao: 'Raio-X de coluna lombar - protrusão discal L4-L5'
    },
    USO_MEDICAMENTOS: {
      usa: true,
      descricao: 'Ibuprofeno 400mg 2x ao dia'
    },
    CIRURGIAS_REALIZADAS: {
      realizou: false,
      descricao: ''
    },
    INSPECAO_PALPACAO: {
      normal: false,
      edema: false,
      cicatrizacaoIncompleta: false,
      eritemas: false,
      outros: true,
      outrosDescricao: 'Tensão muscular paravertebral'
    },
    SEMIOLOGIA: 'Teste de Lasègue positivo bilateralmente',
    TESTES_ESPECIFICOS: 'Teste de flexão anterior limitado',
    AVALIACAO_DOR_EVA: 7,
    OBJETIVOS_TRATAMENTO: 'Redução da dor, melhora da flexibilidade e fortalecimento muscular',
    RECURSOS_TERAPEUTICOS: 'TENS, ultrassom, exercícios terapêuticos',
    PLANO_TRATAMENTO: 'Sessões 3x na semana por 8 semanas',
    EVOLUCAO: 'Paciente com boa resposta ao tratamento'
  }
];

export const mockSessoes: Sessao[] = [
  // Sessões passadas
  {
    ID_SESSAO: '1',
    NOME: 'Fisioterapia - Maria Silva',
    DATA_HORA_INICIO: '2024-08-05T14:00:00',
    DATA_HORA_FIM: '2024-08-05T15:00:00',
    STATUS: 'CONCLUIDA',
    NOTAS_SESSAO: 'Primeira sessão do tratamento - exercícios de mobilização',
    CLIENTE_ID: '1'
  },
  {
    ID_SESSAO: '2',
    NOME: 'Fisioterapia - Maria Silva',
    DATA_HORA_INICIO: '2024-08-07T14:00:00',
    DATA_HORA_FIM: '2024-08-07T15:00:00',
    STATUS: 'CONCLUIDA',
    NOTAS_SESSAO: 'Evolução positiva, redução da dor',
    CLIENTE_ID: '1'
  },
  {
    ID_SESSAO: '3',
    NOME: 'Fisioterapia - João Santos',
    DATA_HORA_INICIO: '2024-08-06T15:30:00',
    DATA_HORA_FIM: '2024-08-06T16:30:00',
    STATUS: 'CONCLUIDA',
    NOTAS_SESSAO: 'Reavaliação pós-cirúrgica realizada',
    CLIENTE_ID: '2'
  },
  {
    ID_SESSAO: '4',
    NOME: 'Fisioterapia - Ana Costa',
    DATA_HORA_INICIO: '2024-08-08T10:00:00',
    DATA_HORA_FIM: '2024-08-08T11:00:00',
    STATUS: 'CONCLUIDA',
    NOTAS_SESSAO: 'Sessão de fortalecimento muscular realizada com sucesso',
    CLIENTE_ID: '3'
  },
  {
    ID_SESSAO: '5',
    NOME: 'Fisioterapia - Ana Costa',
    DATA_HORA_INICIO: '2024-08-09T10:00:00',
    DATA_HORA_FIM: '2024-08-09T11:00:00',
    STATUS: 'CANCELADA',
    NOTAS_SESSAO: 'Paciente cancelou por motivos pessoais',
    CLIENTE_ID: '3'
  },
  // Sessões de hoje
  {
    ID_SESSAO: '6',
    NOME: 'Fisioterapia - Maria Silva',
    DATA_HORA_INICIO: '2024-08-11T14:00:00',
    DATA_HORA_FIM: '2024-08-11T15:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Continuidade do tratamento - exercícios de fortalecimento',
    CLIENTE_ID: '1'
  },
  {
    ID_SESSAO: '7',
    NOME: 'Fisioterapia - João Santos',
    DATA_HORA_INICIO: '2024-08-11T16:00:00',
    DATA_HORA_FIM: '2024-08-11T17:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Fisioterapia aquática',
    CLIENTE_ID: '2'
  },
  // Sessões futuras
  {
    ID_SESSAO: '8',
    NOME: 'Fisioterapia - Maria Silva',
    DATA_HORA_INICIO: '2024-08-12T14:00:00',
    DATA_HORA_FIM: '2024-08-12T15:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Avaliação de progresso',
    CLIENTE_ID: '1'
  },
  {
    ID_SESSAO: '9',
    NOME: 'Fisioterapia - Ana Costa',
    DATA_HORA_INICIO: '2024-08-12T10:00:00',
    DATA_HORA_FIM: '2024-08-12T11:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Retorno após pausa no tratamento',
    CLIENTE_ID: '3'
  },
  {
    ID_SESSAO: '10',
    NOME: 'Fisioterapia - João Santos',
    DATA_HORA_INICIO: '2024-08-13T15:30:00',
    DATA_HORA_FIM: '2024-08-13T16:30:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Sessão de alongamento e relaxamento',
    CLIENTE_ID: '2'
  },
  {
    ID_SESSAO: '11',
    NOME: 'Fisioterapia - Maria Silva',
    DATA_HORA_INICIO: '2024-08-14T14:00:00',
    DATA_HORA_FIM: '2024-08-14T15:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Exercícios funcionais',
    CLIENTE_ID: '1'
  },
  {
    ID_SESSAO: '12',
    NOME: 'Fisioterapia - Ana Costa',
    DATA_HORA_INICIO: '2024-08-15T09:00:00',
    DATA_HORA_FIM: '2024-08-15T10:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Pilates terapêutico',
    CLIENTE_ID: '3'
  },
  {
    ID_SESSAO: '13',
    NOME: 'Fisioterapia - João Santos',
    DATA_HORA_INICIO: '2024-08-16T14:00:00',
    DATA_HORA_FIM: '2024-08-16T15:00:00',
    STATUS: 'AGENDADA',
    NOTAS_SESSAO: 'Reavaliação mensal',
    CLIENTE_ID: '2'
  }
];

export const getClienteById = (id: string): Cliente | undefined => {
  return mockClientes.find(cliente => cliente.ID_CLIENTE === id);
};

export const getAvaliacoesByClienteId = (clienteId: string): AvaliacaoFisioterapeutica[] => {
  return mockAvaliacoes.filter(avaliacao => avaliacao.ID_CLIENTE === clienteId);
};

export const getSessoesByClienteId = (clienteId: string): Sessao[] => {
  return mockSessoes.filter(sessao => sessao.CLIENTE_ID === clienteId);
};