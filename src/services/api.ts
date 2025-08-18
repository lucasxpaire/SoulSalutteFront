import axios from 'axios';
import { Cliente, Sessao, AvaliacaoFisioterapeutica } from '@/types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções para Clientes
export const getClientes = (nome?: string): Promise<Cliente[]> => {
  return apiClient.get('/clientes', { params: { nome } }).then(res => res.data);
};

export const getClienteById = (id: number): Promise<Cliente> => {
  return apiClient.get(`/clientes/${id}`).then(res => res.data);
};

export const createCliente = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Promise<Cliente> => {
  return apiClient.post('/clientes', cliente).then(res => res.data);
};

export const updateCliente = (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
  return apiClient.put(`/clientes/${id}`, cliente).then(res => res.data);
};

export const deleteCliente = (id: number): Promise<void> => {
  return apiClient.delete(`/clientes/${id}`);
};

// Funções para Sessões
export const getSessoes = (): Promise<Sessao[]> => {
  return apiClient.get('/sessoes').then(res => res.data);
};

export const getSessoesByClienteId = (clienteId: number): Promise<Sessao[]> => {
    return apiClient.get(`/sessoes/cliente/${clienteId}`).then(res => res.data);
};

export const createSessao = (sessao: Omit<Sessao, 'id'>): Promise<Sessao> => {
    return apiClient.post(`/sessoes/cliente/${sessao.clienteId}`, sessao).then(res => res.data);
};

export const updateSessao = (id: number, sessao: Partial<Sessao>): Promise<Sessao> => {
    return apiClient.put(`/sessoes/${id}`, sessao).then(res => res.data);
};

export const deleteSessao = (id: number): Promise<void> => {
    return apiClient.delete(`/sessoes/${id}`);
};

// Funções para Avaliações
export const getAvaliacoesByCliente = (clienteId: number): Promise<AvaliacaoFisioterapeutica[]> => {
  return apiClient.get(`/avaliacoes/cliente/${clienteId}`).then(res => res.data);
};

export const createAvaliacao = (avaliacao: Omit<AvaliacaoFisioterapeutica, 'id'>): Promise<AvaliacaoFisioterapeutica> => {
    return apiClient.post(`/avaliacoes/cliente/${avaliacao.clienteId}`, avaliacao).then(res => res.data);
};

export const updateAvaliacao = (id: number, avaliacao: Partial<AvaliacaoFisioterapeutica>): Promise<AvaliacaoFisioterapeutica> => {
    return apiClient.put(`/avaliacoes/${id}`, avaliacao).then(res => res.data);
};

export default apiClient;