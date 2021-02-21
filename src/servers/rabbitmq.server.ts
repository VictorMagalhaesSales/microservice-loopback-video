import {Context, Server} from '@loopback/core';

export class RabbitmqServer extends Context implements Server {
  listening: boolean;

  async start(): Promise<void> {
    console.log('Starting RabbitmqServer...')
    return undefined;
  }

  async stop(): Promise<void> {
    return undefined;
  }
}
