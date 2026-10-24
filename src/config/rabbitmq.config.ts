export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  exchange: process.env.ORDERS_EXCHANGE ?? 'orders.exchange.v1',
  queue: process.env.ORDERS_EXPIRED_QUEUE ?? 'orders.expired.queue.v1',
  routingKey: 'orders.expired',
};
