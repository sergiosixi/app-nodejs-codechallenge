export interface EventService {
  publish(message: any, topic: string): Promise<void>;
}
