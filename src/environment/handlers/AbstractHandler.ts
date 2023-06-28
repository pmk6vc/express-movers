import { DatabaseConfig, Environment, ServerConfig } from "./IEnvironment";

export default abstract class AbstractHandler {
  protected serverConfig?: ServerConfig;
  protected dbConfig?: DatabaseConfig;
  private environment?: Environment;
  constructor() {
    this.environment = undefined;
  }

  protected abstract getServer(): Promise<ServerConfig>;
  protected abstract getDatabase(): Promise<DatabaseConfig>;
  abstract runMigration(): void;

  async getEnvironment() {
    if (this.environment == undefined) {
      const [serverConfig, databaseConfig] = await Promise.all([
        this.getServer(),
        this.getDatabase(),
      ]);
      this.environment = {
        server: serverConfig,
        database: databaseConfig,
      };
    }
    return this.environment;
  }
}
