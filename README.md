# Dictionary App - Fullstack Challenge 🏅

Um aplicativo completo de dicionário em inglês que permite aos usuários buscar palavras, visualizar definições, salvar favoritos e acompanhar histórico de consultas.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **MongoDB** como banco de dados principal
- **Redis** para cache
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Mongoose** como ODM

### Frontend
- **React 19** com hooks
- **Material-UI (MUI)** para componentes
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado

## 📋 Funcionalidades

### ✅ Obrigatórias
- [x] Sistema de autenticação (login/signup)
- [x] Listagem de palavras com paginação
- [x] Busca de palavras
- [x] Visualização de definições e fonética
- [x] Sistema de favoritos
- [x] Histórico de palavras visitadas
- [x] Proxy para API Free Dictionary
- [x] Cache com Redis

### 🎯 Diferenciais Implementados
- [x] **Docker** configurado para facilitar deploy
- [x] **Cache inteligente** com headers de performance
- [x] **Rate limiting** para proteção da API
- [x] **Validação de dados** robusta
- [x] **Tratamento de erros** centralizado
- [x] **Logs** com Morgan
- [x] **Script de importação** de palavras

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- MongoDB (opcional, Docker fornece)

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd dictionary-app
```

### 2. Configure as variáveis de ambiente
```bash
# Backend
cd backend
cp config.env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Inicie os serviços com Docker
```bash
# Na raiz do projeto
docker-compose up -d
```

### 4. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Importe as palavras para o banco
```bash
cd backend
npm run import -- --file=./words.txt --batch=1000
```

### 6. Inicie as aplicações
```bash
# Backend (em um terminal)
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm start
```

## 🌐 Endpoints da API

### Autenticação
- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/signin` - Login de usuário

### Palavras
- `GET /entries/en` - Lista de palavras (com busca e paginação)
- `GET /entries/en/:word` - Detalhes de uma palavra
- `POST /entries/en/:word/favorite` - Marcar como favorito
- `DELETE /entries/en/:word/unfavorite` - Remover dos favoritos

### Usuário
- `GET /user/me` - Perfil do usuário
- `GET /user/me/history` - Histórico de palavras
- `GET /user/me/favorites` - Lista de favoritos

## 📱 Funcionalidades do Frontend

- **Design responsivo** com Material-UI
- **Navegação intuitiva** entre páginas
- **Busca em tempo real** de palavras
- **Sistema de favoritos** com toggle
- **Histórico visual** de consultas
- **Interface moderna** e acessível

## 🐳 Docker

O projeto inclui configuração completa do Docker:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 🔧 Scripts Disponíveis

### Backend
- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento
- `npm run import` - Importa palavras para o banco

### Frontend
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes

## 📊 Estrutura do Projeto

```
dictionary-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── models/          # Modelos do MongoDB
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços de negócio
│   │   ├── middlewares/     # Middlewares (auth, erro)
│   │   └── config/          # Configurações (DB, Redis)
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── contexts/        # Contextos do React
│   │   └── services/        # Serviços de API
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

## 🚀 Deploy

### Local com Docker
```bash
docker-compose up -d
```

### Produção
1. Configure as variáveis de ambiente
2. Build das imagens Docker
3. Deploy em seu servidor preferido

## 🧪 Testes

```bash
# Frontend
cd frontend
npm test

# Backend (quando implementado)
cd backend
npm test
```

## 📝 Licença

Este projeto foi desenvolvido como parte do **Fullstack Challenge by Coodesh** 🏅

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para o Fullstack Challenge by Coodesh**
