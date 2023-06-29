import { DatabaseConfig } from "../handlers/IEnvironment";
import { Pool } from "pg";

export default class PostgresConfig implements DatabaseConfig {
  private readonly username: string;
  private readonly password: string;
  private readonly host: string;
  private readonly port: number;
  private readonly database: string;
  private databasePool?: Pool;

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