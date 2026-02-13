# 🚀 Guia de Deploy - Vercel + Backend Separado

## 📋 Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────┐
│                      VERCEL                              │
│               (Frontend Next.js)                         │
│          https://seu-app.vercel.app                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS/API Calls
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND SEPARADO                            │
│         (Flask + Selenium + Chrome)                      │
│                                                          │
│  Opções:                                                 │
│  • Railway.app (Recomendado)                            │
│  • Render.com                                            │
│  • DigitalOcean                                          │
│  • AWS EC2                                               │
│  • Seu próprio servidor VPS                             │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Estratégia Recomendada

### Opção 1: Railway.app (Mais Fácil) ⭐ RECOMENDADO

**Vantagens:**
- ✅ Suporta Python nativamente
- ✅ Pode instalar Chrome/Selenium
- ✅ Deploy automático via Git
- ✅ Free tier generoso
- ✅ HTTPS automático
- ✅ Variáveis de ambiente fáceis

**Passos:**
1. Frontend no Vercel
2. Backend no Railway
3. Configurar variável `NEXT_PUBLIC_API_URL` no Vercel

### Opção 2: Render.com (Alternativa)

**Vantagens:**
- ✅ Similar ao Railway
- ✅ Free tier disponível
- ✅ Suporte a Docker
- ✅ Background workers

### Opção 3: VPS Próprio (Controle Total)

**Vantagens:**
- ✅ Controle completo
- ✅ Sem limites de tempo
- ✅ Pode escalar conforme necessário

**Desvantagens:**
- ❌ Requer manutenção
- ❌ Custo mensal fixo

## 📦 Deploy Passo a Passo

---

## 🔷 PARTE 1: Deploy Frontend no Vercel

### 1. Preparar o Projeto

```bash
cd test-dashboard

# Criar vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["gru1"]
}
EOF
```

### 2. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 3. Fazer Deploy

```bash
# Login
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Seu usuário
# - Link to existing project? No
# - Project name? genomatech-test-dashboard
# - Directory? ./
# - Override settings? No
```

### 4. Configurar Variável de Ambiente

Após o deploy, no dashboard do Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://seu-backend.railway.app` (URL do seu backend)
   - Environment: Production, Preview, Development

3. **Redeploy** o projeto para aplicar

---

## 🔶 PARTE 2: Deploy Backend no Railway

### 1. Criar Conta no Railway

Acesse: https://railway.app e faça login com GitHub

### 2. Preparar Backend

Crie estes arquivos na pasta `backend/`:

**Procfile:**
```
web: python api_server.py
```

**runtime.txt:**
```
python-3.11
```

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python api_server.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**nixpacks.toml:** (para instalar Chrome)
```toml
[phases.setup]
nixPkgs = ["python311", "chromium", "chromedriver"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[phases.build]
cmds = []

[start]
cmd = "python api_server.py"
```

### 3. Atualizar api_server.py

Adicione no início do arquivo:

```python
import os

# Configurar Chrome para Railway/Render
CHROME_PATH = os.getenv('CHROME_PATH', '/usr/bin/chromium')
CHROMEDRIVER_PATH = os.getenv('CHROMEDRIVER_PATH', '/usr/bin/chromedriver')
PORT = int(os.getenv('PORT', 5000))

# No final do arquivo, mude:
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=PORT)
```

E no agente_vendas.py:

```python
def iniciar_browser(self, headless=True):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    
    # Para produção
    if os.getenv('RAILWAY_ENVIRONMENT'):
        chrome_options.binary_location = os.getenv('CHROME_PATH')
    
    self.driver = webdriver.Chrome(options=chrome_options)
```

### 4. Deploy no Railway

**Via GitHub (Recomendado):**

1. Faça push do código para GitHub
2. No Railway, clique em **New Project**
3. Escolha **Deploy from GitHub repo**
4. Selecione seu repositório
5. Configure:
   - Root Directory: `backend`
   - Build Command: (deixe automático)
   - Start Command: `python api_server.py`

**Via CLI:**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Dentro da pasta backend/
cd backend
railway init
railway up
```

### 5. Configurar Variáveis no Railway

No dashboard do Railway, adicione:

```
PORT=5000
CHROME_PATH=/usr/bin/chromium
CHROMEDRIVER_PATH=/usr/bin/chromedriver
```

### 6. Obter URL do Backend

Após deploy, vá em **Settings** → **Networking** → **Generate Domain**

Copie a URL (ex: `https://seu-projeto.railway.app`)

