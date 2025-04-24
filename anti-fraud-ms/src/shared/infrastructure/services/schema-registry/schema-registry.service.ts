export interface SchemaRegistryService {
  decode<T>(message: Buffer): Promise<T>;
  encode(message: Buffer, topic: string): Promise<Buffer>;
}
