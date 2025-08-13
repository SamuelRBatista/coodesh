FROM node:18

WORKDIR /app

COPY package*.json ./

# Instala dependências sem problemas de permissão
RUN npm install

COPY . .

# Expõe porta da API e porta do debugger
EXPOSE 5000 9229

# Rodar Node em modo debug, aguardando conexão de debugger externo
CMD ["npm", "run", "start:debug"]