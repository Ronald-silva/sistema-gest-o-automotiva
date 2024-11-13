// src/config/logger.ts
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  private level: number;

  constructor() {
    const currentLevel = process.env.LOG_LEVEL as LogLevel || 'info';
    this.level = logLevels[currentLevel];
  }

  private log(level: LogLevel, message: string, meta?: any) {
    if (logLevels[level] <= this.level) {
      const timestamp = new Date().toISOString();
      const logMessage = {
        timestamp,
        level,
        message,
        ...(meta && { meta }),
        environment: process.env.NODE_ENV
      };

      console.log(JSON.stringify(logMessage));
    }
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();