import AbstractHandler from "./AbstractHandler";
import { exec } from "child_process";
import CloudSqlPostgresConfig from "../util/CloudSqlPostgresConfig";

export class ProductionHandler extends AbstractHandler {

  protected async getDatabaseConfig() {
    if (this.databaseConfig == undefined) {
      this.databaseConfig = new CloudSqlPostgresConfig(
        process.env.DB_USERNAME!,
        process.env.DB_PASSWORD!,
        process.env.DB_HOST!,
        +process.env.DB_PORT!,
        process.env.DB_NAME!
      );
    }
    return this.databaseConfig;
  }
  async runMigration() {
    // const env = await this.getEnvironment();
    // process.env.DATABASE_URL = env.database.getConnectionString();
    // console.log(`Running migrate command with this DATABASE_URL: ${process.env.DATABASE_URL}`);
    // await exec(`prisma migrate deploy`, {
    //   env: process.env,
    // });

    console.log("Using hard-coded values in migration instead for now")
    await exec('prisma migrate deploy')
  }
}
