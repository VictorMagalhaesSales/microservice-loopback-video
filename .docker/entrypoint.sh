#!/bin/bash

#CACHEAR nossa aplicação para acelerar os builds
npm config set cache /home/node/app/.npm-cache --global

cd /home/node/app
npm install
nodemon -L #npm start
