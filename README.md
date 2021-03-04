
# Organização didática do projeto:
Para fins de estudos, foi separado uma pasta chamada [modules](https://github.com/VictorMagalhaesSales/microservice-loopback-video/tree/master/src/modules) contendo os modulos de **RabbitMQ** e **Elasticsearch** a fim de separar os arquivos criados para tais tecnologias e facilitar as futuras revisões de conteúdo.

### RabbitMQ
- Conexão com o Loopback feita através do **server** [RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts).
- A **criação das exchanges** é feita através do arquivo [index.ts](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/index.ts), na variável *config* que é passada para o método main() e posteriormente recuperadas em *[RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts):createExchanges()*.
- A **criação das queues** é feita através de decorator [rabbitmqSubscribe](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq-subscribe.decorator.ts) que são recuperados em *[RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts):searchMethodsWithDecorators()*, onde é feita a criação da queue, seu bind e a ligação do consumidor da queue com o método anotado para que este realize a operação requerida.

### Elasticsearch
- A aplicação se conecta com o elastic através do conceito de **conectores** do Loopback. Estamos utilizando um conector de elastic(loopback-connector-es) para criar um **DataSource** na nossa aplicação([Esv7DataSource](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/elasticsearch/esv7.datasource.ts)) que define as configurações de conexão;

## Comandos básicos
```sh
# Iniciar aplicações com Docker Compose:
docker-compose up

# Instalar dependências:
npm install

# Rodar aplicação:
npm start

# Buildar aplicação:
npm run build

# Style code:
npm run lint

# Executar migrations do DB:
npm run migrate
```
Você também pode rodar `node .` para pular o passo de build.
Abra http://127.0.0.1:3000 no seu navegador.

Essa aplicação foi feita utilizando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) com o
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).
