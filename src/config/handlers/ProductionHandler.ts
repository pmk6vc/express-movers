import {
  DatabaseConfig,
  Environment,
  EnvironmentHandler,
  ServerConfig,
} from "./IEnvironment";
import { IConfig } from "config";

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
export class ProductionHandler implements EnvironmentHandler {
  private getServer(): ServerConfig {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getCloudConfig(config: IConfig): CloudConfig {
    return {
      gcpProjectId: config.get("cloud.gcpProjectId"),
      dbIp: config.get("cloud.databaseIp"),
      dbPort: config.get("cloud.databasePort"),
      dbName: config.get("cloud.databaseName"),
      dbUsernameSecret: config.get("cloud.dbUsernameSecret"),
      dbUsernameSecretVersion: config.get("cloud.dbUsernameSecretVersion"),
      dbPasswordSecret: config.get("cloud.dbPasswordSecret"),
      dbPasswordSecretVersion: config.get("cloud.dbPasswordSecretVersion"),
    };
  }

  private getDatabase(cloudConfig: CloudConfig): DatabaseConfig {
    // TODO: Use GCP secret manager to build properties here
    return {
      database: cloudConfig.dbName,
      host: cloudConfig.dbIp,
      port: cloudConfig.dbPort,
      username: `sm://${cloudConfig.dbUsernameSecret}/${cloudConfig.dbUsernameSecretVersion}`,
      password: `sm://${cloudConfig.dbPasswordSecret}/${cloudConfig.dbPasswordSecretVersion}`,
    };
  }
  getEnvironment(config: IConfig): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(this.getCloudConfig(config)),
    };
  }
}
