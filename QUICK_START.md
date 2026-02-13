# 🚀 Guia de Início Rápido

## ⚡ Começar em 5 Minutos

### 1. Requisitos Mínimos
- ✅ Node.js 18+
- ✅ Python 3.8+
- ✅ Google Chrome

### 2. Instalação Rápida

```bash
# Clone o projeto
cd test-dashboard

# Execute o script de inicialização
# Linux/Mac:
chmod +x start.sh
./start.sh

# Windows:
start.bat
```

Pronto! Acesse: **http://localhost:3000**

---

## 📖 Passo a Passo Detalhado

### Passo 1: Instalar Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Passo 2: Configurar Ambiente

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Passo 3: Iniciar Servidores

#### Terminal 1 - Backend
```bash
cd backend
python api_server.py
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### Passo 4: Acessar Dashboard

Abra seu navegador em: **http://localhost:3000**

---

## 🎯 Primeiro Teste

1. **Clique em "Executar Teste"**
   - O botão azul no canto superior direito

2. **Aguarde a Execução**
   - Você verá o progresso em tempo real
   - Status aparecerá como "Executando..."

3. **Ver Resultados**
   - Quando concluído, vá para aba "Histórico"
   - Clique no teste mais recente
   - Veja todos os detalhes e screenshots

---

## 🔧 Configurações Iniciais

### Configurar URL da Plataforma

1. Vá para aba **"Configurações"**
2. Edite o campo **"URL da Plataforma"**
3. Ajuste outras opções conforme necessário:
   - Timeout
   - Tempo entre cliques
   - Modo headless
   - Captura de screenshots

### Adicionar Credenciais (Opcional)

Edite `backend/api_server.py`:

```python
agente.executar_testes(
    usuario="seu_usuario",
    senha="sua_senha",
    headless=True
)
```

---

## 📊 Entendendo o Dashboard

### Cards de Estatísticas
- **Total de Testes**: Número total de execuções
- **Taxa de Sucesso**: Porcentagem de testes aprovados
- **Testes Aprovados**: Testes sem erros
- **Testes com Erros**: Testes que falharam

### Gráfico
- Mostra os últimos 10 testes
- Linhas:
  - 🔵 Azul: Abas testadas
  - 🟢 Verde: Sucessos
  - 🔴 Vermelho: Erros

### Histórico
- Lista de todos os testes executados
- Clique em um teste para ver detalhes
- Badges de status:
  - ✅ Verde: Sucesso
  - ❌ Vermelho: Falhou
  - ⏳ Azul: Executando

---

## ❓ Perguntas Frequentes

### O teste não está executando?

1. Verifique se o backend está rodando
2. Acesse: http://localhost:5000/api/health
3. Se retornar erro, reinicie o backend

### Screenshots não aparecem?

1. Crie a pasta `screenshots/` na raiz do projeto
2. Verifique permissões de escrita
3. Confira se "Capturar screenshots" está habilitado

### Como agendar testes automáticos?

Por enquanto, use cron (Linux) ou Task Scheduler (Windows):

```bash
# Cron example (Linux)
0 * * * * curl -X POST http://localhost:5000/api/tests/run
```

### Posso testar outro ambiente?

Sim! Vá em Configurações e altere a URL da plataforma.

---

## 🎨 Personalizações Rápidas

### Mudar Cores

Edite `app/globals.css`:

```css
:root {
  --accent-primary: #3b82f6;  /* Sua cor primária */
}
```

### Alterar Timeout Padrão

Edite `backend/api_server.py`:

```python
agente = AgenteVendas(url=url)
agente.driver.implicitly_wait(20)  # 20 segundos
```

---

## 📞 Precisa de Ajuda?

1. Verifique os logs:
   - Backend: `logs/backend.log`
   - Frontend: `logs/frontend.log`

2. Console do navegador (F12)

3. Consulte o README completo

---

## ✨ Próximos Passos

- [ ] Configure credenciais para login automático
- [ ] Ajuste as configurações de timeout
- [ ] Explore os detalhes dos testes
- [ ] Configure notificações (próxima versão)

---

**🎉 Parabéns! Você está pronto para começar a testar!**
