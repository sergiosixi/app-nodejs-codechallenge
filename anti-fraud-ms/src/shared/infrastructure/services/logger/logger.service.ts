export interface LoggerService {
  debug(message: string, payload?: any): void;
  info(message: string, payload?: any): void;
  error(message: string, payload?: any): void;
}
