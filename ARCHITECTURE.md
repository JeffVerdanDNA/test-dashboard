# 🏗️ Arquitetura do Sistema

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO                                  │
│                    (Navegador Web)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                            │
│                   http://localhost:3000                          │
├─────────────────────────────────────────────────────────────────┤
│  • Dashboard UI (React Components)                               │
│  • Gráficos e Visualizações (Recharts)                          │
│  • API Routes (Next.js API)                                      │
│  • TypeScript + Tailwind CSS                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API
                         │ (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask)                               │
│                   http://localhost:5000                          │
├─────────────────────────────────────────────────────────────────┤
│  • API REST Endpoints                                            │
│  • Gerenciamento de Testes                                       │
│  • Threading (Execução Assíncrona)                              │
│  • Persistência de Dados (JSON)                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Python Import
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENTE DE TESTES                              │
│                   (agente_vendas.py)                             │
├─────────────────────────────────────────────────────────────────┤
│  • Selenium WebDriver                                            │
│  • Navegação Automatizada                                       │
│  • Captura de Screenshots                                       │
│  • Detecção de Erros                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ WebDriver Protocol
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE CHROME                                 │
│                  (Browser Headless/GUI)                          │
├─────────────────────────────────────────────────────────────────┤
│  • Renderização de páginas                                      │
│  • Execução de JavaScript                                       │
│  • Captura de screenshots                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               PLATAFORMA GENOMATECH                              │
│          https://homolog.genomatech.com.br/                      │
├─────────────────────────────────────────────────────────────────┤
│  • Aplicação Web                                                 │
│  • Sistema de Login                                              │
│  • Menu Lateral com Abas                                        │
│  • Funcionalidades de Vendas                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Execução de Teste

```
1. Usuário clica em "Executar Teste"
         │
         ▼
2. Frontend faz POST /api/tests/run
         │
         ▼
3. Backend recebe request e cria novo teste
         │
         ▼
4. Backend inicia thread assíncrona
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼                                     ▼
5. Thread executa agente           Frontend faz polling
         │                          GET /api/tests/current
         ▼                          (a cada 2 segundos)
6. Agente inicia Chrome                      │
         │                                    │
         ▼                                    ▼
7. Agente acessa plataforma        Atualiza UI com progresso
         │
         ▼
8. Agente faz login (se configurado)
         │
         ▼
9. Agente identifica menu lateral
         │
         ▼
10. Para cada aba do menu:
    ├─ Clica na aba
    ├─ Captura screenshot
    ├─ Verifica erros
    └─ Registra resultado
         │
         ▼
11. Agente gera relatório
         │
         ▼
12. Backend salva no histórico
         │
         ▼
13. Frontend detecta conclusão (polling)
         │
         ▼
14. Frontend atualiza dashboard com resultados
```

## 📁 Estrutura de Dados

### TestResult (Formato JSON)

```json
{
  "id": "1234567890",
  "timestamp": "2024-02-13T10:30:00",
  "url": "https://homolog.genomatech.com.br/",
  "login_sucesso": true,
  "status": "concluido",
  "duracao": 45,
  "erros_encontrados": [],
  "abas_testadas": [
    {
      "nome": "Dashboard",
      "ordem": 1,
      "url_antes": "https://...",
      "url_depois": "https://...",
      "screenshot": "aba_01_Dashboard.png",
      "erros": [],
      "sucesso": true,
      "tempo_carregamento": 2.3
    }
  ],
  "resumo": {
    "total_abas_testadas": 8,
    "abas_com_sucesso": 8,
    "abas_com_erro": 0,
    "total_erros": 0
  }
}
```

## 🔌 API Endpoints

### Detalhamento dos Endpoints

#### 1. GET /api/tests
**Propósito**: Listar todos os testes executados

**Response**:
```json
{
  "tests": [TestResult[], ...],
  "total": 10
}
```

#### 2. POST /api/tests/run
**Propósito**: Iniciar novo teste

**Response**:
```json
{
  "message": "Teste iniciado com sucesso",
  "test_id": "1234567890"
}
```

#### 3. GET /api/tests/current
**Propósito**: Obter status do teste em execução

**Response**:
```json
{
  ...TestResult,
  "status": "executando"
}
```

#### 4. GET /api/tests/:id
**Propósito**: Obter detalhes de um teste específico

**Response**:
```json
TestResult
```

#### 5. GET /api/stats
**Propósito**: Estatísticas gerais

**Response**:
```json
{
  "total_tests": 10,
  "successful_tests": 8,
  "failed_tests": 2,
  "success_rate": 80.0,
  "last_test": TestResult
}
```

