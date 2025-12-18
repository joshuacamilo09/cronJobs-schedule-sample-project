import { Injectable, Logger } from '@nestjs/common';
import { OrdersProducer } from './orders.producer';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(private readonly producer: OrdersProducer){} //o service tem de falar diretamente com o producer ao inves do rabbitmq


    //Dominio do negocio

    async findAndPublishExpiredOrders() {

        const expiredOrders = [
            { id: 'order-1', expiredAt: new Date() }, 
            { id: 'order-2', expiredAt: new Date() },
        ]; 

        for (const order of expiredOrders) { //loop de pedidos expirados, para cada pedido expirado, deve ser publicado a mensagem de expirado
            //é uma arquitetura orientada a eventos.
            this.logger.log(`Publishing expired order: ${order.id}`);
            await this.producer.publishExpiredOrder(order);
        }
    }
}
