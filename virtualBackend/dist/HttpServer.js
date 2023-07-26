"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const express_1 = __importDefault(require("express"));
const cors = __importStar(require("cors"));
const axios_1 = require("axios");
const BrowserManager_1 = require("./BrowserManager");
const YoutubeLajtScraper_1 = require("./YoutubeLajtScraper");
class HttpServer {
    app;
    server;
    messageStore = {};
    static instance;
    static getInstance() {
        if (!HttpServer.instance) {
            HttpServer.instance = new HttpServer();
        }
        return HttpServer.instance;
    }
    constructor() {
        this.app = (0, express_1.default)();
        this.server = null;
    }
    putMessage(id, message) {
        this.messageStore[id].push(message);
    }
    async close() {
        return new Promise((resolve, reject) => {
            this.server?.close((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async handleYoutubeInit(req, res) {
        try {
            this.messageStore[req.query.ytId] = [];
            const page = await BrowserManager_1.BrowserManager.getInstance().spawnBlankPage();
            new YoutubeLajtScraper_1.YoutubeLajtScraper(page).initOnYoutubeLajt(req.query.ytId);
            res.status(axios_1.HttpStatusCode.NoContent).send();
        }
        catch (e) {
            console.error(e);
            res.status(axios_1.HttpStatusCode.InternalServerError).send(JSON.stringify(e));
        }
    }
    async handleGetArray(req, res) {
        try {
            res
                .status(axios_1.HttpStatusCode.Ok)
                .send({ items: this.messageStore[req.query.ytId] });
            this.messageStore[req.query.ytId] = [];
        }
        catch (e) {
            console.error(e);
            res.status(axios_1.HttpStatusCode.InternalServerError).send(JSON.stringify(e));
        }
    }
    async init(port) {
        this.app.options("*", cors.default());
        this.app.use(cors.default());
        this.app.get("/pop", this.handleGetArray.bind(this));
        this.app.get("/init", this.handleYoutubeInit.bind(this));
        this.app.use("/frontend", express_1.default.static("../frontendPrebuilt", { index: "index.html" }));
        this.server = this.app.listen(port);
    }
}
exports.HttpServer = HttpServer;
