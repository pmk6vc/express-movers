import { IConfig } from "config";

export interface ServerConfig {
  serverPort: number;
}

export interface DatabaseConfig {
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  url: string;
}

export interface Environment {
  server: ServerConfig;
  database: DatabaseConfig;
}
