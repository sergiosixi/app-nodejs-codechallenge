export interface SchemaRegistryService {
  decode<T>(message: Buffer): Promise<T>;
  encode(message: any, topic: string): Promise<Buffer>;
}
