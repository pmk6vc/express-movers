import SecretManager from "./util/SecretManager";
import EnvironmentFactory from "./EnvironmentFactory";
import AbstractHandler from "./handlers/AbstractHandler";
import { Environment } from "./handlers/IEnvironment";

export default class EnvironmentResolver {

  private static secretManager = new SecretManager();
  private static environmentFactory = new EnvironmentFactory(this.secretManager)
  private static environmentHandler?: AbstractHandler
  private static environment?: Environment

  static getEnvironmentHandler() {
    if (this.environmentHandler == undefined) {
      this.environmentHandler = this.environmentFactory.getHandler()
    }
    return this.environmentHandler
  }

  // TODO: Can mock this method call out with Jest during testing to return a test Environment instance instead
  static getEnvironment() {
    if (this.environment == undefined) {
      this.environment = this.getEnvironmentHandler().getEnvironment()
    }
    return this.environment
  }

}