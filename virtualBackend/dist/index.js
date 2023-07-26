"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrowserManager_1 = require("./BrowserManager");
const HttpServer_1 = require("./HttpServer");
const child_process_1 = require("child_process");
const PORT = 22137;
async function initApp() {
    console.log("The binding of gruby ryfek sie odpala ok ...");
    try {
        console.log("Ładuje se menago przeglondarek ok czekaj ok ...");
        BrowserManager_1.BrowserManager.getInstance().init();
        console.log("Załadowałem se menago przeglondarek ok!!!!!!!!!!");
    }
    catch (e) {
        console.error("kurwa cos sie wyjebalo ok");
        console.error(e);
        process.exit(-2137);
    }
    try {
        console.log("Ładuje se http serwer ok czekaj ok ...");
        HttpServer_1.HttpServer.getInstance().init(PORT);
        console.log(`Załadowałem se http server ok na porcie ${PORT}!!!!!!!!!!`);
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
    (0, child_process_1.spawn)(`start http://localhost:${PORT}/frontend`, { shell: true }).on("error", console.error);
})
    .catch(console.error);
process.on("SIGINT", async function () {
    try {
        console.log("zamykam se menago przeglondarek ok czekaj ok ...");
        BrowserManager_1.BrowserManager.getInstance().close();
        console.log("zamknolem se menago przeglondarek ok!!!!!!!!!!");
        console.log("zamykam se serwer http ok czekaj ok ...");
        HttpServer_1.HttpServer.getInstance().close();
        console.log("zamknolem se serwer http ok!!!!!!!!!!");
        console.log("dowidzenia JD pozdrawiam jp2gmd");
    }
    catch (e) {
        console.error("kurwa cos sie wyjebalo ok");
        console.error(e);
    }
});
