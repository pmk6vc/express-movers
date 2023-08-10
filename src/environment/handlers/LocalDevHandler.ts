import AbstractHandler from "./AbstractHandler";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import PostgresConfig from "../util/PostgresConfig";

export class LocalDevHandler extends AbstractHandler {
  protected override async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
      const container = await new PostgreSqlContainer().start();
      this.databaseConfig = new PostgresConfig(
        container.getUsername(),
        container.getPassword(),
        container.getHost(),
        container.getPort(),
        container.getDatabase()
      );
    }
    return this.databaseConfig;
  }
  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the local dev handler migration!");
  }
}
