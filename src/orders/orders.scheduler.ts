import { Injectable, Logger } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class OrdersScheduler { 
    private readonly logger = new Logger(OrdersScheduler.name); 

    constructor(private readonly order: OrdersService){}

    @Cron('*/1 * * * *') //executa a função a cada 1 minutos, indepentende da request e de usuarios online.
    async handleExpiredJob() { //roda automaticamente com base no tempo. Apenas dispara o processo.
        this.logger.log('Running close expired orders job');
        await this.order.findAndPublishExpiredOrders();
    }
}