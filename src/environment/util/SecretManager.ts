import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import ISecretManager from "./ISecretManager";

export default class SecretManager implements ISecretManager {
  private secretManagerClient = new SecretManagerServiceClient();

  async getSecretValue(
    projectId: string,
    secretName: string,
    secretVersion?: number
  ) {
    const [secret] = await this.secretManagerClient.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretName}/versions/${
        secretVersion || "latest"
      }`,
    });
    return secret.payload!.data!.toString();
  }
}
