import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqplib';
import { rabbitmqConfig } from "src/config/rabbitmq.config";
@Injectable()
export class OrdersConsumer implements OnModuleInit {   

    private readonly logger = new Logger(OrdersConsumer.name)

    async onModuleInit() {
        const connection = await amqp.connect(rabbitmqConfig.url);
        const channel = await connection.createChannel(); 

        await channel.assertExchange(
            rabbitmqConfig.exchange,
            'topic',
            { durable: true } // Exchange will be deleted when the last consumer unsubscribes
        );

        const queue = await channel.assertQueue(
            rabbitmqConfig.queue,
            { durable: true } // Queue will be deleted when the last consumer unsubscribes
        ); 

        await channel.bindQueue( //vai ligar a queue ao exchange
            queue.queue,
            rabbitmqConfig.exchange,
            rabbitmqConfig.routingKey
        ); 

        channel.consume( //escuta a fila, processa mensagens, pode falhar e pode retry
            queue.queue,
            async (msg) => {
                if (!msg) {
                    return;
                } else {
                    const content = JSON.parse(msg.content.toString());
                    this.logger.log(`Order expired: ${content.id}`);

                    //aqui entra logica pesada como: 
                    //atualizar DB
                    //chamar outros serviços 
                    //enviar emails 

                    channel.ack(msg); //confirmacao de mensagem processada.
                }
            }
        )
    }
}