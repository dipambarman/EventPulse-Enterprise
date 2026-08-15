FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install && npx prisma generate && npm prune --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
