FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /usr/src/app
COPY *.json ./
COPY src ./src
RUN npm install --only=dev
RUN npm run build

FROM base AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
RUN npm i --production
COPY --from=builder /usr/src/app/dist/ ./dist/
CMD [ "node", "./dist/main" ]