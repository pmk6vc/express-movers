import app from "./app";
import { EnvironmentFactory } from "./config/ConfigFactory";

const environment = EnvironmentFactory.getEnvironment()

app.listen(environment.server.serverPort, () => {
	console.log(`App starting on port ${environment.server.serverPort}`);
	console.log(environment)
	console.log(__dirname)
});