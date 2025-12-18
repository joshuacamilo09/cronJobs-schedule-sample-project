import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqplib';
import { rabbitmqConfig } from "src/config/rabbitmq.config";

@Injectable()                           //roda quando o nest termina de criar um modulo, antes de qualque cron, antes de qualquer publish
export class OrdersProducer implements OnModuleInit {

    private channel: amqp.Channel;

    private readonly logger = new Logger(OrdersProducer.name);

    async onModuleInit() {

        //conexão com o rabbitmq
        const connection = await amqp.connect(rabbitmqConfig.url); 
        this.channel = await connection.createChannel();

        await this.channel.assertExchange( //decide para onde as mensagens vão baseado em routing key
            rabbitmqConfig.exchange,
            'topic',
            { durable: true } // Exchange will be deleted when the last consumer unsubscribes
        )
    }; 

    async publishExpiredOrder(order: any) {
        const payload = Buffer.from(JSON.stringify(order));

        this.channel.publish( //pedido expirado vira evento, evento vira mensagem e entra no broker, producer nunsa sabe quem vai consumir.
            rabbitmqConfig.exchange,
            rabbitmqConfig.routingKey,
            payload,
            {persistent: true} //A mensagem sobrevivera
        );

        this.logger.log(`Message publihed: ${order.id}`);
    }
}