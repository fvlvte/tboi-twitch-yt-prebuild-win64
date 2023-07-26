import { default as express } from "express";
import * as http from "http";
import * as cors from "cors";
import { HttpStatusCode } from "axios";
import { BrowserManager, YoutubeLajtScraper } from ".";

export class HttpServer {
  private app: express.Application;
  private server: http.Server | null;

  private messageStore: { [ytid: string]: unknown[] } = {};

  private static instance: HttpServer;

  public static getInstance(): HttpServer {
    if (!HttpServer.instance) {
      HttpServer.instance = new HttpServer();
    }
    return HttpServer.instance;
  }

  private constructor() {
    this.app = express();
    this.server = null;
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
    res: express.Response,
  ): Promise<void> {
    try {
      this.messageStore[req.query.ytId as string] = [];

      const page = await BrowserManager.getInstance().spawnBlankPage();

      new YoutubeLajtScraper(page).initOnYoutubeLajt(req.query.ytId as string);

      res.status(HttpStatusCode.NoContent).send();
    } catch (e) {
      console.error(e);
      res.status(HttpStatusCode.InternalServerError).send(JSON.stringify(e));
    }
  }

  private async handleGetArray(
    req: express.Request,
    res: express.Response,
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
      express.static(
        process.env.NODE_ENV === "production"
          ? "dist/frontend"
          : "../frontendPrebuilt",
        { index: "index.html" },
      ),
    );

    this.server = this.app.listen(port || 22137);
  }
}
