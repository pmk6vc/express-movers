import { Pool } from "pg";
import { Logger } from "winston";

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
  projectId: string;
}
