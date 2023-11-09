import { LoggingWinston } from "@google-cloud/logging-winston";
import { Pool } from "pg";
import { Logger, createLogger, transports } from "winston";

const loggingWinston = new LoggingWinston();
const logger = createLogger({
  level: "info",
  transports: [new transports.Console(), loggingWinston],
});

export interface ServerConfig {
  serverPort: number;
}

export interface DatabaseConfig {
  getDatabasePool(): Pool;
  getConnectionString(): string;
}

export interface Environment {
  server: ServerConfig;
  database: DatabaseConfig;
  logger: Logger;
}
