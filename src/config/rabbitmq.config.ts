export const rabbitmqConfig = {
  url: 'amqp://localhost:5672',
  exchange: 'orders.exchange.v1',
  queue: 'orders.expired.queue.v1',
  routingKey: 'orders.expired',
};
//Em producao isso viria de env vars 