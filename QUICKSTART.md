# 🚀 Início Rápido - Dictionary App

## ⚡ Setup em 3 Passos

### 1. Clone e Entre no Projeto
```bash
git clone <seu-repositorio>
cd dictionary-app
```

### 2. Inicie com Docker (Recomendado)
```bash
# Linux/Mac
./start.sh

# Windows
start.bat

# Ou manualmente:
docker-compose up --build -d
```

### 3. Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Setup Manual (Sem Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Banco de Dados
- Instale MongoDB localmente
- Configure a string de conexão em `backend/config.env`

## 📱 Funcionalidades Principais

- ✅ **Autenticação** - Login/Signup
- ✅ **Busca de Palavras** - API Free Dictionary
- ✅ **Favoritos** - Salvar palavras preferidas
- ✅ **Histórico** - Acompanhar consultas
- ✅ **Cache** - Performance otimizada

## 🐛 Solução de Problemas

### Docker não inicia
```bash
# Verificar se Docker está rodando
docker info

# Parar todos os containers
docker-compose down

# Limpar volumes (cuidado: perde dados)
docker-compose down -v
```

### Porta já em uso
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Parar processo na porta
kill -9 <PID>
```

### Banco não conecta
```bash
# Verificar logs do MongoDB
docker-compose logs mongo

# Reiniciar serviço
docker-compose restart mongo
```

## 📋 Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Ver status dos serviços
docker-compose ps

# Executar comando no container
docker-compose exec backend npm run import
```

## 🔍 Importar Palavras

```bash
# Importar palavras para o banco
docker-compose exec backend npm run import -- --file=./words.txt --batch=1000

# Ou manualmente
cd backend
npm run import -- --file=./words.txt --batch=1000
```

## 📚 Próximos Passos

1. **Explore a API** em http://localhost:5000
2. **Teste o Frontend** em http://localhost:3000
3. **Crie uma conta** e teste as funcionalidades
4. **Personalize** o projeto conforme necessário

## 🆘 Precisa de Ajuda?

- 📖 Leia o [README.md](README.md) completo
- 🐛 Abra uma issue no repositório
- 💬 Consulte a documentação da API

---

**✨ Aproveite o Dictionary App!**
