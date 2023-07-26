import { HttpServer, BrowserManager } from "./singletons";
import { spawn } from "child_process";

const PORT = process.env.TBOI_BRIDGE_PORT
  ? parseInt(process.env.TBOI_BRIDGE_PORT)
  : 22137;

async function initApp(): Promise<void> {
  console.log(
    "The binding of gruby ryfek się odpala ok poczekaj chwile ok ...",
  );

  try {
    console.log("Ładuje se menago przeglondarek ok czekaj dalej ok ...");
    await BrowserManager.getInstance().init();
    console.log(
      "Załadowałem se menago przeglondarek ok udało sie ok!!!!!!!!!!",
    );
  } catch (e) {
    console.error(
      "kurwa cos sie wyjebalo podczas odpalania menago przeglondarek ok sadge papa",
    );
    console.error(e);
    process.exit(-2137);
  }

  try {
    console.log("Ładuje se bridge server ok czekaj ok ...");
    await HttpServer.getInstance().init(PORT);
    console.log(
      `Załadowałem se bridge server ok na porcie ${PORT} ok!!!!!!!!!!`,
    );
  } catch (e) {
    console.error(
      "kurwa cos sie wyjebalo podczas odpalania bridge servera ok sadge papa",
    );
    console.error(e);
    process.exit(-2137);
  }
}

initApp()
  .then(() => {
    console.log("!!!! The binding of gruby ryfek się odpalił !!!!");
    spawn(`start http://localhost:${PORT}/frontend`, { shell: true }).on(
      "error",
      console.error,
    );
  })
  .catch(console.error);

process.on("SIGINT", async function () {
  try {
    console.log("zamykam se menago przeglondarek ok czekaj ok ...");
    BrowserManager.getInstance().close();
    console.log("zamknolem se menago przeglondarek ok!!!!!!!!!!");

    console.log("zamykam se bridge serwer http ok czekaj ok ...");
    HttpServer.getInstance().close();
    console.log("zamknolem se bridge serwer http ok!!!!!!!!!!");

    console.log(
      "dowidzenia JD pozdrawiam jp2gmd hpwd php ok milego dzionka lub wieczorka ok!!!!!!!!!!",
    );
  } catch (e) {
    console.error(
      "kurwa cos sie wyjebalo podczas czyszczenia ok papa elo benc",
    );
    console.error(e);
  }
});
