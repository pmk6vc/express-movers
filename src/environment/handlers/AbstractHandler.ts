import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected dbConfig?: DatabaseConfig
  private environment?: Environment;
  constructor() {
    this.environment = undefined;
  }

  protected abstract getServer(): ServerConfig;
  protected abstract getDatabase(): DatabaseConfig;
  abstract runMigration(): void;

  getEnvironment(): Environment {
    if (this.environment == undefined) {
      this.environment = {
        server: this.getServer(),
        database: this.getDatabase(),
      };
    }
    return this.environment;
  }
}
