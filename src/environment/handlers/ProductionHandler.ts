import { DatabaseConfig, ServerConfig } from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";
import ISecretManager from "../util/ISecretManager";

interface CloudConfig {
  gcpProjectId: string;
  dbIp: string;
  dbPort: number;
  dbName: string;
  dbUsernameSecret: string;
  dbUsernameSecretVersion: number;
  dbPasswordSecret: string;
  dbPasswordSecretVersion: number;
}
export class ProductionHandler extends AbstractHandler {
  private cloudConfig: CloudConfig | null = null;
  private secretManager: ISecretManager;

  constructor(secretManager: ISecretManager) {
    super();
    this.secretManager = secretManager
  }

  protected getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getCloudConfig(): CloudConfig {
    if (this.cloudConfig == null) {
      this.cloudConfig = {
        gcpProjectId: process.env.GCP_PROJECT_ID!,
        dbIp: process.env.DB_IP!,
        dbPort: +process.env.DP_PORT!,
        dbName: process.env.DB_NAME!,
        dbUsernameSecret: process.env.DB_USERNAME_SECRET!,
        dbUsernameSecretVersion: +process.env.DB_USERNAME_SECRET_VERSION!,
        dbPasswordSecret: process.env.DB_PASSWORD_SECRET!,
        dbPasswordSecretVersion: +process.env.DB_PASSWORD_SECRET_VERSION!,
      };
    }
    return this.cloudConfig;
  }

  protected getDatabase(): DatabaseConfig {
    // TODO: Figure out how to introspect returned promises
    const cloudConfig = this.getCloudConfig();
    if (this.dbConfig == undefined) {
      const username = this.secretManager.getSecretValue(
        cloudConfig.gcpProjectId,
        cloudConfig.dbUsernameSecret,
        cloudConfig.dbUsernameSecretVersion
      )
      const password = this.secretManager.getSecretValue(
        cloudConfig.gcpProjectId,
        cloudConfig.dbPasswordSecret,
        cloudConfig.dbPasswordSecretVersion
      )
      this.dbConfig = new PostgresConfig(
        cloudConfig.dbName,
        cloudConfig.dbIp,
        cloudConfig.dbPort,
        "",
        ""
      )
    }
    return this.dbConfig
  }

  runMigration(): void {
    // TODO
  }
}
