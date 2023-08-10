import { Pool } from "pg";

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
}
