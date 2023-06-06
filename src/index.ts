import app from "./app";
import { handler } from "./config/ConfigFactory";
import environment from "./config/ConfigFactory";

console.log("Running prisma migrations from environment")
handler.runMigration()

app.listen(environment.server.serverPort, () => {
  console.log(`App starting on port ${environment.server.serverPort}`);
  console.log(environment);
});
