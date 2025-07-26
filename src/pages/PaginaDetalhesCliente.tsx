import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Cliente, Avaliacao } from '../types';
import api from '../services/api';
import FormularioAvaliacao from '../components/FormularioAvaliacao';
import { AxiosError } from 'axios'; // 1. IMPORTAR

import { Container, Typography, Card, CardContent, CircularProgress, Button, Accordion, AccordionSummary, AccordionDetails, Box, IconButton, Grid, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

import { gerarPDFAvaliacao } from '../services/pdfGenerator';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


const CampoDetalhe = ({ label, value }: { label: string; value?: string | number | boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
    return (
        <Typography variant="body2" sx={{mb: 1}}>
            <strong>{label}:</strong> {String(displayValue)}
        </Typography>
    );
};

function PaginaDetalhesCliente() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [avaliacaoParaEditar, setAvaliacaoParaEditar] = useState<Avaliacao | null>(null);

  const buscarDados = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [respCliente, respAvaliacoes] = await Promise.all([
        api.get(`/clientes/${id}`),
        api.get(`/avaliacoes/cliente/${id}`)
      ]);
      setCliente(respCliente.data);
      setAvaliacoes(respAvaliacoes.data.sort((a: Avaliacao, b: Avaliacao) => new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  const handleAbrirModalCriacao = () => {
    setAvaliacaoParaEditar(null);
    setModalAvaliacaoAberto(true);
  };
  
  const handleAbrirModalEdicao = (avaliacao: Avaliacao) => {
    setAvaliacaoParaEditar(avaliacao);
    setModalAvaliacaoAberto(true);
  };

  const handleFecharModal = () => {
    setAvaliacaoParaEditar(null);
    setModalAvaliacaoAberto(false);
  };

  const handleSalvarAvaliacao = async (dados: Omit<Avaliacao, 'id' | 'cliente'>) => {
    try {
      if (avaliacaoParaEditar) {
        await api.put(`/avaliacoes/${avaliacaoParaEditar.id}`, dados);
      } else {
        await api.post(`/avaliacoes/cliente/${id}`, dados);
      }
      handleFecharModal();
      buscarDados();
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (!cliente) return <Typography>Cliente não encontrado.</Typography>;

  return (
    <Container sx={{ pb: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{cliente.nome}</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6}><CampoDetalhe label="Email" value={cliente.email} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Telefone" value={cliente.telefone} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Data de Nascimento" value={cliente.dataNascimento ? new Date(cliente.dataNascimento).toLocaleDateString() : 'Não informado'} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Sexo" value={cliente.sexo} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Profissão" value={cliente.profissao} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Estado Civil" value={cliente.estadoCivil} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Naturalidade" value={cliente.naturalidade} /></Grid>
            <Grid xs={12} sm={6}><CampoDetalhe label="Cidade" value={cliente.cidade} /></Grid>
            <Grid xs={12}><CampoDetalhe label="Endereço Residencial" value={cliente.enderecoResidencial} /></Grid>
            <Grid xs={12}><CampoDetalhe label="Endereço Comercial" value={cliente.enderecoComercial} /></Grid>
            <Grid xs={12}><CampoDetalhe label="Data de Cadastro" value={cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString() : 'Não informado'} /></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Fichas de Avaliação</Typography>
        <Button variant="contained" onClick={handleAbrirModalCriacao}>Adicionar Avaliação</Button>
      </Box>

      {avaliacoes.length > 0 ? (
        avaliacoes.map((avaliacao) => (
          <Accordion key={avaliacao.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Avaliação de {new Date(avaliacao.dataAvaliacao).toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); if (cliente) gerarPDFAvaliacao(cliente, avaliacao); }}>
                  <PictureAsPdfIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleAbrirModalEdicao(avaliacao); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid xs={12}><Divider><Typography variant="h6">Diagnósticos</Typography></Divider></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Diagnóstico Clínico" value={avaliacao.diagnosticoClinico} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Diagnóstico Fisioterapêutico" value={avaliacao.diagnosticoFisioterapeutico} /></Grid>
                    
                    <Grid xs={12}><Divider sx={{mt:2}}><Typography variant="h6">Avaliação</Typography></Divider></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Queixa Principal" value={avaliacao.queixaPrincipal} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="História Clínica" value={avaliacao.historiaClinica} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Hábitos de Vida" value={avaliacao.habitosVida} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="HMA" value={avaliacao.hma} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="HMP" value={avaliacao.hmp} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Antecedentes Pessoais" value={avaliacao.antecedentesPessoais} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Antecedentes Familiares" value={avaliacao.antecedentesFamiliares} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Tratamentos Realizados" value={avaliacao.tratamentosRealizados} /></Grid>

                    <Grid xs={12}><Divider sx={{mt:2}}><Typography variant="h6">Exame Clínico/Físico</Typography></Divider></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Exames Complementares" value={`${avaliacao.temExamesComplementares ? 'Sim' : 'Não'} - ${avaliacao.examesComplementaresDescricao || ''}`} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Usa Medicamentos" value={`${avaliacao.usaMedicamentos ? 'Sim' : 'Não'} - ${avaliacao.medicamentosDescricao || ''}`} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Realizou Cirurgia" value={`${avaliacao.realizouCirurgia ? 'Sim' : 'Não'} - ${avaliacao.cirurgiasDescricao || ''}`} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Semiologia" value={avaliacao.semiologia} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Testes Específicos" value={avaliacao.testesEspecificos} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Intensidade da Dor (EVA)" value={`${avaliacao.avaliacaoDor} / 10`} /></Grid>
                    
                    <Grid xs={12}><Divider sx={{mt:2}}><Typography variant="h6">Plano Terapêutico</Typography></Divider></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Objetivos" value={avaliacao.objetivosTratamento} /></Grid>
                    <Grid xs={12} md={6}><CampoDetalhe label="Recursos Terapêuticos" value={avaliacao.recursosTerapeuticos} /></Grid>
                    <Grid xs={12}><CampoDetalhe label="Plano de Tratamento" value={avaliacao.planoTratamento} /></Grid>
                    <Grid xs={12}><CampoDetalhe label="Evolução" value={avaliacao.evolucao} /></Grid>
                </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>Nenhuma avaliação encontrada.</Typography>
      )}

      <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>Voltar para a Lista</Button>

      <FormularioAvaliacao
        aberto={modalAvaliacaoAberto}
        aoFechar={handleFecharModal}
        aoSalvar={handleSalvarAvaliacao}
        avaliacaoInicial={avaliacaoParaEditar}
      />
    </Container>
  );
}

export default PaginaDetalhesCliente;