import { useState, useEffect, useCallback } from "react";
import type { Cliente } from '../types'; 
import api from '../services/api'  
import FormularioCliente from "../components/FormularioCliente";
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

import { 
    Container, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button,
    Box,
    IconButton,
    TextField 
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function PaginaClientes() {
    // const [estado, atualizador] = useState(valorInicial);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);
    const [termoBusca, setTermoBusca] = useState(''); // Estado para o campo de busca

    const buscarClientes = useCallback(async () => {
        try {
            const response = await api.get('/clientes', {
                params: { nome: termoBusca }
            });
            setClientes(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    }, [termoBusca]); // A função agora depende de 'termoBusca'


    // efeito para buscar os dados da API quando o componente carregar
    useEffect(() => {
        buscarClientes();
    }, [buscarClientes]);

    const handleAbrirModalCriacao = () => {
        setClienteParaEditar(null); // Garante que não há cliente selecionado para edição
        setModalAberto(true);
    };

    const handleAbrirModalEdicao = (cliente: Cliente) => {
        setClienteParaEditar(cliente); // Define o cliente que será editado
        setModalAberto(true);
    };

    const handleFecharModal = () => {
        setClienteParaEditar(null);
        setModalAberto(false);
    };

    const handleSalvarCliente = async (clienteDados: Omit<Cliente, 'id' | 'dataCadastro'>) => {
        try {
            if (clienteParaEditar) {
                await api.put(`/clientes/${clienteParaEditar.id}`, clienteDados)
            } else {
                await api.post('/clientes', clienteDados);
            }
            handleFecharModal();
            buscarClientes();
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        }
    };

    const handleDeletarCliente = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
            await api.delete(`/clientes/${id}`);
            buscarClientes();
            } catch (error) { // Remova o ': any' daqui
            console.error("Erro ao deletar cliente:", error);
            
            // Verificamos se o erro é um erro do axios
            if (error instanceof AxiosError && error.response) {
                // Agora o TypeScript sabe que error.response existe e tem a propriedade 'data'
                alert(error.response.data.message || 'Erro ao excluir cliente.');
            } else {
                // Erro genérico
                alert('Ocorreu um erro desconhecido.');
            }
        }
    }
    };

    return (
        // Container: centraliza e define uma largura máxima para o conteúdo
        <Container maxWidth="lg"> 
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                {/* Typography: Para textos, com estilos pré-definidos. h4 é um título */}
                <Typography variant="h4" component="h1">Lista de Clientes</Typography>
                <Button variant="contained" onClick={handleAbrirModalCriacao}>Adicionar Cliente</Button>
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                fullWidth
                label="Buscar por nome"
                variant="outlined"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                />
            </Box>

            {/* TableContainer com Paper: Cria uma caixa com sombra para a nossa tabela */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell>
                                    <Link to={`/clientes/${cliente.id}`}>{cliente.nome}</Link>
                                </TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.telefone}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleAbrirModalEdicao(cliente)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeletarCliente(cliente.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <FormularioCliente
                aberto={modalAberto}
                aoFechar={handleFecharModal}
                aoSalvar={handleSalvarCliente}
                clienteInicial={clienteParaEditar}
            />
        </Container>
    );
}

export default PaginaClientes;