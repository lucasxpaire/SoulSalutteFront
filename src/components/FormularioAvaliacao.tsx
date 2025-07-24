import { useState, useEffect, type ChangeEvent } from 'react';
import type { Avaliacao } from '../types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, Checkbox, FormControlLabel, Slider, Divider } from '@mui/material';

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  aoSalvar: (avaliacao: Omit<Avaliacao, 'id' | 'cliente'>) => void;
  avaliacaoInicial?: Avaliacao | null;
}

const getHojeFormatado = () => {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 16);
};

const estadoInicial: Omit<Avaliacao, 'id' | 'cliente'> = {
  dataAvaliacao: getHojeFormatado(),
  diagnosticoClinico: '', diagnosticoFisioterapeutico: '', historiaClinica: '',
  queixaPrincipal: '', habitosVida: '', hma: '', hmp: '', antecedentesPessoais: '',
  antecedentesFamiliares: '', tratamentosRealizados: '', deambulando: false,
  deambulandoComApoio: false, cadeiraDeRodas: false, internado: false, orientado: false,
  temExamesComplementares: false, examesComplementaresDescricao: '', usaMedicamentos: false,
  medicamentosDescricao: '', realizouCirurgia: false, cirurgiasDescricao: '',
  inspecaoNormal: false, inspecaoEdema: false, inspecaoCicatrizacaoIncompleta: false,
  inspecaoEritemas: false, inspecaoOutros: false, inspecaoOutrosDescricao: '',
  semiologia: '', testesEspecificos: '', avaliacaoDor: 0, objetivosTratamento: '',
  recursosTerapeuticos: '', planoTratamento: '', evolucao: '',
};

