FROM node:18-alpine
WORKDIR /app
COPY services/theme-service/package*.json ./
COPY services/theme-service/prisma ./prisma/
RUN npm install && npx prisma generate && npm prune --production
COPY shared ./shared/
COPY services/theme-service/ .
EXPOSE 5002
CMD ["npm", "start"]
