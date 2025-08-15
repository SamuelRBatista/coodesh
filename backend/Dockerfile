FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000 9229

# Usar nodemon para hot reload sem travar o Node no start
CMD ["node", "--inspect=0.0.0.0:9229", "src/server.js"]