FROM node:18-alpine
WORKDIR /app
COPY services/auth-service/package*.json ./
COPY services/auth-service/prisma ./prisma/
RUN npm install && npx prisma generate && npm prune --production
COPY shared ./shared/
COPY services/auth-service/ .
EXPOSE 5001
CMD ["npm", "start"]
