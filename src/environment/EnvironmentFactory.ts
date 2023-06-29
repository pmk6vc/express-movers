import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";
import AbstractHandler from "./handlers/AbstractHandler";

export default class EnvironmentFactory {
  private configMap: Map<string, AbstractHandler>;
  constructor() {
    this.configMap = new Map<string, AbstractHandler>([
      ["local-dev", new LocalDevHandler()],
      ["production", new ProductionHandler()],
    ]);
  }

  getHandler(): AbstractHandler {
    return this.configMap.get(process.env.NODE_CONFIG_ENV || "local-dev")!;
  }
}
