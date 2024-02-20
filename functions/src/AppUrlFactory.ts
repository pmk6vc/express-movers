export default class AppUrlFactory {
  private static urlMap = new Map<string, string>([
    ["local-dev", "http://localhost:5495"],
    ["local-docker-compose", `http://app:${process.env.APP_PORT}`],
    ["production", "https://express-movers-h3fpwbsj7a-uc.a.run.app"],
  ]);

  static getUrl(): string {
    return AppUrlFactory.urlMap.get(process.env.CONFIG_ENV || "local-dev")!;
  }
}
