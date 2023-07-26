export interface YoutubeChatAPIData {
  responseContext: {
    serviceTrackingParams: ServiceTrackingParam[];
    mainAppWebResponseContext: {
      loggedOut: boolean;
      trackingParam: string;
    };
    webResponseContextExtensionData: {
      hasDecorated: boolean;
    };
  };
  continuationContents: {
    liveChatContinuation: {
      continuations: Continuation[];
      actions: Action[];
    };
  };
}

interface ServiceTrackingParam {
  service: string;
  params: Param[];
}

interface Param {
  key: string;
  value: string;
}

interface Continuation {
  invalidationContinuationData: InvalidationContinuationData;
}

interface InvalidationContinuationData {
  invalidationId: {
    objectSource: number;
    objectId: string;
    topic: string;
    subscribeToGcmTopics: boolean;
    protoCreationTimestampMs: string;
  };
  timeoutMs: number;
  continuation: string;
}

interface Action {
  addChatItemAction: {
    item: {
      liveChatTextMessageRenderer: LiveChatTextMessageRenderer;
      liveChatMembershipItemRenderer: LiveChatMembershipItemRenderer;
    };
  };
}

interface LiveChatTextMessageRenderer {
  message: {
    runs: { text: string }[];
  };
  authorName: {
    simpleText: string;
  };
  authorPhoto: {
    thumbnails: Thumbnail[];
  };
  contextMenuEndpoint: {
    commandMetadata: {
      webCommandMetadata: {
        ignoreNavigation: boolean;
      };
    };
    liveChatItemContextMenuEndpoint: {
      params: string;
    };
  };
  id: string;
  timestampUsec: string;
  authorExternalChannelId: string;
  contextMenuAccessibility: {
    accessibilityData: {
      label: string;
    };
  };
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
