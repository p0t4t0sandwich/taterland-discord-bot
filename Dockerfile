FROM oven/bun

WORKDIR /app

COPY LICENSE ./

COPY tsconfig.json ./

COPY package.json ./

RUN bun i

COPY README.md ./

COPY ./locales ./locales

COPY ./lib ./lib

COPY index.ts ./

RUN bun tsc

CMD ["bun", "./dist/index.js"]
