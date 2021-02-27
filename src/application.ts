import {BootMixin} from '@loopback/boot';
import {Application, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestComponent, RestServer} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {Esv7DataSource} from './modules/elasticsearch/esv7.datasource';
import {RabbitmqServer} from './modules/rabbitmq/rabbitmq.server';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class MicroserviceLoopbackVideoApplication extends BootMixin(ServiceMixin(RepositoryMixin(Application))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Registrando server do Rabbitmq na aplicação
    this.server(RabbitmqServer);
    // Registrando o datasource do ElasticSearch
    this.dataSource(Esv7DataSource);

    this.options.rest.sequence = MySequence;
    this.component(RestComponent);
    const restServer = this.getSync<RestServer>('servers.RestServer');
    restServer.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
