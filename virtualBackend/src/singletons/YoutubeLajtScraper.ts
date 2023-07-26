import { HTTPResponse, Page } from "puppeteer";
import { HttpServer } from ".";
import { YoutubeChatAPIData } from "../types/YoutubeChat";

export class YoutubeLajtScraper {
  private static readonly YT_CHAT_SWITCH_SELECTOR = "yt-icon[icon='expand']";

  private static readonly YT_LIVE_CHAT_SELECTOR =
    "tp-yt-paper-listbox[id='menu'] a[aria-selected='false'] tp-yt-paper-item tp-yt-paper-item-body";

  private page: Page;
  private ytId = "";

  constructor(page: Page) {
    this.page = page;
  }

  private handleNewChatData(chatData: YoutubeChatAPIData) {
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

          HttpServer.getInstance().putMessage(this.ytId, {
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
            HttpServer.getInstance().putMessage(this.ytId, {
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
    if (typeof lajtId !== "string") throw new Error("lajtId is not a string");
    if (lajtId.length === 0) throw new Error("lajtId is empty");

    this.ytId = lajtId;

    this.page.on("response", this.onRequest.bind(this));

    await this.page.goto(
      `https://www.youtube.com/live_chat?is_popout=1&v=${lajtId}`,
    );

    await this.page.waitForSelector(YoutubeLajtScraper.YT_CHAT_SWITCH_SELECTOR);
    await this.page.click(YoutubeLajtScraper.YT_CHAT_SWITCH_SELECTOR);

    await this.page.waitForSelector(YoutubeLajtScraper.YT_LIVE_CHAT_SELECTOR);
    await this.page.evaluate(`
      document.querySelector("${YoutubeLajtScraper.YT_LIVE_CHAT_SELECTOR}").click();
    `);
  }
}
