import app from "./app";
import EnvironmentFactory from "./config/ConfigFactory";
import SecretManager from "./config/util/SecretManager";

console.log("Fetching environment");
const secretManager = new SecretManager();
const environmentFactory = new EnvironmentFactory(secretManager)
const handler = environmentFactory.getHandler()
const environment = environmentFactory.getEnvironment();

console.log("Running prisma DB migrations");
handler.runMigration();

app.listen(environment.server.serverPort, () => {
  console.log(`App starting on port ${environment.server.serverPort}`);
  console.log(environment);
});
