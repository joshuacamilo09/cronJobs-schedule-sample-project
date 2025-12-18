// orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersScheduler } from './orders.scheduler';
import { OrdersProducer } from './orders.producer';
import { OrdersConsumer } from './orders.consumer';

@Module({
  providers: [
    OrdersService,
    OrdersScheduler,
    OrdersProducer,
    OrdersConsumer,
  ],
})
export class OrdersModule {}