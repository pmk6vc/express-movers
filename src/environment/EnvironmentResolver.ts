import EnvironmentFactory from "./EnvironmentFactory";
import AbstractHandler from "./handlers/AbstractHandler";
import { Environment } from "./handlers/IEnvironment";

export default class EnvironmentResolver {
  // TODO: Should pass environment factory via DI instead of hard-coding here?
  private static environmentFactory = new EnvironmentFactory();
  private static environmentHandler?: AbstractHandler;
  private static environment?: Environment;

  static getEnvironmentHandler() {
    if (this.environmentHandler == undefined) {
      this.environmentHandler = this.environmentFactory.getHandler();
    }
    return this.environmentHandler;
  }

  // TODO: Can mock this method call out with Jest during testing to return a test Environment instance instead
  static async getEnvironment() {
    if (this.environment == undefined) {
      this.environment = await this.getEnvironmentHandler().getEnvironment();
    }
    return this.environment;
  }
}
