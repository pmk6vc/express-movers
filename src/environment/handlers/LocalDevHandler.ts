import AbstractHandler from "./AbstractHandler";

export class LocalDevHandler extends AbstractHandler {
  async runMigration() {
    const env = await this.getEnvironment();
    console.log("You've reached the local dev handler migration!")
  }
}
