import { useEffect, useState, type ChangeEvent } from "react";
import type { Cliente } from "../types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';

interface Props {
    aberto: boolean;
    aoFechar: () => void;
    aoSalvar: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
    clienteInicial?: Cliente | null;
}

const estadoInicial = {
    nome: '', email: '', telefone: '', dataNascimento: '', sexo: '',
    cidade: '', bairro: '', profissao: '', enderecoResidencial: '',
    enderecoComercial: '', naturalidade: '', estadoCivil: ''
};

function FormularioCliente({ aberto, aoFechar, aoSalvar, clienteInicial }: Props) {
    const [cliente, setCliente] = useState(estadoInicial);

    useEffect(() => {
    if (clienteInicial) {
        setCliente({
            nome: clienteInicial.nome || '',
            email: clienteInicial.email || '',
            telefone: clienteInicial.telefone || '',
            dataNascimento: clienteInicial.dataNascimento || '',
            sexo: clienteInicial.sexo || '',
            cidade: clienteInicial.cidade || '',
            bairro: clienteInicial.bairro || '',
            profissao: clienteInicial.profissao || '',
            enderecoResidencial: clienteInicial.enderecoResidencial || '',
            enderecoComercial: clienteInicial.enderecoComercial || '',
            naturalidade: clienteInicial.naturalidade || '',
            estadoCivil: clienteInicial.estadoCivil || '',
        });
    } else {
        setCliente(estadoInicial);
    }
  }, [clienteInicial, aberto]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCliente(prevState => ({ ...prevState, [name]: value}));
    };

    const handleSalvarClick = () => {
        aoSalvar(cliente);
    };

    const handleFechar = () => {
        setCliente(estadoInicial);
        aoFechar();
    }

    return (
        <Dialog open={aberto} onClose={handleFechar} fullWidth maxWidth="md">
            <DialogTitle>{clienteInicial ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}><TextField name="nome" label="Nome Completo" fullWidth variant="outlined" value={cliente.nome} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="email" label="Email" type="email" fullWidth variant="outlined" value={cliente.email} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="telefone" label="Telefone" fullWidth variant="outlined" value={cliente.telefone} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField name="dataNascimento" label="Data de Nascimento" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={cliente.dataNascimento} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField name="sexo" label="Sexo" fullWidth variant="outlined" value={cliente.sexo} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField name="profissao" label="Profissão" fullWidth variant="outlined" value={cliente.profissao} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="cidade" label="Cidade" fullWidth variant="outlined" value={cliente.cidade} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="bairro" label="Bairro" fullWidth variant="outlined" value={cliente.bairro} onChange={handleInputChange} /></Grid>
                <Grid item xs={12}><TextField name="enderecoResidencial" label="Endereço Residencial" fullWidth variant="outlined" value={cliente.enderecoResidencial} onChange={handleInputChange} /></Grid>
                <Grid item xs={12}><TextField name="enderecoComercial" label="Endereço Comercial" fullWidth variant="outlined" value={cliente.enderecoComercial} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="naturalidade" label="Naturalidade" fullWidth variant="outlined" value={cliente.naturalidade} onChange={handleInputChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField name="estadoCivil" label="Estado Civil" fullWidth variant="outlined" value={cliente.estadoCivil} onChange={handleInputChange} /></Grid>
            </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleFechar}>Cancelar</Button>
                <Button onClick={handleSalvarClick}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormularioCliente;