# 🚀 Genomatech Test Dashboard

Dashboard web moderno para gerenciar e monitorar testes automatizados da plataforma Genomatech.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=for-the-badge&logo=flask)

## 📋 Características

### 🎨 Interface Moderna
- Design responsivo com Tailwind CSS
- Tema dark com gradientes personalizados
- Animações suaves e micro-interações
- Fonte customizada (Outfit + JetBrains Mono)

### 📊 Funcionalidades
- ✅ **Execução de Testes** - Botão para rodar testes com um clique
- 📈 **Estatísticas em Tempo Real** - Cards com métricas importantes
- 📉 **Gráficos Interativos** - Visualização do histórico de testes
- 🗂️ **Histórico Completo** - Lista de todos os testes executados
- 🔍 **Detalhes dos Testes** - Visualização detalhada de cada execução
- 📸 **Screenshots** - Capturas de tela de cada aba testada
- ⚙️ **Configurações** - Ajustes do comportamento dos testes

### 🤖 Integração com Agente
- Backend Flask integrado com o agente Python
- Execução assíncrona de testes
- Polling automático para status em tempo real
- API RESTful para comunicação

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

### Backend
- **Flask** - API REST
- **Python 3.8+** - Linguagem
- **Selenium** - Automação web
- **Threading** - Execução assíncrona

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Python 3.8+
- Google Chrome instalado

### 1️⃣ Clone o Repositório

```bash
git clone <seu-repositorio>
cd test-dashboard
```

### 2️⃣ Instalar Dependências Frontend

```bash
npm install
```

### 3️⃣ Instalar Dependências Backend

```bash
cd backend
pip install -r requirements.txt
```

### 4️⃣ Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` se necessário:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Executando o Projeto

Você precisa executar **DUAS** aplicações simultaneamente:

### Terminal 1: Backend (API Flask)

```bash
cd backend
python api_server.py
```

O backend estará disponível em: `http://localhost:5000`

### Terminal 2: Frontend (Next.js)

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### Ou use o script de inicialização:

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

## 📱 Uso

### Dashboard Principal

1. Acesse `http://localhost:3000`
2. Você verá:
   - **Cards de Estatísticas** - Total de testes, taxa de sucesso, etc.
   - **Gráfico de Histórico** - Últimos 10 testes executados
   - **Botão "Executar Teste"** - Para rodar um novo teste

### Executar Teste

1. Clique no botão **"Executar Teste"**
2. O teste começará a rodar em background
3. Você verá o progresso em tempo real
4. Quando concluído, o resultado aparecerá no histórico

### Ver Histórico

1. Clique na aba **"Histórico"**
2. Selecione um teste da lista
3. Veja todos os detalhes:
   - Abas testadas
   - Erros encontrados
   - Screenshots capturadas
   - Tempo de execução

### Configurações

1. Clique na aba **"Configurações"**
2. Ajuste:
   - URL da plataforma
   - Timeout
   - Tempo entre cliques
   - Modo headless
   - Captura de screenshots

## 🗂️ Estrutura do Projeto

```
test-dashboard/
├── app/
│   ├── api/
│   │   └── tests/
│   │       ├── route.ts          # Lista de testes
│   │       ├── run/route.ts      # Executar teste
│   │       └── current/route.ts  # Teste atual
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/
│   ├── Header.tsx                # Cabeçalho com navegação
│   ├── StatsCards.tsx            # Cards de estatísticas
│   ├── TestChart.tsx             # Gráfico de histórico
│   ├── TestHistory.tsx           # Lista de testes
│   └── TestDetails.tsx           # Detalhes do teste
├── backend/
│   ├── api_server.py             # Servidor Flask
│   ├── requirements.txt          # Dependências Python
│   └── data/                     # Dados persistidos
├── types/
│   └── test.ts                   # Tipagens TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎨 Personalização

### Cores

Edite `app/globals.css`:

```css
:root {
  --accent-primary: #3b82f6;    /* Cor primária */
  --accent-secondary: #8b5cf6;  /* Cor secundária */
  --success: #10b981;            /* Cor de sucesso */
  --error: #ef4444;              /* Cor de erro */
}
```

### Fontes

Edite `app/globals.css` para mudar as fontes:

```css
@import url('sua-fonte-preferida');

:root {
  --font-display: 'SuaFonte', sans-serif;
}
```

## 📊 API Endpoints

### Backend Flask

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tests` | Lista todos os testes |
| `GET` | `/api/tests/current` | Teste em execução |
| `POST` | `/api/tests/run` | Executar novo teste |
| `GET` | `/api/tests/<id>` | Detalhes de um teste |
| `GET` | `/api/stats` | Estatísticas gerais |
| `GET` | `/api/screenshots/<file>` | Obter screenshot |
| `GET/POST` | `/api/config` | Configurações |

## 🔧 Desenvolvimento

### Adicionar Novo Tipo de Teste

1. **Backend** - Edite `backend/api_server.py`:

```python
def run_custom_test():
    # Sua lógica de teste
    pass
```

2. **Frontend** - Adicione botão em `app/page.tsx`:

```tsx
<button onClick={runCustomTest}>
  Teste Customizado
</button>
```

### Adicionar Nova Métrica

1. **Tipos** - Adicione em `types/test.ts`:

```typescript
export interface TestResult {
  // ... campos existentes
  nova_metrica?: number
}
```

2. **Componente** - Use em `components/StatsCards.tsx`

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar se Flask está instalado
pip list | grep Flask

# Reinstalar dependências
pip install -r backend/requirements.txt
```

### Frontend não conecta ao backend

1. Verifique se o backend está rodando: `http://localhost:5000/api/health`
2. Verifique o arquivo `.env.local`
3. Confira o console do navegador para erros

### Testes não executam

1. Verifique se o Chrome está instalado
2. Verifique se o agente `agente_vendas.py` está acessível
3. Confira os logs do backend no terminal

### Screenshots não aparecem

1. Verifique se a pasta `screenshots/` existe
2. Confirme que o agente está configurado para capturar screenshots
3. Verifique permissões de arquivo

## 🚀 Deploy

### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Backend (Railway/Heroku)

1. Configure variáveis de ambiente
2. Adicione `Procfile`:
```
web: python backend/api_server.py
```

## 🔐 Segurança

⚠️ **IMPORTANTE**:

- Nunca commite credenciais no código
- Use variáveis de ambiente para senhas
- Configure CORS adequadamente em produção
- Use HTTPS em produção

## 📈 Próximas Funcionalidades

- [ ] Notificações em tempo real (WebSocket)
- [ ] Exportar relatórios em PDF
- [ ] Agendar testes automáticos
- [ ] Integração com Slack/Discord
- [ ] Métricas de performance detalhadas
- [ ] Comparação entre execuções
- [ ] Filtros e busca avançada
- [ ] Dashboard de múltiplos ambientes
- [ ] Autenticação de usuários
- [ ] Histórico ilimitado com paginação

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso interno da Genomatech.

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique os logs do backend
- Inspecione o console do navegador
- Consulte este README

---

**Desenvolvido com ❤️ para automatizar testes da plataforma Genomatech**
