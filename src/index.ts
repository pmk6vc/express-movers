import { buildApp } from "./app";
import EnvironmentResolver from "./environment/EnvironmentResolver";
import { Environment } from "./environment/handlers/IEnvironment";
import { Server } from "http";
import * as admin from "firebase-admin";
import DatabaseClient from "./db/DatabaseClient";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const main = async () => {
  console.log("Fetching environment");
  const environment = await EnvironmentResolver.getEnvironment();

  console.log("Fetching DB client from environment");
  const db = await DatabaseClient.getInstance(environment);

  console.log("Running migrations");
  await db.runMigrations();

  console.log("Configuring Express app");
  const app = buildApp(environment);

  console.log("Initializing Firebase admin");
  admin.initializeApp();

  console.log(`Starting app on port ${environment.server.serverPort}`);
  const server = app.listen(environment.server.serverPort, () => {
    console.log("App successfully started!");
  });

  process.on("SIGTERM", () => {
    shutDown(server, db);
  });
  process.on("SIGINT", () => {
    shutDown(server, db);
  });
};

const shutDown = async (server: Server, db: DatabaseClient) => {
  console.log("Received shutdown signal");
  console.log("Shutting down server...");
  server.close();
  console.log("Closing database pool...");
  await db.close();
  console.log("Exiting process...");
  process.exit(0);
};

main();
