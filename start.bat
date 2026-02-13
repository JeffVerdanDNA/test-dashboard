@echo off
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       GENOMATECH TEST DASHBOARD - INICIALIZAÇÃO               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 18+
    pause
    exit /b 1
)

:: Verificar Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python não encontrado. Por favor, instale Python 3.8+
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
echo ✓ Python encontrado
echo.

:: Instalar dependências do frontend
if not exist "node_modules" (
    echo 📦 Instalando dependências do frontend...
    call npm install
    echo.
)

:: Instalar dependências do backend
if not exist "backend\venv" (
    echo 📦 Criando ambiente virtual Python...
    python -m venv backend\venv
    call backend\venv\Scripts\activate
    pip install -r backend\requirements.txt
    echo.
) else (
    call backend\venv\Scripts\activate
)

:: Criar arquivo .env.local se não existir
if not exist ".env.local" (
    echo ⚙️ Criando arquivo .env.local...
    copy .env.example .env.local
    echo.
)

:: Criar pasta de logs
if not exist "logs" mkdir logs

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    INICIANDO SERVIDORES                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Iniciar backend
echo 🚀 Iniciando Backend (Flask)...
start "Backend API" cmd /k "python backend\api_server.py"
timeout /t 3 /nobreak >nul

:: Iniciar frontend
echo 🚀 Iniciando Frontend (Next.js)...
start "Frontend Dashboard" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  ✅ TUDO PRONTO!                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Dashboard: http://localhost:3000
echo 🔧 API Backend: http://localhost:5000
echo 📊 Health Check: http://localhost:5000/api/health
echo.
echo Duas janelas foram abertas. Feche-as para parar os servidores.
echo.
pause