#### 6. GET /api/screenshots/:filename
**Propósito**: Obter screenshot

**Response**: Imagem PNG (binary)

#### 7. GET/POST /api/config
**Propósito**: Gerenciar configurações

**GET Response**:
```json
{
  "url": "https://...",
  "timeout": 10,
  "headless": true,
  "screenshots": true
}
```

#### 8. GET /api/health
**Propósito**: Health check do backend

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-02-13T10:30:00",
  "agente_disponivel": true
}
```

## 🎨 Componentes Frontend

### Hierarquia de Componentes

```
App (page.tsx)
├─ Header
│  └─ Navigation Tabs
├─ Control Panel
│  ├─ Execute Test Button
│  └─ Refresh Button
├─ Overview Tab
│  ├─ StatsCards
│  │  ├─ Total Tests Card
│  │  ├─ Success Rate Card
│  │  ├─ Approved Tests Card
│  │  └─ Failed Tests Card
│  └─ TestChart
│     └─ Recharts Line Chart
├─ History Tab
│  ├─ TestHistory (Sidebar)
│  │  └─ Test List Items
│  └─ TestDetails (Main)
│     ├─ Test Summary
│     ├─ Tabs Tested List
│     └─ Errors List
└─ Settings Tab
   └─ Configuration Form
```

## 💾 Persistência de Dados

### Arquivos de Dados

```
backend/data/
├─ test_history.json      # Histórico de testes
└─ config.json            # Configurações

screenshots/
├─ 01_pagina_inicial.png
├─ 02_apos_login.png
├─ aba_01_Dashboard.png
├─ aba_02_Clientes.png
└─ ...
```

### Estratégia de Armazenamento

- **JSON** para dados estruturados (testes, config)
- **PNG** para screenshots
- **Limite**: 50 testes mais recentes no histórico
- **Auto-limpeza**: Testes antigos são removidos automaticamente

## 🔒 Segurança

### Considerações de Segurança

1. **CORS**: Configurado no backend Flask
2. **Credenciais**: Nunca expostas no frontend
3. **Validação**: Inputs validados no backend
4. **Rate Limiting**: Previne múltiplos testes simultâneos

### Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Tokens JWT
- [ ] HTTPS em produção
- [ ] Criptografia de credenciais
- [ ] Rate limiting avançado
- [ ] Logs de auditoria

## 🚀 Performance

### Otimizações Implementadas

1. **Threading**: Testes executam em background
2. **Polling**: Atualização eficiente a cada 2s
3. **Caching**: Screenshots cacheadas
4. **Lazy Loading**: Componentes carregados sob demanda

### Métricas Esperadas

- Tempo médio de teste: 30-60 segundos
- Tempo de resposta API: < 100ms
- Uso de memória: < 500MB
- CPU durante teste: 20-40%

## 🔄 Ciclo de Vida do Teste

```
Estado: PENDENTE
    ↓
    ├─ Criar instância do agente
    ├─ Iniciar navegador
    └─ Configurar WebDriver
    ↓
Estado: EXECUTANDO
    ↓
    ├─ Fazer login
    ├─ Verificar erros iniciais
    ├─ Identificar menu
    └─ Testar cada aba
        ├─ Clicar
        ├─ Aguardar carregamento
        ├─ Capturar screenshot
        ├─ Verificar erros
        └─ Registrar resultado
    ↓
Estado: CONCLUÍDO ou ERRO
    ↓
    ├─ Gerar relatório
    ├─ Fechar navegador
    └─ Salvar no histórico
```

## 📊 Diagrama de Classes (Simplificado)

```
┌─────────────────────┐
│   AgenteVendas      │
├─────────────────────┤
│ - url               │
│ - driver            │
│ - resultados        │
├─────────────────────┤
│ + executar_testes() │
│ + fazer_login()     │
│ + testar_abas()     │
│ + gerar_relatorio() │
└─────────────────────┘

┌─────────────────────┐
│   FlaskAPI          │
├─────────────────────┤
│ - current_test      │
│ - test_history      │
├─────────────────────┤
│ + run_test()        │
│ + get_tests()       │
│ + get_current()     │
└─────────────────────┘

┌─────────────────────┐
│   Dashboard         │
├─────────────────────┤
│ - tests             │
│ - currentTest       │
│ - isRunning         │
├─────────────────────┤
│ + runTest()         │
│ + loadHistory()     │
│ + checkStatus()     │
└─────────────────────┘
```

---

**Este documento descreve a arquitetura completa do sistema de testes automatizados da Genomatech.**
