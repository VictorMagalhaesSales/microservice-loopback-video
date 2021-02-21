import {Context, Server} from '@loopback/core';
import {connect, Connection} from 'amqplib';


export class RabbitmqServer extends Context implements Server {
  listening: boolean;
  conn: Connection;

  async start(): Promise<void> {
    /*
    * Lib AMQP instalada para se trabalhar com protocolo AMPQ com Node.
    * Rabbitmq utiliza esse protocolo.
    */
    this.conn = await connect({
      hostname: 'rabbitmq',
      username: 'admin',
      password: 'admin'
    });
    this.listening = true;
    return undefined;
  }

  async stop(): Promise<void> {
    this.listening = false;
    return undefined;
  }

}
