import { Log, Logging } from "@google-cloud/logging";
import { Pool } from "pg";

const loggingClient = new Logging();
const log = loggingClient.log("some-log");

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
  log: Log;
}
