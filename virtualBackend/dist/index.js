"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrowserManager_1 = require("./BrowserManager");
const ObjectManager_1 = require("./ObjectManager");
const HttpServer_1 = require("./HttpServer");
const child_process_1 = require("child_process");
const PORT = 22137;
const OBJECTS = {
    [BrowserManager_1.BrowserManager.name]: new BrowserManager_1.BrowserManager(),
    [HttpServer_1.HttpServer.name]: new HttpServer_1.HttpServer(),
};
async function initApp() {
    console.log("The binding of gruby ryfek sie odpala ok ...");
    try {
        console.log("Ładuje se http serwer ok czekaj ok ...");
        await OBJECTS[HttpServer_1.HttpServer.name].init(PORT);
        console.log(`Załadowałem se http server ok na porcie ${PORT}!!!!!!!!!!`);
    }
    catch (e) {
        console.error("kurwa cos sie wyjebalo ok");
        console.error(e);
        process.exit(-2137);
    }
    try {
        console.log("Ładuje se menago przeglondarek ok czekaj ok ...");
        await OBJECTS[BrowserManager_1.BrowserManager.name].init();
        console.log("Załadowałem se menago przeglondarek ok!!!!!!!!!!");
    }
    catch (e) {
        console.error("kurwa cos sie wyjebalo ok");
        console.error(e);
        process.exit(-2137);
    }
    console.log("Dobra juz dzialam ok spoko fajnie pozdro.");
}
initApp()
    .then(() => {
    console.log("!!!! Gruby ryfek wstał !!!!");
    (0, child_process_1.spawn)(`start http://localhost:${PORT}/frontend`).on("error", console.error);
})
    .catch(console.error);
process.on("beforeExit", async function () {
    try {
        console.log("zamykam se menago przeglondarek ok czekaj ok ...");
        const bm = ObjectManager_1.ObjectManager.getInstance().getObject(BrowserManager_1.BrowserManager.name);
        if (bm) {
            await bm.close();
        }
        console.log("zamknolem se menago przeglondarek ok!!!!!!!!!!");
        console.log("zamykam se serwer http ok czekaj ok ...");
        const server = ObjectManager_1.ObjectManager.getInstance().getObject(HttpServer_1.HttpServer.name);
        if (server) {
            await server.close();
        }
        console.log("zamknolem se serwer http ok!!!!!!!!!!");
        console.log("dowidzenia JD pozdrawiam jp2gmd");
    }
    catch (e) {
        console.error("kurwa cos sie wyjebalo ok");
        console.error(e);
    }
});
