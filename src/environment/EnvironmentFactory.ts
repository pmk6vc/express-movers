import AbstractHandler from "./handlers/AbstractHandler";
import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { LocalDockerComposeHandler } from "./handlers/LocalDockerComposeHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";

export default class EnvironmentFactory {
  private static configMap: Map<string, AbstractHandler> = new Map<
    string,
    AbstractHandler
  >([
    ["local-dev", LocalDevHandler.getInstance()],
    ["local-docker-compose", LocalDockerComposeHandler.getInstance()],
    ["production", ProductionHandler.getInstance()],
  ]);

  static getHandler(): AbstractHandler {
    return EnvironmentFactory.configMap.get(
      process.env.NODE_CONFIG_ENV || "local-dev",
    )!;
  }
}
