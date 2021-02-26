# microservice-loopback-video

Essa aplicação foi feita utilizando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) com o
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Comandos básicos

Iniciar aplicações com Docker Compose:
```sh
docker-compose up
```
Instalar dependências:
```sh
npm install
```
Rodar aplicação:
```sh
npm start
```
Buildar aplicação:
```sh
npm run build
```
Style code:
```sh
npm run lint
```
Executar migrations do DB:
```sh
 npm run migrate
```
Você também pode rodar `node .` para pular o passo de build.
Abra http://127.0.0.1:3000 no seu navegador.


## Organização do projeto:

Para fins de estudos, foi separado uma pasta chamada `modules` contendo os modulos de RabbitMQ e Elasticsearch a fim de separar os arquivos criados para tais tecnologias e facilitar as futuras revisões de conteúdo.
