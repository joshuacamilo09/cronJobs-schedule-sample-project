# Scheduled Jobs with RabbitMQ (NestJS)

A small event-driven service that shows how to split **scheduled work** from **heavy processing**: a cron job finds expired orders and publishes an event per order to RabbitMQ, and a consumer processes those events independently.

The pattern keeps the scheduler fast and stateless, lets the processing scale horizontally (more consumers), and means a failure while processing one order doesn't stop the job.

## How it works

```
 ┌────────────────────┐   every minute   ┌───────────────┐  publish   ┌───────────────────────────┐
 │ OrdersScheduler    │ ───────────────▶ │ OrdersService │ ─────────▶ │ OrdersProducer            │
 │ @Cron('*/1 * * * *')│                  │ find expired  │            │ exchange: orders.exchange │
 └────────────────────┘                  └───────────────┘            │ (topic, durable)          │
                                                                       └─────────────┬─────────────┘
                                                                routing key          │
                                                                "orders.expired"     ▼
                                                                       ┌───────────────────────────┐
                                                                       │ queue: orders.expired     │
                                                                       │ (durable)                 │
                                                                       └─────────────┬─────────────┘
                                                                                     ▼
                                                                       ┌───────────────────────────┐
                                                                       │ OrdersConsumer            │
                                                                       │ process → ack             │
                                                                       └───────────────────────────┘
```

| Component | Responsibility |
|---|---|
| `OrdersScheduler` | Cron trigger only: no business logic, so it never blocks |
| `OrdersService` | Domain logic: finds expired orders (mocked here) and publishes one event per order |
| `OrdersProducer` | Owns the AMQP channel, declares the **topic exchange**, publishes **persistent** messages |
| `OrdersConsumer` | Declares and binds the **durable queue**, consumes and **acks** each message after processing |

Design choices:

- **Topic exchange + routing key** (`orders.expired`): new consumers (emails, analytics, etc.) can subscribe to the same event without changing the producer.
- **Durable exchange/queue + persistent messages**: events survive a broker restart.
- **Manual ack**: a message is only removed from the queue after it has been processed.
- **Versioned names** (`*.v1`): the message contract can evolve without breaking existing consumers.

## Running locally

Requirements: Node.js 20+ and Docker.

```bash
docker compose up -d     # RabbitMQ on :5672, management UI on http://localhost:15672 (guest/guest)
npm install
npm run start:dev
```

The logs show the job running every minute, the events being published and the consumer processing them. In the management UI you can see the exchange, the queue and the message rates.

| Variable | Default |
|---|---|
| `RABBITMQ_URL` | `amqp://localhost:5672` |
| `ORDERS_EXCHANGE` | `orders.exchange.v1` |
| `ORDERS_EXPIRED_QUEUE` | `orders.expired.queue.v1` |

Notes on cron vs schedulers vs queues are in [`docs/scheduling-notes.md`](docs/scheduling-notes.md).

## Tech stack

TypeScript · NestJS 11 · @nestjs/schedule · RabbitMQ (amqplib) · Docker Compose
