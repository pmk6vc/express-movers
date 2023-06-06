import { Environment } from "./handlers/IEnvironment";
import config from "config";
import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";
import AbstractHandler from "./handlers/AbstractHandler";

class EnvironmentFactory {
  private static configMap = new Map<string, AbstractHandler>([
    ["local-dev", new LocalDevHandler(config)],
    ["production", new ProductionHandler(config)],
  ]);

  static getHandler(): AbstractHandler {
    return this.configMap.get(process.env.NODE_CONFIG_ENV || "local-dev")!;
  }

  // TODO: Can mock this method call out with Jest during testing to return a test Environment instance instead
  static getEnvironment(): Environment {
    return this.getHandler().getEnvironment();
  }
}

// TODO: This feels a little redundant
const environment = EnvironmentFactory.getEnvironment();
export const handler = EnvironmentFactory.getHandler();
export default environment;
