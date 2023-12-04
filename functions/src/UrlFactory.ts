export default class UrlFactory {
  private static urlMap = new Map<string, string>([
    ["local-dev", "http://localhost:5495"],
    ["local-docker-compose", "http://app:5495"],
    ["production", "https://express-movers-h3fpwbsj7a-uc.a.run.app"],
  ]);

  static getUrl(): string {
    return UrlFactory.urlMap.get(process.env.CONFIG_ENV || "local-dev")!;
  }
}
