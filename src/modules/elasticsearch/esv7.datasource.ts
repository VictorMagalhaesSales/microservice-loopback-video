import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'esv7',
  connector: 'es',
  index: 'catalog',
  apiVersion: '5.0',
  hosts: [
    {
      protocol: 'http',
      host: 'elasticsearch',
      port: 9200
    }
  ],
  mappingProperties: {
    docType: {
      type: "keyword"
    },
    id: {
      type: "long"
    },
    name: {
      type: "text",
      fields: {
        keyword: {
          type: "keyword",
          ignore_above: 256
        }
      }
    }
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class Esv7DataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'esv7';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.esv7', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

}
