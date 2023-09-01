import AbstractHandler from "./handlers/AbstractHandler";
import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { LocalDockerComposeHandler } from "./handlers/LocalDockerComposeHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";

export default class EnvironmentFactory {
  private configMap: Map<string, AbstractHandler>;
  constructor() {
    this.configMap = new Map<string, AbstractHandler>([
      ["local-dev", new LocalDevHandler()],
      ["local-docker-compose", new LocalDockerComposeHandler()],
      ["production", new ProductionHandler()],
    ]);
  }

  getHandler(): AbstractHandler {
    return this.configMap.get(process.env.NODE_CONFIG_ENV || "local-dev")!;
  }
}
