import { default as express } from "express";
import * as http from "http";
import * as cors from "cors";
import { HttpStatusCode } from "axios";
import { ObjectManager } from "./ObjectManager";
import { BrowserManager } from "./BrowserManager";
import { YoutubeLajtScraper } from "./YoutubeLajtScraper";

export class HttpServer {
  private app: express.Application;
  private server: http.Server | null;

  private messageStore: { [ytid: string]: unknown[] } = {};

  constructor() {
    this.app = express();
    this.server = null;
    ObjectManager.getInstance().registerObject(this.constructor.name, this);
  }

  public putMessage(id: string, message: unknown): void {
    this.messageStore[id].push(message);
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server?.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private async handleYoutubeInit(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const cc = async () => {
        return new Promise(() => {
          1 + 1;
        });
      };
      this.messageStore[req.query.ytId as string] = [];

      const page = await (
        ObjectManager.getInstance().getObject(
          BrowserManager.name
        ) as BrowserManager
      ).spawnBlankPage(cc as any);

      new YoutubeLajtScraper(page).initOnYoutubeLajt(req.query.ytId as string);

      res.status(HttpStatusCode.NoContent).send();
    } catch (e) {
      console.error(e);
      res.status(HttpStatusCode.InternalServerError).send(JSON.stringify(e));
    }
  }

  private async handleGetArray(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      res
        .status(HttpStatusCode.Ok)
        .send({ items: this.messageStore[req.query.ytId as string] });
      this.messageStore[req.query.ytId as string] = [];
    } catch (e) {
      console.error(e);
      res.status(HttpStatusCode.InternalServerError).send(JSON.stringify(e));
    }
  }

  public async init(port?: number): Promise<void> {
    this.app.options("*", cors.default());
    this.app.use(cors.default());

    this.app.get("/pop", this.handleGetArray.bind(this));
    this.app.get("/init", this.handleYoutubeInit.bind(this));
    this.app.use(
      "/frontend",
      express.static("../frontendPrebuilt", { index: "index.html" })
    );

    this.server = this.app.listen(port);
  }
}
