import { DatabaseConfig, Environment, EnvironmentHandler, ServerConfig } from "./IEnvironment";
import { IConfig } from "config";

interface CloudConfig {
  gcpProjectId: string,
  dbConnectionName: string,
  dbUsernameSecret: string,
  dbUsernameSecretVersion: number,
  dbPasswordSecret: string,
  dbPasswordSecretVersion: number
}
export class ProductionHandler implements EnvironmentHandler {

  private getServer(): ServerConfig {
    return {
      serverPort: +(process.env.PORT!)
    }
  }

  private getCloudConfig(config: IConfig): CloudConfig {
    return {
      gcpProjectId: config.get('cloud.gcpProjectId'),
      dbConnectionName: config.get('cloud.dbConnectionName'),
      dbUsernameSecret: config.get('cloud.dbUsernameSecret'),
      dbUsernameSecretVersion: config.get('cloud.dbUsernameSecretVersion'),
      dbPasswordSecret: config.get('cloud.dbPasswordSecret'),
      dbPasswordSecretVersion: config.get('cloud.dbPasswordSecretVersion')
    }
  }

  private getDatabase(cloudConfig: CloudConfig): DatabaseConfig {
    // TODO: Use GCP secret manager to build properties here
    return {
      url: `${cloudConfig.gcpProjectId}://${cloudConfig.dbConnectionName}`,
      username: `sm://${cloudConfig.dbUsernameSecret}/${cloudConfig.dbUsernameSecretVersion}`,
      password: `sm://${cloudConfig.dbPasswordSecret}/${cloudConfig.dbPasswordSecretVersion}`
    }
  }
	getEnvironment(config: IConfig): Environment {
    return {
      server: this.getServer(),
      database: this.getDatabase(this.getCloudConfig(config))
    }
  }

}