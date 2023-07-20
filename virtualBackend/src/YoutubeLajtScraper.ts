import { HTTPResponse, Page } from "puppeteer";
import { ObjectManager } from "./ObjectManager";
import { HttpServer } from "./HttpServer";

export class YoutubeLajtScraper {
  private page: Page;
  private ytId = "";

  constructor(page: Page) {
    this.page = page;
  }

  private handleNewChatData(chatData: any) {
    const messageArray =
      chatData.continuationContents.liveChatContinuation.actions;

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
          } catch (e) {}

          (
            ObjectManager.getInstance().getObject(HttpServer.name) as HttpServer
          ).putMessage(this.ytId, {
            channelId: i.authorExternalChannelId || i.authorName.simpleText,
            authorName: i.authorName.simpleText,
            msgContent: "$$SYS_MEMBER$$",
            isSponsor: true,
          });
        } else {
          const i = item.addChatItemAction.item.liveChatTextMessageRenderer;
          if (!i) {
            continue;
          }
          const chid = i.authorExternalChannelId;
          const msg = i.message.runs[0].text;

          if (typeof msg !== "undefined") {
            (
              ObjectManager.getInstance().getObject(
                HttpServer.name
              ) as HttpServer
            ).putMessage(this.ytId, {
              channelId: chid,
              authorName: i.authorName.simpleText,
              msgContent: msg,
            });
          }
        }
      }
    }
  }

  private async onRequest(response: HTTPResponse): Promise<void> {
    if (response.url().includes("youtubei/v1/live_chat/get_live_chat")) {
      try {
        const json = await response.json();
        this.handleNewChatData(json);
      } catch (error) {
        console.log("Error during axios request:", error);
      }
    }
  }

  public async initOnYoutubeLajt(lajtId: string): Promise<void> {
    this.ytId = lajtId;

    this.page.on("response", this.onRequest.bind(this));

    await this.page.goto(
      `https://www.youtube.com/live_chat?is_popout=1&v=${lajtId}`
    );
  }
}
