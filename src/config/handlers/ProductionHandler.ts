import { DatabaseConfig, ServerConfig } from "./IEnvironment";
import PostgresConfig from "../util/PostgresConfig";
import AbstractHandler from "./AbstractHandler";

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
    // TODO: Use GCP secret manager to build properties here
    return new PostgresConfig(
      this.getCloudConfig().dbName,
      this.getCloudConfig().dbIp,
      this.getCloudConfig().dbPort,
      `sm://${this.getCloudConfig().dbUsernameSecret}/${
        this.getCloudConfig().dbUsernameSecretVersion
      }`,
      `sm://${this.getCloudConfig().dbPasswordSecret}/${
        this.getCloudConfig().dbPasswordSecretVersion
      }`
    );
  }

  runMigration(): void {
    // TODO
  }
}
