# Soul Saluttē - Sistema de Gerenciamento de Pacientes

Sistema completo de CRM para clínica de fisioterapia, desenvolvido com React 18, TypeScript e Vite.

## 🌟 Funcionalidades

- **Gestão de Clientes**: Cadastro completo com informações pessoais e contato
- **Avaliações Fisioterapêuticas**: Fichas detalhadas com anamnese, exame clínico e plano terapêutico
- **Agendamento**: Calendário interativo para sessões de fisioterapia
- **Dashboard**: Estatísticas e métricas em tempo real
- **Sistema de Autenticação**: Login seguro e gestão de usuários
- **Geração de PDFs**: Relatórios de avaliações em PDF
- **Interface Responsiva**: Design moderno e profissional

## 🎨 Design System

- **Cores Primárias**: #1A7B7D (Teal), #948066 (Taupe)
- **Cor de Fundo**: #EDE2C9 (Cream)
- **Tipografia**: Inter (Google Fonts)
- **UI Library**: shadcn/ui + Radix UI
- **Ícones**: Lucide React

## 🚀 Tecnologias

- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Formulários**: React Hook Form + Zod
- **Datas**: date-fns
- **Gráficos**: Recharts
- **Notificações**: Sonner

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 16+
- npm 8+ ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd soul-salutte-crm

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Faz o build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linting do código

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   └── figma/           # Componentes específicos do Figma
├── contexts/            # Context providers
├── data/               # Dados mock e utilitários
├── hooks/              # Custom hooks
├── lib/                # Utilitários e helpers
├── styles/             # Arquivos CSS globais
└── types/              # Definições TypeScript
```

## 🔧 Configuração

O projeto usa configurações otimizadas para:

- **TypeScript**: Configuração strict com path mapping
- **Vite**: Hot reload otimizado e build de produção
- **Tailwind**: V4 com sistema de design customizado
- **ESLint**: Regras para React e TypeScript

## 🎯 Funcionalidades Detalhadas

### Dashboard
- Estatísticas de clientes ativos
- Próximas sessões agendadas
- Métricas de avaliações
- Gráficos interativos

### Gestão de Clientes
- Cadastro completo com validação
- Busca e filtros avançados
- Histórico de sessões
- Detalhes de contato e informações médicas

### Avaliações Fisioterapêuticas
- Anamnese detalhada
- Exame clínico estruturado
- Plano terapêutico personalizado
- Exportação em PDF
- Acompanhamento de evolução

### Calendário
- Visualização mensal, semanal e diária
- Agendamento de sessões
- Sincronização com dados dos clientes
- Notificações e lembretes

## 🔒 Autenticação

Sistema de autenticação simulado para demonstração:
- Usuário: admin@soulsalutte.com
- Senha: admin123

> **Nota**: Em produção, implementar sistema de autenticação real com JWT/OAuth

## 🚀 Próximos Passos

- [ ] Integração com API backend
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios avançados
- [ ] Backup automático de dados
- [ ] Aplicativo mobile
- [ ] Integração com WhatsApp

## 📄 Licença

Este projeto é propriedade da Soul Saluttē. Todos os direitos reservados.

## 🤝 Contribuição

Para contribuir com o projeto, entre em contato com a equipe de desenvolvimento.

---

**Soul Saluttē** - Cuidando da sua saúde com tecnologia e humanização.