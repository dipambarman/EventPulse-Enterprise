FROM node:18-alpine
WORKDIR /app
COPY services/notification-service/package*.json ./
RUN npm install --production
COPY shared ./shared/
COPY services/notification-service/ .
EXPOSE 5005
CMD ["npm", "start"]
