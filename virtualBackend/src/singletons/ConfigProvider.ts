import { PuppeteerLaunchOptions } from "puppeteer";

export class ConfigProvider {
  public static async getPupeeterConfig(): Promise<PuppeteerLaunchOptions> {
    return {
      headless: process.env.NODE_ENV === "production" ? "new" : false,
      args:
        process.env.NODE_ENV === "production"
          ? ["--no-sandbox", "--disable-setuid-sandbox"]
          : [],
    };
  }
}
