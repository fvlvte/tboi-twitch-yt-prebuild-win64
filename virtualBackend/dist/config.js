"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    static async getPupeeterConfig() {
        return {
            headless: process.env.NODE_ENV === "production" ? "new" : false,
            args: process.env.NODE_ENV === "production"
                ? ["--no-sandbox", "--disable-setuid-sandbox"]
                : [],
        };
    }
}
exports.Config = Config;