---

## 🔗 Conectar Frontend e Backend

### 1. Atualizar Vercel

No dashboard do Vercel:
- **Environment Variables** → Edite `NEXT_PUBLIC_API_URL`
- Cole a URL do Railway
- **Redeploy**

### 2. Testar

```bash
# Testar backend
curl https://seu-backend.railway.app/api/health

# Acessar frontend
# Abrir https://seu-app.vercel.app
# Clicar em "Executar Teste"
```

---

## 🔧 Alternativa: Render.com

Se preferir Render ao invés de Railway:

### 1. Criar Web Service no Render

1. Acesse https://render.com
2. **New** → **Web Service**
3. Conecte seu repositório
4. Configure:
   - Name: `genomatech-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python api_server.py`

### 2. Adicionar Chrome via Docker

Crie `Dockerfile` na pasta backend:

```dockerfile
FROM python:3.11-slim

# Instalar Chrome
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV CHROME_PATH=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver
ENV PORT=5000

CMD ["python", "api_server.py"]
```

No Render, mude Environment para **Docker**.

---

## 🔐 Segurança em Produção

### 1. Configurar CORS Adequadamente

Em `api_server.py`:

```python
from flask_cors import CORS

# Substituir:
# CORS(app)

# Por:
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://seu-app.vercel.app",
            "http://localhost:3000"  # Para desenvolvimento
        ]
    }
})
```

### 2. Variáveis Sensíveis

**Nunca commite:**
- Senhas
- Tokens
- API Keys

Use variáveis de ambiente em ambas plataformas.

### 3. Rate Limiting

Adicione no backend:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/api/tests/run', methods=['POST'])
@limiter.limit("5 per hour")  # Máximo 5 testes por hora
def run_test():
    # ...
```

---

## 💰 Custos Estimados

### Free Tier:

| Serviço | Free Tier | Limites |
|---------|-----------|---------|
| **Vercel** | ✅ Ilimitado | Bandwidth: 100GB/mês |
| **Railway** | ✅ $5 crédito/mês | ~500h execução |
| **Render** | ✅ 750h/mês | 1 instância grátis |

### Para Produção (estimado):

- **Vercel Pro**: $20/mês
- **Railway Pro**: ~$10-20/mês (conforme uso)
- **Render Starter**: $7/mês

**Total**: ~$27-40/mês para operação profissional

---

## 🚨 Limitações do Free Tier

### Railway Free:
- ❌ Dorme após inatividade (pode levar ~30s para acordar)
- ❌ $5 crédito mensal (suficiente para testes moderados)

### Render Free:
- ❌ Dorme após 15 min de inatividade
- ❌ Mais lento para acordar (~1-2 min)

### Soluções:

1. **Ping periódico**: Configure um cron job para manter ativo
2. **Upgrade para pago**: Garante disponibilidade 24/7
3. **VPS próprio**: Controle total, sem sleep

---

## 📊 Checklist de Deploy

### Frontend (Vercel):
- [ ] Projeto no GitHub
- [ ] Deploy feito via Vercel
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] Build com sucesso
- [ ] Teste manual da interface

### Backend (Railway/Render):
- [ ] Arquivos de config criados (Procfile, etc)
- [ ] Chrome/ChromeDriver configurados
- [ ] Deploy com sucesso
- [ ] Health check funcionando
- [ ] URL pública gerada
- [ ] Variáveis de ambiente configuradas

### Integração:
- [ ] Frontend conecta ao backend
- [ ] Teste completo funciona
- [ ] Screenshots sendo salvos
- [ ] Histórico persistindo

---

## 🆘 Troubleshooting

### Erro: "CORS policy"
→ Configure CORS no backend com a URL do Vercel

### Erro: "Chrome not found"
→ Verifique nixpacks.toml ou Dockerfile

### Erro: "Timeout"
→ Aumente timeout ou use VPS dedicado

### Backend dorme (free tier)
→ Configure ping externo ou faça upgrade

---

## 🎯 Resumo

**Para começar rápido:**
1. Frontend → Vercel (3 minutos)
2. Backend → Railway (5 minutos)
3. Conectar (2 minutos)

**Total: ~10 minutos de deploy!** 🚀

---

Quer que eu crie os arquivos de configuração específicos para Railway ou Render?
