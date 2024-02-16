import { IMessageProducer } from '../../../domain/interfaces/IMessageProducer';
import kafka from './config';

export class KafkaMessageProducer implements IMessageProducer {
  constructor(private producer = kafka.producer()) {
    this.producer.connect();
  }

  async sendToTopic(
    topic: string,
    key: string,
    message: string,
  ): Promise<void | Error> {
    const kafkaMessage = {
      key: key,
      value: message,
    };

    try {
      await this.producer.send({
        topic: topic,
        messages: [kafkaMessage],
      });
    } catch (error) {
      return new Error(`Failed to send message to Kafka: ${error}`);
    }
  }
}
