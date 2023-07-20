export class Config {
  public static async getRendererClusterConfig(): Promise<unknown> {
    return {
      maxConcurrency: 2,
      puppeteerOptions: {
        headless: process.env.NODE_ENV === "production" ? "new" : false,
        args:
          process.env.NODE_ENV === "production"
            ? ["--no-sandbox", "--disable-setuid-sandbox"]
            : [],
      },
    };
  }
}
