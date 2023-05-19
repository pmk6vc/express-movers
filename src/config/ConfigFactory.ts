import { Environment, EnvironmentHandler } from "./handlers/IEnvironment";
import config from 'config'
import { LocalDevHandler } from "./handlers/LocalDevHandler";
import { ProductionHandler } from "./handlers/ProductionHandler";

class EnvironmentFactory {
  private static configMap = new Map<string, EnvironmentHandler>([
    ['local-dev', new LocalDevHandler()],
    ['production', new ProductionHandler()]
  ])

  static getEnvironment(): Environment {
    const handler = this.configMap.get(process.env.NODE_CONFIG_ENV!)!
    return handler.getEnvironment(config)
  }
}

const environment = EnvironmentFactory.getEnvironment()
export default environment