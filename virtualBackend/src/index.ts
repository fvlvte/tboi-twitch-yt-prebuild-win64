import { BrowserManager } from "./BrowserManager";

import { ObjectManager } from "./ObjectManager";
import { HttpServer } from "./HttpServer";
import { spawn } from "child_process";

const PORT = 22137;

const OBJECTS = {
  [BrowserManager.name]: new BrowserManager(),
  [HttpServer.name]: new HttpServer(),
};

async function initApp(): Promise<void> {
  console.log("The binding of gruby ryfek sie odpala ok ...");

  try {
    console.log("Ładuje se http serwer ok czekaj ok ...");
    await (OBJECTS[HttpServer.name] as HttpServer).init(PORT);
    console.log(`Załadowałem se http server ok na porcie ${PORT}!!!!!!!!!!`);
  } catch (e) {
    console.error("kurwa cos sie wyjebalo ok");
    console.error(e);
    process.exit(-2137);
  }

  try {
    console.log("Ładuje se menago przeglondarek ok czekaj ok ...");
    await (OBJECTS[BrowserManager.name] as BrowserManager).init();
    console.log("Załadowałem se menago przeglondarek ok!!!!!!!!!!");
  } catch (e) {
    console.error("kurwa cos sie wyjebalo ok");
    console.error(e);
    process.exit(-2137);
  }

  console.log("Dobra juz dzialam ok spoko fajnie pozdro.");
}

initApp()
  .then(() => {
    console.log("!!!! Gruby ryfek wstał !!!!");
    spawn(`start http://localhost:${PORT}/frontend`).on("error", console.error);
  })
  .catch(console.error);

process.on("beforeExit", async function () {
  try {
    console.log("zamykam se menago przeglondarek ok czekaj ok ...");
    const bm = ObjectManager.getInstance().getObject(BrowserManager.name) as
      | BrowserManager
      | undefined;
    if (bm) {
      await bm.close();
    }
    console.log("zamknolem se menago przeglondarek ok!!!!!!!!!!");

    console.log("zamykam se serwer http ok czekaj ok ...");
    const server = ObjectManager.getInstance().getObject(HttpServer.name) as
      | HttpServer
      | undefined;
    if (server) {
      await server.close();
    }
    console.log("zamknolem se serwer http ok!!!!!!!!!!");
    console.log("dowidzenia JD pozdrawiam jp2gmd");
  } catch (e) {
    console.error("kurwa cos sie wyjebalo ok");
    console.error(e);
  }
});
