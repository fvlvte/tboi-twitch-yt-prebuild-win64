import { Cluster } from "puppeteer-cluster";
import { Config } from "./config";
import { Page } from "puppeteer";
import { ObjectManager } from "./ObjectManager";

export type HtmlRedererOutput = {
  type: string;

  width: number;
  height: number;

  dataPrefix: string;
  dataType: "base64" | "buffer";
  data: string | Buffer;
};

export type HtmlRendererOptions = {
  selector?: string;
  encoding?: "base64" | "buffer";
  quality?: number;
  type?: "jpeg" | "png";
};

export class BrowserManager {
  public static readonly DEFAULT_QUALITY = 95;

  private cluster: Cluster | null;

  constructor() {
    this.cluster = null;
    ObjectManager.getInstance().registerObject(this.constructor.name, this);
  }

  public async init(): Promise<void> {
    if (this.cluster) return;

    this.cluster = await Cluster.launch(
      Object.assign(
        {
          concurrency: Cluster.CONCURRENCY_CONTEXT,
          timeout: 60 * 60 * 24 * 1000,
          puppeteerOptions: { devtools: true },
        },
        await Config.getRendererClusterConfig()
      )
    );
  }

  public async close(): Promise<void> {
    if (!this.cluster) return;

    await this.cluster.close();
    this.cluster = null;
  }

  public async spawnBlankPage(
    completionCallback: () => Promise<void>
  ): Promise<Page> {
    return new Promise((resolve, reject) => {
      if (!this.cluster) {
        reject(new Error("HtmlRenderer not initialized"));
      }

      this.cluster?.execute({}, async ({ page }) => {
        resolve(page);

        await completionCallback();
      });
    });
  }
}
