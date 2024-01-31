import {
  createLogger,
  format,
  transports,
  LogEntry,
  Logger as LoggerInstance,
} from "winston";
import { inspect } from "util";
import { isObject } from "./utils";
export { LoggerInstance };
export interface Loggers {
  [key: string]: LoggerInstance;
}
export const loggers: Loggers = {};
export const logger = (label: string): LoggerInstance => {
  const formatMessage = ({
    timestamp,
    level,
    label: logLabel,
    message,
    stack,
  }: LogEntry) =>
    stack
      ? `${timestamp} - ${level}: [${logLabel}] ${stack}`
      : `${timestamp} - ${level}: [${logLabel}] ${
          isObject(message)
            ? // Used pretty-print implementation from winston as it was printing extra informations like level, label, timestamp etc.
              `\n${inspect(message, { depth: null, colors: true })}`
            : message
        }`;
  const devFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.label({ label }),
    format.printf((info) => formatMessage(info))
  );
  const prodFormat = format.combine(
    format.timestamp(),
    format.label({ label }),
    format.printf((info) => formatMessage(info))
  );
  if (!loggers[label]) {
    const winstonLogger = createLogger({
      // To preserve message of type Error
      format: format.errors({ stack: true }),
      transports: [
        new transports.Console({
          format:
            process.env.NODE_ENV === "development" ? devFormat : prodFormat,
          // Do not print log during tests for better readability of errors
          silent: process.env.NODE_ENV === "test",
          level:
            process.env.DEBUG === "true" || process.env.DEBUG === "TRUE"
              ? "silly"
              : "info",
        }),
      ],
    });
    loggers[label] = winstonLogger;
  }
  return loggers[label];
};
