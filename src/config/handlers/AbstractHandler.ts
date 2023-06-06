import { IConfig } from "config";
import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";
import { exec } from "child_process";

export default abstract class AbstractHandler {
  protected config: IConfig
  private environment: Environment | null
  constructor(config: IConfig) {
    this.config = config
    this.environment = null
  }

  protected abstract getServer(): ServerConfig
  protected abstract getDatabase(): DatabaseConfig

  getEnvironment(): Environment {
    if (this.environment == null) {
      this.environment = {
        server: this.getServer(),
        database: this.getDatabase()
      }
    }
    return this.environment
  }

  runMigration() {
    process.env.DATABASE_URL = this.getDatabase().url
    exec(`npx prisma migrate deploy`, {
      env: process.env
    })
  }
}