FROM node:12.14.0-alpine3.11

run apk add --no-cache bash

RUN touch /root/.bashrc | echo "PS1='w$ '" >> /root/.bashrc

RUN npm config set cache /home/node/app/.npm-cache --global

#Mais performático fazer a instalação do loopback aqui ao invés de ser no entrypoint
RUN npm install -g @loopback/cli
#Ouvir mudanças no código e rodar npm start automaticamente
RUN npm install -g nodemon

RUN mkdir -p /home/node/app
# Usuáriro já vem na imagem node; a partir de agora, para executar um apk add,
# por exemplo, será necessário especficiar um usuário root já que o padrão é
# node. Ex: docker exec -u root -it container_name apk add bash;
USER node
WORKDIR /home/node/app
