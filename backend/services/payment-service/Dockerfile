FROM node:18-alpine
WORKDIR /app
COPY services/payment-service/package*.json ./
COPY services/payment-service/prisma ./prisma/
RUN npm install && npx prisma generate && npm prune --production
COPY shared ./shared/
COPY services/payment-service/ .
EXPOSE 5004
CMD ["npm", "start"]
