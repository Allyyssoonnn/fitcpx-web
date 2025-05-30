# Stage 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

RUN npm install

# Copia todo o código fonte
COPY . .

# Build da aplicação React com Vite (gera a pasta dist)
RUN npm run build

# Stage 2: Serve os arquivos com nginx
FROM nginx:alpine

# Remove configuração default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia arquivo customizado de configuração nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copia build do React do stage anterior para pasta do nginx
COPY --from=build /dist /usr/share/nginx/html

EXPOSE 3070
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]