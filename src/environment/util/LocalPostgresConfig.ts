import { DatabaseConfig } from "../handlers/IEnvironment";

export default class LocalPostgresConfig implements DatabaseConfig {
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  url: string;

  constructor(
    database: string,
    host: string,
    port: number,
    username: string,
    password: string
  ) {
    this.database = database;
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.url = this.buildUrl();
  }

  buildUrl(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  }
}