import PostgresConfig from "./PostgresConfig";

export default class CloudSqlPostgresConfig extends PostgresConfig {

  getConnectionString(): string {
    return `postgresql://${this.username}:${this.password}@localhost/${this.database}?host=${this.host}`;
  }

}