#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       GENOMATECH TEST DASHBOARD - INICIALIZAÇÃO               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js 18+${NC}"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python não encontrado. Por favor, instale Python 3.8+${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) encontrado"
echo -e "${GREEN}✓${NC} Python $(python3 --version) encontrado"
echo ""

# Instalar dependências do frontend se necessário
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
    npm install
    echo ""
fi

# Instalar dependências do backend se necessário
if [ ! -d "backend/venv" ]; then
    echo -e "${BLUE}📦 Criando ambiente virtual Python...${NC}"
    python3 -m venv backend/venv
    source backend/venv/bin/activate
    pip install -r backend/requirements.txt
    echo ""
else
    source backend/venv/bin/activate
fi

# Criar arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}⚙️  Criando arquivo .env.local...${NC}"
    cp .env.example .env.local
    echo ""
fi

echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    INICIANDO SERVIDORES                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo -e "${RED}⏹️  Encerrando servidores...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${BLUE}🚀 Iniciando Backend (Flask)...${NC}"
python3 backend/api_server.py > logs/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verificar se backend iniciou
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Backend rodando em http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Falha ao iniciar backend${NC}"
    cat logs/backend.log
    exit 1
fi

# Iniciar frontend
echo -e "${BLUE}🚀 Iniciando Frontend (Next.js)...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Verificar se frontend iniciou
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Frontend rodando em http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Falha ao iniciar frontend${NC}"
    cat logs/frontend.log
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ TUDO PRONTO!                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Dashboard:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 API Backend:${NC} http://localhost:5000"
echo -e "${BLUE}📊 Health Check:${NC} http://localhost:5000/api/health"
echo ""
echo -e "${RED}Pressione Ctrl+C para parar os servidores${NC}"
echo ""

# Manter o script rodando
wait
