import { Environment } from "./handlers/IEnvironment";
import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";
import AbstractHandler from "./handlers/AbstractHandler";
import ISecretManager from "./util/ISecretManager";

export default class EnvironmentFactory {
  private configMap: Map<string, AbstractHandler>
  constructor(secretManager: ISecretManager) {
    this.configMap = new Map<string, AbstractHandler>([
      ["local-dev", new LocalDevHandler()],
      ["production", new ProductionHandler(secretManager)],
    ]);
  }

  getHandler(): AbstractHandler {
    return this.configMap.get(process.env.NODE_CONFIG_ENV || "local-dev")!;
  }
}