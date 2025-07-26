import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Cliente, Avaliacao } from '../types';

// Funções auxiliares para formatar os dados de forma limpa
const formatBool = (value: boolean) => value ? 'Sim' : 'Não';
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString() : 'Não informado';
const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString();
const checkValue = (value?: string | number | null) => value || 'Não informado';

export const gerarPDFAvaliacao = (cliente: Cliente, avaliacao: Avaliacao) => {
  // Cria um elemento HTML temporário e invisível que servirá de "molde" para o PDF
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px'; // Posiciona fora da tela
  container.style.width = '210mm'; // Largura de uma folha A4
  container.style.padding = '15mm';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '10pt';
  container.style.color = '#000';
  container.style.backgroundColor = '#fff';
  container.style.boxSizing = 'border-box';

  // Monta o conteúdo do PDF usando HTML e os dados da avaliação
  container.innerHTML = `
    <div style="font-family: Arial, sans-serif; font-size: 10pt;">
        <h1 style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">Ficha de Avaliação Fisioterapêutica</h1>
        <p><strong>Data da Avaliação:</strong> ${formatDateTime(avaliacao.dataAvaliacao)}</p>
        
        <h2 style="background-color: #eee; padding: 5px; margin-top: 20px; font-size: 14pt;">Identificação do Paciente</h2>
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>Data de Nascimento:</strong> ${formatDate(cliente.dataNascimento)}</p>
        <p><strong>Telefone:</strong> ${checkValue(cliente.telefone)}</p>
        <p><strong>Profissão:</strong> ${checkValue(cliente.profissao)}</p>

        <h2 style="background-color: #eee; padding: 5px; margin-top: 20px; font-size: 14pt;">Diagnósticos</h2>
        <p><strong>Diagnóstico Clínico:</strong> ${checkValue(avaliacao.diagnosticoClinico)}</p>
        <p><strong>Diagnóstico Fisioterapêutico:</strong> ${checkValue(avaliacao.diagnosticoFisioterapeutico)}</p>
        
        <h2 style="background-color: #eee; padding: 5px; margin-top: 20px; font-size: 14pt;">Avaliação</h2>
        <p><strong>Queixa Principal:</strong> ${checkValue(avaliacao.queixaPrincipal)}</p>
        <p><strong>História Clínica:</strong> ${checkValue(avaliacao.historiaClinica)}</p>
        <p><strong>Hábitos de Vida:</strong> ${checkValue(avaliacao.habitosVida)}</p>
        <p><strong>HMA:</strong> ${checkValue(avaliacao.hma)}</p>
        <p><strong>HMP:</strong> ${checkValue(avaliacao.hmp)}</p>
        <p><strong>Antecedentes Pessoais:</strong> ${checkValue(avaliacao.antecedentesPessoais)}</p>
        <p><strong>Antecedentes Familiares:</strong> ${checkValue(avaliacao.antecedentesFamiliares)}</p>
        <p><strong>Tratamentos Realizados:</strong> ${checkValue(avaliacao.tratamentosRealizados)}</p>

        <h2 style="background-color: #eee; padding: 5px; margin-top: 20px; font-size: 14pt;">Exame Clínico/Físico</h2>
        <p><strong>Apresentação do Paciente:</strong> ${[
            avaliacao.deambulando && "Deambulando",
            avaliacao.deambulandoComApoio && "Com Apoio/Auxílio",
            avaliacao.cadeiraDeRodas && "Cadeira de Rodas",
            avaliacao.internado && "Internado",
            avaliacao.orientado && "Orientado"
        ].filter(Boolean).join(', ') || 'Não informado'}</p>
        <p><strong>Exames Complementares:</strong> ${formatBool(avaliacao.temExamesComplementares)} - ${checkValue(avaliacao.examesComplementaresDescricao)}</p>
        <p><strong>Usa Medicamentos:</strong> ${formatBool(avaliacao.usaMedicamentos)} - ${checkValue(avaliacao.medicamentosDescricao)}</p>
        <p><strong>Realizou Cirurgia:</strong> ${formatBool(avaliacao.realizouCirurgia)} - ${checkValue(avaliacao.cirurgiasDescricao)}</p>
        <p><strong>Semiologia:</strong> ${checkValue(avaliacao.semiologia)}</p>
        <p><strong>Testes Específicos:</strong> ${checkValue(avaliacao.testesEspecificos)}</p>

        <h3 style="margin-top: 15px;">Avaliação da Intensidade da Dor (EVA): ${avaliacao.avaliacaoDor}/10</h3>
        <img src="/escala-eva.png" style="width: 100%; max-width: 650px; margin-top: 10px;" />
        
        <h2 style="background-color: #eee; padding: 5px; margin-top: 20px; font-size: 14pt;">Plano Terapêutico</h2>
        <p><strong>Objetivos do Tratamento:</strong> ${checkValue(avaliacao.objetivosTratamento)}</p>
        <p><strong>Recursos Terapêuticos:</strong> ${checkValue(avaliacao.recursosTerapeuticos)}</p>
        <p><strong>Plano de Tratamento:</strong> ${checkValue(avaliacao.planoTratamento)}</p>
        <p><strong>Evolução:</strong> ${checkValue(avaliacao.evolucao)}</p>
    </div>
  `;

  document.body.appendChild(container);

  // Usa o html2canvas para "fotografar" o molde invisível
  html2canvas(container, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`avaliacao-${cliente.nome.replace(/\s/g, '_')}-${new Date().toLocaleDateString()}.pdf`);

    // Remove o molde da página
    document.body.removeChild(container);
  });
};