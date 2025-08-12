#!/bin/bash

echo "🚀 Iniciando Dictionary App - Fullstack Challenge 🏅"
echo "=================================================="

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está disponível. Por favor, instale o Docker Compose."
    exit 1
fi

echo "✅ Docker e Docker Compose estão disponíveis"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose up --build -d

# Aguardar serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 10

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "🎉 Dictionary App iniciado com sucesso!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  MongoDB: localhost:27017"
echo "⚡ Redis: localhost:6379"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo ""
echo "🔍 Para importar palavras para o banco:"
echo "  docker-compose exec backend npm run import -- --file=./words.txt --batch=1000"
echo ""
echo "✨ Aproveite o Dictionary App!"
