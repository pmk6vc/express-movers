import AbstractHandler from "./AbstractHandler";

export class LocalDockerComposeHandler extends AbstractHandler {
  private static instance: LocalDockerComposeHandler;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!LocalDockerComposeHandler.instance) {
      LocalDockerComposeHandler.instance = new LocalDockerComposeHandler();
    }
    return LocalDockerComposeHandler.instance;
  }
}
