import { buildApp } from "./app";
import EnvironmentResolver from "./environment/EnvironmentResolver";
import { Environment } from "./environment/handlers/IEnvironment";
import { Server } from "http";
import * as admin from "firebase-admin";

const main = async () => {
  console.log("Fetching environment");
  const handler = EnvironmentResolver.getEnvironmentHandler();
  const environment = await EnvironmentResolver.getEnvironment();

  console.log("Running migrations");
  await handler.runUpMigrations();

  console.log("Configuring Express app");
  const app = buildApp(environment);

  console.log("Initializing Firebase admin");
  // TODO: I think you can just remove the firebase config before app initialization in production
  // TODO: Delete key in GCP
  // const firebaseConfig = {
  //   credential: admin.credential.cert("/Users/pmkulkarni/Downloads/key.json"),
  // };
  // admin.initializeApp(firebaseConfig);
  admin.initializeApp();

  console.log(`Starting app on port ${environment.server.serverPort}`);
  const server = app.listen(environment.server.serverPort, () => {
    console.log("App successfully started!");
  });

  process.on("SIGTERM", () => {
    shutDown(server, environment);
  });
  process.on("SIGINT", () => {
    shutDown(server, environment);
  });
};

const shutDown = async (server: Server, env: Environment) => {
  console.log("Received shutdown signal");
  console.log("Shutting down server...");
  server.close();
  console.log("Closing database pool...");
  await env.database.getDatabasePool().end();
  console.log("Exiting process...");
  process.exit(0);
};

main();
