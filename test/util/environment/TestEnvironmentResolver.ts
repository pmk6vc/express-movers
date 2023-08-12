import { TestEnvironmentHandler } from "./TestEnvironmentHandler";

export default class TestEnvironmentResolver {
  private static environmentHandler = new TestEnvironmentHandler();

  static getEnvironmentHandler() {
    return this.environmentHandler;
  }

  static getEnvironment() {
    return this.getEnvironmentHandler().getEnvironment();
  }
}
