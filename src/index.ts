import app from "./app";
import handler from "./config/ConfigFactory";

console.log("Fetching environment from handler")
const environment = handler.getEnvironment()

console.log("Running prisma DB migrations")
handler.runMigration()

app.listen(environment.server.serverPort, () => {
  console.log(`App starting on port ${environment.server.serverPort}`);
  console.log(environment);
});
