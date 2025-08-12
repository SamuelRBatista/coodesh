@echo off
echo 🚀 Iniciando Dictionary App - Fullstack Challenge 🏅
echo ==================================================

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está disponível
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está disponível. Por favor, instale o Docker Compose.
    pause
    exit /b 1
)

echo ✅ Docker e Docker Compose estão disponíveis

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down

REM Construir e iniciar serviços
echo 🔨 Construindo e iniciando serviços...
docker-compose up --build -d

REM Aguardar serviços estarem prontos
echo ⏳ Aguardando serviços estarem prontos...
timeout /t 10 /nobreak >nul

REM Verificar status dos serviços
echo 📊 Status dos serviços:
docker-compose ps

echo.
echo 🎉 Dictionary App iniciado com sucesso!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🗄️  MongoDB: localhost:27017
echo ⚡ Redis: localhost:6379
echo.
echo 📋 Comandos úteis:
echo   - Ver logs: docker-compose logs -f
echo   - Parar: docker-compose down
echo   - Reiniciar: docker-compose restart
echo.
echo 🔍 Para importar palavras para o banco:
echo   docker-compose exec backend npm run import -- --file=./words.txt --batch=1000
echo.
echo ✨ Aproveite o Dictionary App!
pause
