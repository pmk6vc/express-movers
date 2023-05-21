import {
  DatabaseConfig,
  Environment,
  ServerConfig,
} from "./IEnvironment";
import { IConfig } from "config";
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

  private cloudConfig: CloudConfig | null
  constructor(config: IConfig) {
    super(config);
    this.cloudConfig = null
  }
  protected getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getCloudConfig(): CloudConfig {
    if (this.cloudConfig == null) {
      this.cloudConfig = {
        gcpProjectId: this.config.get("cloud.gcpProjectId"),
        dbIp: this.config.get("cloud.databaseIp"),
        dbPort: this.config.get("cloud.databasePort"),
        dbName: this.config.get("cloud.databaseName"),
        dbUsernameSecret: this.config.get("cloud.dbUsernameSecret"),
        dbUsernameSecretVersion: this.config.get("cloud.dbUsernameSecretVersion"),
        dbPasswordSecret: this.config.get("cloud.dbPasswordSecret"),
        dbPasswordSecretVersion: this.config.get("cloud.dbPasswordSecretVersion"),
      }
    }
    return this.cloudConfig
  }

  protected getDatabase(): DatabaseConfig {
    // TODO: Use GCP secret manager to build properties here
    return new PostgresConfig(
      this.getCloudConfig().dbName,
      this.getCloudConfig().dbIp,
      this.getCloudConfig().dbPort,
      `sm://${this.getCloudConfig().dbUsernameSecret}/${this.getCloudConfig().dbUsernameSecretVersion}`,
      `sm://${this.getCloudConfig().dbPasswordSecret}/${this.getCloudConfig().dbPasswordSecretVersion}`
    );
  }
  getEnvironment(): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(),
    };
  }
}
