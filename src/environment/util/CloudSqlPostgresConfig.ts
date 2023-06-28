import { DatabaseConfig } from "../handlers/IEnvironment";

export default class CloudSqlPostgresConfig implements DatabaseConfig {
  database: string;
  host = "localhost"
  port = 5432;
  username: string;
  password: string;
  instanceName: string;
  url: string;

  constructor(
    database: string,
    username: string,
    password: string,
    instanceName: string
  ) {
    this.database = database;
    this.username = username;
    this.password = password;
    this.instanceName = instanceName;
    this.url = this.buildUrl();
  }

  buildUrl(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}?host=/cloudsql/${this.instanceName}`;
  }
}