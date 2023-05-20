import { IConfig } from "config";

export interface ServerConfig {
  serverPort: number
}

export interface DatabaseConfig {
  database: string
  host: string
  port: number
  username: string
  password: string
}

export interface Environment {
  server: ServerConfig
  database: DatabaseConfig
}

export interface EnvironmentHandler {
  getEnvironment (config: IConfig): Environment
}