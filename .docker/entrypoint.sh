#!/bin/bash

#CACHEAR nossa aplicação para acelerar os builds
npm config set cache /home/node/app/.npm-cache --global

cd /home/node/app
npm install
ls
chmod +x /home/node/app/node_modules/.bin/lb-clean
chmod +x /home/node/app/node_modules/.bin/lb-tsc
nodemon -L #npm start
