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
  // TODO: Rather than returning the raw DB config, should return connection to DB instead
  database: DatabaseConfig;
}
