import app from "./app";
import EnvironmentResolver from "./environment/EnvironmentResolver";

const main = async () => {
  console.log("Fetching environment");
  const handler = EnvironmentResolver.getEnvironmentHandler();
  const environment = await EnvironmentResolver.getEnvironment();

  console.log("Running prisma DB migrations");
  await handler.runMigration();

  console.log(`Starting app on port ${environment.server.serverPort}`);
  app.listen(environment.server.serverPort, () => {
    console.log("App successfully started!");
    console.log(environment);
  });
};

main();
