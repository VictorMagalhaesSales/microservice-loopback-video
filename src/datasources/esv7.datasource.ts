import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const elasticConfigConnector = {
  name: 'esv7',
  connector: 'esv6',
  index: 'catalog',
  apiVersion: '7',
  //defaultSize: '',
  configuration: {
    node: process.env.ELASTIC_SEARCH_HOST,
    requestTimeout: process.env.ELASTIC_SEARCH_HOST,
    pingTimeout: process.env.ELASTIC_SEARCH_PING_TIMEOUT
  },
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
  static readonly defaultConfig = elasticConfigConnector;

  constructor(
    @inject('datasources.config.esv7', {optional: true})
    dsConfig: object = elasticConfigConnector,
  ) {
    super(dsConfig);
  }

}
