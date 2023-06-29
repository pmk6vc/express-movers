import AbstractHandler from "./AbstractHandler";
import ISecretManager from "../util/ISecretManager";
import CloudSqlPostgresConfig from "../util/CloudSqlPostgresConfig";
import { exec } from "child_process";

interface CloudConfig {
  gcpProjectId: string;
  dbName: string;
  dbInstanceName: string;
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
    this.secretManager = secretManager;
  }

  protected async getServer() {
    return {
      serverPort: +process.env.PORT!,
    };
  }

  private getCloudConfig(): CloudConfig {
    if (this.cloudConfig == null) {
      this.cloudConfig = {
        gcpProjectId: process.env.GCP_PROJECT_ID!,
        dbName: process.env.DB_NAME!,
        dbInstanceName: process.env.DB_INSTANCE_NAME!,
        dbUsernameSecret: process.env.DB_USERNAME_SECRET!,
        dbUsernameSecretVersion: +process.env.DB_USERNAME_SECRET_VERSION!,
        dbPasswordSecret: process.env.DB_PASSWORD_SECRET!,
        dbPasswordSecretVersion: +process.env.DB_PASSWORD_SECRET_VERSION!,
      };
    }
    return this.cloudConfig;
  }

  protected async getDatabase() {
    const cloudConfig = this.getCloudConfig();
    if (this.dbConfig == undefined) {
      const [username, password] = await Promise.all([
        this.secretManager.getSecretValue(
          cloudConfig.gcpProjectId,
          cloudConfig.dbUsernameSecret,
          cloudConfig.dbUsernameSecretVersion
        ),
        this.secretManager.getSecretValue(
          cloudConfig.gcpProjectId,
          cloudConfig.dbPasswordSecret,
          cloudConfig.dbPasswordSecretVersion
        ),
      ]);
      this.dbConfig = new CloudSqlPostgresConfig(
        cloudConfig.dbName,
        username,
        password,
        cloudConfig.dbInstanceName
      );
    }
    return this.dbConfig;
  }

  async runMigration() {
    // TODO: Delete credentials from environment after migrations are run
    const env = await this.getEnvironment();
    process.env.DATABASE_URL = env.database.url;
    exec(`npx prisma migrate deploy`, {
      env: process.env,
    });
  }
}
