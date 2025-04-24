import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { createLogger, format, Logger, transports } from 'winston';

type Level = 'info' | 'error' | 'debug';
@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      format: format.json(),
      transports: [new transports.Console()],
    });
  }
  debug(message: string, payload?: any): void {
    const logBody = this.formatLog('debug', message, payload);
    this.logger.debug(logBody);
  }
  info(message: string, payload?: any): void {
    const logBody = this.formatLog('info', message, payload);
    this.logger.info(logBody);
  }
  error(message: string, payload?: any): void {
    const logBody = this.formatLog('error', message, payload);
    this.logger.error(logBody);
  }

  private formatLog(level: Level, message: string, detail?: any) {
    return {
      timestamp: new Date().toISOString(),
      severity: level.toUpperCase(),
      message,
      detail,
      env: process.env.NODE_ENV,
    };
  }
}
