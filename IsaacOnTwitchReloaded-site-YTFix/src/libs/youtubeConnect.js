import {TextMessage, DonateMessage, Subscriber} from './streamEvents';

export default class YoutubeConnect {

  /**
   * Create new chat object for Youtube
   * @param {String} streamURLString - URL for YouTube stream
   */
  constructor (streamURLString) {
    this.apikey = "wgnn-wBx-_VT5Nu996o8ylc-t786swbRBySazIA".split('').reverse().join('');
    this.streamURL = new URL(streamURLString);
    this.lastMessagesId = [];
    this.vuewersCount = 0;
    this.channel = null;
    this.nextPageToken = null;

    this.consoleStyle = 'background-color: #FF0000; color: #FFFFFF; border-radius: 100px;padding: 1px 4px;';

    if (this.streamURL.hostname == "www.youtube.com" || this.streamURL.hostname == "youtube.com") {
      this.streamId = this.streamURL.searchParams.get('v');
    }
    else {
      this.streamId = this.streamURL.pathname.substr(1);
    }

    this.events = {
      onMessage: () => {},
      onSub: () => {},
      onFollower: () => {},
      onSuperchat: () => {},

      onConnect: () => {},
      onDisconnect: () => {},
      onError:  () => {}
    }
  }

  connect () {
    fetch(
      "http://localhost:22137/init?ytId=" + this.streamId 
    )
    .then(res => {
      return res.json()
    })
    .then (res => {
      //this.chatId = res.items[0].liveStreamingDetails.activeLiveChatId;
      //this.channel = res.items[0].snippet.channelId;

      this._updateChat();
      this.updTimer = setInterval(this._updateChat.bind(this), 5000);
    })
    .catch (err => {
      this._signal('onError', err);
    })
  }

  disconnect () {

    clearInterval(this.updTimer);
    this._signal('onDisconnect', null);

  }

  updateViewers() {

    /*return fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${this.streamId}&fields=items%2FliveStreamingDetails&key=${this.apikey}`
      )
      .then(res => res.json())
      .then(res => {
        if (res.items?.length > 0) {
          this.viewersCount = res.items[0].liveStreamingDetails.concurrentViewers
        }
      })*/

  }

  _updateChat () {
    fetch(
      "http://localhost:22137/pop?ytId=" + this.streamId
    )
    .then (res => {
      return res.json();
    })
    .then (res => {
      res.items.forEach(msg => {
       
        /*
         { channelId: i.authorExternalChannelId || i.authorName.simpleText, authorName: i.authorName.simpleText, msgContent: '$$SYS_MEMBER$$' }
        */

        // Check if this is a basic message
        if (!msg.isSponsor) {

          this._signal('onMessage', new TextMessage(
            msg.channelId,
            msg.authorName,
            msg.msgContent,
            'yt'
          ));
          return;
        }

        // Check if message have superchat data (like bits for Twitch)
       /* if (msg.snippet.type == 'superChatEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superChatDetails.tier > 5 ? 5 : msg.snippet.superChatDetails.tier,
            1,
            'yt'
          ));

          this._log("Get donate from " + msg.authorDetails.displayName + " - " + msg.snippet.superChatDetails.amountMicros);
          return;
        }

        else if (msg.snippet.type == 'superStickerEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superStickerDetails.tier > 5 ? 5 : msg.snippet.superStickerDetails.tier,
            1,
            'yt'
          ));

          this._log("Get donate from " + msg.authorDetails.displayName + " - " + msg.snippet.superChatDetails.amountMicros);
          return;
        }*/

        // Check if this is new subscriber
        if (msg.isSponsor) {
          this._signal('onSub', new Subscriber(
            msg.channelId,
            msg.authorName,
            'yt'
          ));

          this._log("New subscriber " + msg.authorDetails.displayName);
          return;
        }
      });
    })
  }

  _log (msg) {
    console.log('%cYoutube%c ' + msg, this.consoleStyle, '');
  }

  _signal (name, data) {

    this.events[name](data);

  }
}