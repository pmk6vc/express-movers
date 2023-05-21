import { IConfig } from "config";
import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

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
    const prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: this.getEnvironment().database.url
        }
      }
    })
    execSync("npx prisma migrate deploy")
  }
}