FROM node:18-alpine
WORKDIR /app
COPY services/booking-service/package*.json ./
COPY services/booking-service/prisma ./prisma/
RUN npm install && npx prisma generate && npm prune --production
COPY shared ./shared/
COPY services/booking-service/ .
EXPOSE 5003
CMD ["npm", "start"]
