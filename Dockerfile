FROM node:19

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./dist/index.js ./

CMD ["node", "./index.js"]
