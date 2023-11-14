import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

// const wss = new WebSocketServer(7777);
const wss = new WebSocketServer(7777);

wss.on("connection", function (ws: WebSocketClient) {

  ws.on("close", (ev: CloseEvent) => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(ev);
  });
  ws.on("message", function (message: string) {

    const rspData = {
      "header": {
        "seq": 2,
        "timestamp": 1671234123,
        "userUID": "1",
        "sessionId": "1",
        "messageType": "bulletResponse",
      },
      "body": {
        "bulletChatRespData": [
          {
            "liveId": "liveid1234ABCD5678EFGH",
            "answer": "这是随机生成的回答1",
            "confidence": 0.89,
            "sendTime": 1634119876,
            "videoData": {
              "bucket": "example-bucket1",
              "object":
                "avatar-ai/20230524/audio/ac9c8bd0-9028-4926-bfc3-9f1d4869192c.mp4",
              "full":
                "https://zego-aigc-test.oss-cn-shanghai.aliyuncs.com/avatar-ai/20230524/ai-base-video/ac9c8bd0-9028-4926-bfc3-9f1d4869192c.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=LTAI5tGqv9rje9rHtTDWyDXo%2F20230528%2Foss-cn-shanghai%2Fs3%2Faws4_request&X-Amz-Date=20230528T145043Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Davatar-ai%2F20230524%2Fai-base-video%2Fac9c8bd0-9028-4926-bfc3-9f1d4869192c.mp4&X-Amz-Signature=41dc98b7a105a7307151dd54343f3380318dbc253a8676748ce45f068e27352f",
            },
          },
        ],
      },
    };
    const rsp = JSON.stringify(rspData);

    console.log(message);
    // ws.send(message);
  });
});
