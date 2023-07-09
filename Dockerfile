FROM node:19

WORKDIR /app

COPY LICENSE ./

COPY tsconfig.json ./

COPY tsconfig.build.json ./

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY README.md ./

COPY ./locales ./locales

COPY ./lib ./lib

COPY index.ts ./

RUN /app/node_modules/typescript/bin/tsc -p /app/tsconfig.build.json

CMD ["node", "./dist/index.js"]