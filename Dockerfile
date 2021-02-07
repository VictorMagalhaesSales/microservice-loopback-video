FROM node:12.14.0-alpine3.11

run apk add --no-cache bash

#Mais performático fazer a instalação do loopback aqui ao invés de ser no entrypoint
RUN npm install -g @loopback/cli

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
