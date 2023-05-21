import app from "./app";
import environment from "./config/ConfigFactory";

app.listen(environment.server.serverPort, () => {
  console.log(`App starting on port ${environment.server.serverPort}`);
  console.log(environment);
});
