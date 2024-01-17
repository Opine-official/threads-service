import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'threads-service',
  brokers: ['kafka:9092'],
});

export default kafka;