function FormularioAvaliacao({ aberto, aoFechar, aoSalvar, avaliacaoInicial }: Props) {
  const [formState, setFormState] = useState(estadoInicial);

  useEffect(() => {
    if (avaliacaoInicial) {
      setFormState({
        ...estadoInicial,
        ...avaliacaoInicial,
        dataAvaliacao: avaliacaoInicial.dataAvaliacao.slice(0, 16),
      });
    } else {
      setFormState(estadoInicial);
    }
  }, [avaliacaoInicial, aberto]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setFormState(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setFormState(prevState => ({ ...prevState, avaliacaoDor: newValue as number }));
  };
  
  const handleSalvarClick = () => {
    const dadosParaSalvar = {
      ...formState,
      dataAvaliacao: `${formState.dataAvaliacao}:00`
    };
    aoSalvar(dadosParaSalvar);
  };

  const handleFechar = () => {
    setFormState(estadoInicial);
    aoFechar();
  }

  return (
    <Dialog open={aberto} onClose={handleFechar} fullWidth maxWidth="lg">
      <DialogTitle>{avaliacaoInicial ? 'Editar Ficha de Avaliação' : 'Nova Ficha de Avaliação'}</DialogTitle>
      <DialogContent>
        <TextField margin="dense" name="dataAvaliacao" label="Data da Avaliação" type="datetime-local" fullWidth variant="outlined" value={formState.dataAvaliacao} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
        
        <Divider sx={{ my: 2 }}><Typography variant="h6">Diagnósticos</Typography></Divider>
        <TextField margin="dense" name="diagnosticoClinico" label="Diagnóstico Clínico" fullWidth variant="outlined" value={formState.diagnosticoClinico} onChange={handleInputChange} />
        <TextField margin="dense" name="diagnosticoFisioterapeutico" label="Diagnóstico Fisioterapêutico" fullWidth multiline rows={3} variant="outlined" value={formState.diagnosticoFisioterapeutico} onChange={handleInputChange} />

        <Divider sx={{ my: 2 }}><Typography variant="h6">Avaliação</Typography></Divider>
        <TextField margin="dense" name="historiaClinica" label="História Clínica" fullWidth multiline rows={3} variant="outlined" value={formState.historiaClinica} onChange={handleInputChange} />
        <TextField margin="dense" name="queixaPrincipal" label="Queixa Principal" fullWidth multiline rows={2} variant="outlined" value={formState.queixaPrincipal} onChange={handleInputChange} />
        <TextField margin="dense" name="habitosVida" label="Hábitos de Vida" fullWidth multiline rows={2} variant="outlined" value={formState.habitosVida} onChange={handleInputChange} />
        <TextField margin="dense" name="hma" label="HMA" fullWidth multiline rows={2} variant="outlined" value={formState.hma} onChange={handleInputChange} />
        <TextField margin="dense" name="hmp" label="HMP" fullWidth multiline rows={2} variant="outlined" value={formState.hmp} onChange={handleInputChange} />
        <TextField margin="dense" name="antecedentesPessoais" label="Antecedentes Pessoais" fullWidth multiline rows={2} variant="outlined" value={formState.antecedentesPessoais} onChange={handleInputChange} />
        <TextField margin="dense" name="antecedentesFamiliares" label="Antecedentes Familiares" fullWidth multiline rows={2} variant="outlined" value={formState.antecedentesFamiliares} onChange={handleInputChange} />
        <TextField margin="dense" name="tratamentosRealizados" label="Tratamentos Realizados" fullWidth multiline rows={2} variant="outlined" value={formState.tratamentosRealizados} onChange={handleInputChange} />

        <Divider sx={{ my: 2 }}><Typography variant="h6">Exame Clínico/Físico</Typography></Divider>
        <Box>
          <Typography variant="subtitle1">Apresentação do Paciente:</Typography>
          <FormControlLabel control={<Checkbox checked={formState.deambulando} onChange={handleInputChange} name="deambulando" />} label="Deambulando" />
          <FormControlLabel control={<Checkbox checked={formState.deambulandoComApoio} onChange={handleInputChange} name="deambulandoComApoio" />} label="Com Apoio/Auxílio" />
          <FormControlLabel control={<Checkbox checked={formState.cadeiraDeRodas} onChange={handleInputChange} name="cadeiraDeRodas" />} label="Cadeira de Rodas" />
          <FormControlLabel control={<Checkbox checked={formState.internado} onChange={handleInputChange} name="internado" />} label="Internado" />
          <FormControlLabel control={<Checkbox checked={formState.orientado} onChange={handleInputChange} name="orientado" />} label="Orientado" />
        </Box>

        <Box sx={{ mt: 2 }}><FormControlLabel control={<Checkbox checked={formState.temExamesComplementares} onChange={handleInputChange} name="temExamesComplementares" />} label="Possui Exames Complementares?" />
          {formState.temExamesComplementares && <TextField margin="dense" name="examesComplementaresDescricao" label="Se sim, quais?" fullWidth variant="outlined" value={formState.examesComplementaresDescricao} onChange={handleInputChange} />}
        </Box>

        <Box sx={{ mt: 2 }}><FormControlLabel control={<Checkbox checked={formState.usaMedicamentos} onChange={handleInputChange} name="usaMedicamentos" />} label="Usa Medicamentos?" />
          {formState.usaMedicamentos && <TextField margin="dense" name="medicamentosDescricao" label="Se sim, quais?" fullWidth variant="outlined" value={formState.medicamentosDescricao} onChange={handleInputChange} />}
        </Box>

        <Box sx={{ mt: 2 }}><FormControlLabel control={<Checkbox checked={formState.realizouCirurgia} onChange={handleInputChange} name="realizouCirurgia" />} label="Realizou Cirurgia?" />
          {formState.realizouCirurgia && <TextField margin="dense" name="cirurgiasDescricao" label="Se sim, quais?" fullWidth variant="outlined" value={formState.cirurgiasDescricao} onChange={handleInputChange} />}
        </Box>
        
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Inspeção/Palpação</Typography>
            <FormControlLabel control={<Checkbox checked={formState.inspecaoNormal} onChange={handleInputChange} name="inspecaoNormal" />} label="Normal" />
            <FormControlLabel control={<Checkbox checked={formState.inspecaoEdema} onChange={handleInputChange} name="inspecaoEdema" />} label="Edema" />
            <FormControlLabel control={<Checkbox checked={formState.inspecaoCicatrizacaoIncompleta} onChange={handleInputChange} name="inspecaoCicatrizacaoIncompleta" />} label="Cicatrização Incompleta" />
            <FormControlLabel control={<Checkbox checked={formState.inspecaoEritemas} onChange={handleInputChange} name="inspecaoEritemas" />} label="Eritemas" />
            <FormControlLabel control={<Checkbox checked={formState.inspecaoOutros} onChange={handleInputChange} name="inspecaoOutros" />} label="Outros" />
            {formState.inspecaoOutros && <TextField margin="dense" name="inspecaoOutrosDescricao" label="Descreva outros" fullWidth variant="outlined" value={formState.inspecaoOutrosDescricao} onChange={handleInputChange} />}
        </Box>

        <TextField sx={{mt: 2}} name="semiologia" label="Semiologia" fullWidth multiline rows={3} variant="outlined" value={formState.semiologia} onChange={handleInputChange} />
        <TextField margin="dense" name="testesEspecificos" label="Testes Específicos" fullWidth multiline rows={3} variant="outlined" value={formState.testesEspecificos} onChange={handleInputChange} />

        <Box sx={{ mt: 2, px: 1 }}>
          <Typography variant="subtitle1" gutterBottom>Avaliação da Intensidade da Dor (EVA)</Typography>
          <Slider value={formState.avaliacaoDor} onChange={handleSliderChange} aria-labelledby="input-slider" valueLabelDisplay="auto" step={1} marks min={0} max={10} />
        </Box>

        <Divider sx={{ my: 2 }}><Typography variant="h6">Plano Terapêutico</Typography></Divider>
        <TextField margin="dense" name="objetivosTratamento" label="Objetivos do Tratamento" fullWidth multiline rows={3} variant="outlined" value={formState.objetivosTratamento} onChange={handleInputChange} />
        <TextField margin="dense" name="recursosTerapeuticos" label="Recursos Terapêuticos" fullWidth multiline rows={3} variant="outlined" value={formState.recursosTerapeuticos} onChange={handleInputChange} />
        <TextField margin="dense" name="planoTratamento" label="Plano de Tratamento" fullWidth multiline rows={3} variant="outlined" value={formState.planoTratamento} onChange={handleInputChange} />
        <TextField margin="dense" name="evolucao" label="Evolução" fullWidth multiline rows={4} variant="outlined" value={formState.evolucao} onChange={handleInputChange} />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleFechar}>Cancelar</Button>
        <Button onClick={handleSalvarClick}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormularioAvaliacao;