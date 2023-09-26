# FROM oven/bun
FROM oven/bun

WORKDIR /app

COPY LICENSE ./

COPY tsconfig.json ./

COPY package.json ./

# RUN bun i
RUN npm i

COPY README.md ./

COPY ./locales ./locales

COPY ./lib ./lib

COPY index.ts ./

RUN /app/node_modules/typescript/bin/tsc

# CMD ["bun", "run", "./index.ts"]
CMD ["node", "./dist/index.js"]
