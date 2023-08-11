import { TestEnvironmentHandler } from "./TestEnvironmentHandler";

// TODO: Try to use an interface to structure resolvers
export default class TestEnvironmentResolver {
  private static environmentHandler = new TestEnvironmentHandler()

  static getEnvironmentHandler() {
    return this.environmentHandler
  }

  static getEnvironment() {
    return this.getEnvironmentHandler().getEnvironment()
  }
}