# Organização didática do projeto:
![Docker](https://img.shields.io/badge/-Docker-blue?style=flat-square&logo=Docker&logoColor=white)
![LoopBack(NodeJS)](https://img.shields.io/badge/-LoopBack-blue?style=flat-square)
![Elasticsearch](https://img.shields.io/badge/-Elasticsearch-red?style=flat-square&logo=elasticsearch)
![Kibana](https://img.shields.io/badge/-Kibana-blue?style=flat-square&logo=kibana&color=005571)
![RabbitMQ](https://img.shields.io/badge/-RabbitMQ-white?style=flat-square&logo=RabbitMQ)

Para fins de estudos, foi separado uma pasta chamada [modules](https://github.com/VictorMagalhaesSales/microservice-loopback-video/tree/master/src/modules) contendo os modulos de **RabbitMQ** e **Elasticsearch** a fim de separar os arquivos criados para tais tecnologias e facilitar as futuras revisões de conteúdo.

### RabbitMQ
- Conexão com o Loopback feita através do **server** [RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts).
- A **criação das exchanges** é feita através do arquivo [index.ts](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/index.ts), na variável *config* que é passada para o método main() e posteriormente recuperadas em *[RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts):createExchanges()*.
- A **criação das queues** é feita através de decorator [@rabbitmqSubscribe](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq-subscribe.decorator.ts) que são recuperados em *[RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts):searchMethodsWithDecorators()*, onde é feita a criação da queue, seu bind e a ligação do consumidor da queue com o método anotado para que este realize a operação requerida.
- A **Dead Letter Queue** é criada através do [index.ts](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/index.ts) com a exchange **dlx.topic** e a queue **dlx.queue.topic** que receberão todas as rejeições de mensagens das queues ligadas à exchange topic. Essa "camada morta" é recuperada e criada em *[RabbitmqServer](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq.server.ts):createQueues()*. A ligação das queues com a exchange **dlx.topic** é feita também no decorator [@rabbitmqSubscribe](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/rabbitmq/rabbitmq-subscribe.decorator.ts).

### Elasticsearch
- A aplicação se conecta com o elastic através do conceito de **conectores** do Loopback. Estamos utilizando um conector de elastic(loopback-connector-es) para criar um **DataSource** na nossa aplicação([Esv7DataSource](https://github.com/VictorMagalhaesSales/microservice-loopback-video/blob/master/src/modules/elasticsearch/esv7.datasource.ts)) que define as configurações de conexão;

### Docker Compose
- Aplicação: http://localhost:3001/
- Elasticsearch: http://localhost:9200/
- Kibana: http://localhost:5601/
- RabbitMQ: http://localhost:15672/

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

Essa aplicação foi feita utilizando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) com o
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).
