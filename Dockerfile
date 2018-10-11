FROM node:9-alpine

WORKDIR /app
COPY . /app

RUN npm install --unsafe-perm

CMD ["npm", "start"]
EXPOSE 3000
