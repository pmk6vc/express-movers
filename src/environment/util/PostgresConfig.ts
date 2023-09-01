import { Pool } from "pg";
import { DatabaseConfig } from "../handlers/IEnvironment";

export default class PostgresConfig implements DatabaseConfig {
  protected readonly username: string;
  protected readonly password: string;
  protected readonly host: string;
  protected readonly port: number;
  protected readonly database: string;
  protected databasePool?: Pool;

  constructor(
    username: string,
    password: string,
    host: string,
    port: number,
    database: string
  ) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.port = port;
    this.database = database;
  }

  getDatabasePool() {
    if (this.databasePool == undefined) {
      this.databasePool = new Pool({
        user: this.username,
        host: this.host,
        database: this.database,
        password: this.password,
        port: this.port,
      });
    }
    return this.databasePool;
  }

  getConnectionString() {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  }
}
