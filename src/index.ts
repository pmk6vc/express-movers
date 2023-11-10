import * as admin from "firebase-admin";
import { Server } from "http";
import { Logger } from "winston";
import { buildApp } from "./app";
import DatabaseClient from "./db/DatabaseClient";
import EnvironmentFactory from "./environment/EnvironmentFactory";

const main = async () => {
  const environment = await EnvironmentFactory.getHandler().getEnvironment();
  const logger = environment.logger;

  logger.info("Fetching DB client from environment");
  const db = DatabaseClient.getInstance(environment);

  logger.info("Running migrations");
  await db.runMigrations();

  logger.info("Configuring Express app");
  const app = await buildApp(db, logger);

  logger.info("Initializing Firebase admin");
  admin.initializeApp();

  logger.info(`Starting app on port ${environment.server.serverPort}`);
  const server = app.listen(environment.server.serverPort, () => {
    logger.info("App successfully started!");
  });

  process.on("SIGTERM", () => {
    shutDown(server, db, logger);
  });
  process.on("SIGINT", () => {
    shutDown(server, db, logger);
  });
};

const shutDown = async (server: Server, db: DatabaseClient, logger: Logger) => {
  logger.info("Received shutdown signal");
  logger.info("Shutting down server...");
  server.close();
  logger.info("Closing database pool...");
  await db.close();
  logger.info("Exiting process...");
  process.exit(0);
};

main();
