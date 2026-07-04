FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4201
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4201", "--no-ssl"]
