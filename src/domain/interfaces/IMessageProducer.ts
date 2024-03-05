export interface IMessageProducer {
  sendToTopic(
    topic: string,
    key: string,
    message: string,
  ): Promise<void | ErrorEventInit>;
}
