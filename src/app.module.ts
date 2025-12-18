import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ScheduleModule.forRoot(), OrdersModule], //ativar scheduler no projeto, diz a app que aqui tera tarefas agendadas, sem isso o cron nao funciona. Ele cria um scheduler interno que permite registrar decorators como @cron, @interval, @timeout
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
