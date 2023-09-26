FROM node:19

WORKDIR /app

COPY LICENSE ./

COPY tsconfig.json ./

COPY package.json ./

RUN npm i

COPY README.md ./

COPY ./locales ./locales

COPY ./lib ./lib

COPY index.ts ./

RUN /app/node_modules/typescript/bin/tsc

CMD ["node", "./dist/index.js"]
