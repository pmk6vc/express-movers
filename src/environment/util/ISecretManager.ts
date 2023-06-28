export default interface ISecretManager {
  getSecretValue(projectId: string, secretName: string, secretVersion?: number): Promise<string>
}