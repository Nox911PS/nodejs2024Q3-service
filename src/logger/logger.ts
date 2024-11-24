import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  statSync,
  renameSync,
  appendFileSync,
} from 'node:fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logDir: string;
  private readonly logFile: string;
  private readonly pathToLogFile: string;
  private readonly logMaxSize: number;
  private readonly logLevel: LogLevel[];

  constructor(private _configService: ConfigService) {
    this.logLevel = this._mapLogLevel(this._configService.get('logLevel'));
    this.logMaxSize = this._configService.get('logMaxSize') * 1024;
    this.logDir = this._configService.get('logDir');
    this.logFile = this._configService.get('logFile');
    this.pathToLogFile = path.join(this.logDir, this.logFile);

    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir);
    }

    this._rotateLogs();
  }

  log(message: string) {
    this._writeLog('log', `[LOG]: ${this._getTimestamp()} ${message}`);
  }

  error(message: string, trace?: string) {
    this._writeLog(
      'error',
      `[ERROR]: ${this._getTimestamp()} ${message}\nTrace: ${trace ?? ''}`,
    );
  }

  warn(message: string) {
    this._writeLog('warn', `[WARN]: ${this._getTimestamp()} ${message}`);
  }

  debug(message: string) {
    this._writeLog('debug', `[DEBUG]: ${this._getTimestamp()} ${message}`);
  }

  verbose(message: string) {
    this._writeLog('verbose', `[VERBOSE]: ${this._getTimestamp()} ${message}`);
  }

  private _mapLogLevel(logLevel: string): LogLevel[] {
    const levels: Record<string, LogLevel[]> = {
      0: ['error'],
      1: ['error', 'warn'],
      2: ['error', 'warn', 'log'],
      3: ['error', 'warn', 'log', 'debug'],
      4: ['error', 'warn', 'log', 'debug', 'verbose'],
    };

    return levels[logLevel];
  }

  private _rotateLogs() {
    if (existsSync(this.pathToLogFile)) {
      const stats = statSync(this.pathToLogFile);
      if (stats.size > this.logMaxSize) {
        const [fileName, ext] = this.logFile.split('.');
        const rotatedLogFile = path.join(
          this.logDir,
          `${fileName}-${Date.now()}.${ext}`,
        );
        renameSync(this.pathToLogFile, rotatedLogFile);
      }
    }
  }

  private _writeLog(level: LogLevel, message: string) {
    if (this.logLevel.includes(level)) {
      this._rotateLogs();
      appendFileSync(this.pathToLogFile, `${message}\n`);
      console[level](message);
    }
  }

  private _getTimestamp() {
    return new Date().toString();
  }
}
