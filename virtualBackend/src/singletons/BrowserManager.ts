import { ConfigProvider } from ".";
import { Page, Browser, launch } from "puppeteer";

export class BrowserManager {
  private static instance: BrowserManager;

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  private browser: Browser | null;

  private constructor() {
    this.browser = null;
  }

  public async init(): Promise<void> {
    if (this.browser) return;

    this.browser = await launch(await ConfigProvider.getPupeeterConfig());
  }

  public async close(): Promise<void> {
    if (!this.browser) return;

    await this.browser.close();
    this.browser = null;
  }

  public async spawnBlankPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error(`${this.constructor.name} is not initialized`);
    }

    return this.browser?.newPage();
  }
}
