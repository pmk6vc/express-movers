import { IConfig } from "config";
import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";

export default abstract class AbstractHandler {
  protected config: IConfig
  private environment: Environment | null
  constructor(config: IConfig) {
    this.config = config
    this.environment = null
  }

  protected abstract getServer(): ServerConfig
  protected abstract getDatabase(): DatabaseConfig
  abstract runMigration(): void

  getEnvironment(): Environment {
    if (this.environment == null) {
      this.environment = {
        server: this.getServer(),
        database: this.getDatabase()
      }
    }
    return this.environment
  }
}