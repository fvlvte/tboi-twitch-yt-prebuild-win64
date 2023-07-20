"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserManager = void 0;
const puppeteer_cluster_1 = require("puppeteer-cluster");
const config_1 = require("./config");
const ObjectManager_1 = require("./ObjectManager");
class BrowserManager {
    static DEFAULT_QUALITY = 95;
    cluster;
    constructor() {
        this.cluster = null;
        ObjectManager_1.ObjectManager.getInstance().registerObject(this.constructor.name, this);
    }
    async init() {
        if (this.cluster)
            return;
        this.cluster = await puppeteer_cluster_1.Cluster.launch(Object.assign({
            concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_CONTEXT,
            timeout: 60 * 60 * 24 * 1000,
            puppeteerOptions: { devtools: true },
        }, await config_1.Config.getRendererClusterConfig()));
    }
    async close() {
        if (!this.cluster)
            return;
        await this.cluster.close();
        this.cluster = null;
    }
    async spawnBlankPage(completionCallback) {
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
exports.BrowserManager = BrowserManager;
