import {RestServer} from '@loopback/rest';
import {ApplicationConfig, MicroserviceLoopbackVideoApplication} from './application';
import './bootstrap';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new MicroserviceLoopbackVideoApplication(options);
  await app.boot();
  await app.start();

  const restServer = app.getSync<RestServer>('servers.RestServer');
  const url = restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
    rabbitmq: {
      uri: process.env.RABBITMQ_URI,
      maxAttemptsDeadQueue: 1,
      exchanges: [
        {name: 'dlx.topic', type: 'topic'}
      ],
      // Teremos somente uma fila morta no sistema para os tipo 'topic'
      queues: [{
        name: 'dlx.queue.topic',
        options: {
          deadLetterExchange: 'amq.topic',
          messageTtl: 5000
        },
        exchangeBind: {
          name: 'dlx.topic', routingKey: 'micro.*.*'
        }
      }]
    }
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
