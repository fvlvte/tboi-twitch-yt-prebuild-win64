"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeLajtScraper = void 0;
const ObjectManager_1 = require("./ObjectManager");
const HttpServer_1 = require("./HttpServer");
class YoutubeLajtScraper {
    page;
    ytId = "";
    constructor(page) {
        this.page = page;
    }
    handleNewChatData(chatData) {
        const messageArray = chatData.continuationContents.liveChatContinuation.actions;
        if (typeof messageArray === "undefined") {
            return;
        }
        for (const item of messageArray) {
            if (item.addChatItemAction) {
                if (item.addChatItemAction.item.liveChatMembershipItemRenderer) {
                    const i = item.addChatItemAction.item.liveChatMembershipItemRenderer;
                    if (!i) {
                        continue;
                    }
                    try {
                        if (i.headerPrimaryText.runs[0].text.includes("Member for")) {
                            continue;
                        }
                    }
                    catch (e) { }
                    ObjectManager_1.ObjectManager.getInstance().getObject(HttpServer_1.HttpServer.name).putMessage(this.ytId, {
                        channelId: i.authorExternalChannelId || i.authorName.simpleText,
                        authorName: i.authorName.simpleText,
                        msgContent: "$$SYS_MEMBER$$",
                        isSponsor: true,
                    });
                }
                else {
                    const i = item.addChatItemAction.item.liveChatTextMessageRenderer;
                    if (!i) {
                        continue;
                    }
                    const chid = i.authorExternalChannelId;
                    const msg = i.message.runs[0].text;
                    if (typeof msg !== "undefined") {
                        ObjectManager_1.ObjectManager.getInstance().getObject(HttpServer_1.HttpServer.name).putMessage(this.ytId, {
                            channelId: chid,
                            authorName: i.authorName.simpleText,
                            msgContent: msg,
                        });
                    }
                }
            }
        }
    }
    async onRequest(response) {
        if (response.url().includes("youtubei/v1/live_chat/get_live_chat")) {
            try {
                const json = await response.json();
                this.handleNewChatData(json);
            }
            catch (error) {
                console.log("Error during axios request:", error);
            }
        }
    }
    async initOnYoutubeLajt(lajtId) {
        this.ytId = lajtId;
        this.page.on("response", this.onRequest.bind(this));
        await this.page.goto(`https://www.youtube.com/live_chat?is_popout=1&v=${lajtId}`);
    }
}
exports.YoutubeLajtScraper = YoutubeLajtScraper;
