import app from "./app";
import EnvironmentResolver from "./environment/EnvironmentResolver";

console.log("Fetching environment");
const handler = EnvironmentResolver.getEnvironmentHandler()
const environment = EnvironmentResolver.getEnvironment();

console.log("Running prisma DB migrations");
handler.runMigration();

app.listen(environment.server.serverPort, () => {
  console.log(`App starting on port ${environment.server.serverPort}`);
  console.log(environment);
});
