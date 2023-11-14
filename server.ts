import { iterateReader } from "https://deno.land/std@0.185.0/streams/iterate_reader.ts";
import { ServerSentEvent } from "https://deno.land/x/oak@v12.4.0/deps.ts";
import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
// import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();
const router = new Router();
router
  .post("/hello", async (ctx, next) => {
    if (ctx.request.hasBody) {
      await new Promise((res) => setTimeout(res, 1000));
      const body = await ctx.request.body({ "type": "text" }).value;
      console.log(body);

      // ctx.response.body = ctx.request.body()
      ctx.response.body = body;
    } else {
      ctx.response.body = "Ni Hao";
    }
    await next();
  })
  .post("/stream-info", async (ctx, next) => {
    await next();
    const target = ctx.sendEvents();
    const overEvent = new ServerSentEvent("over", { data: "close connection" });

    const sendText = ` 完美日记天鹅绒唇釉口红的神奇魔力在于它能瞬间显白您的嘴唇，
让您的笑容更加明媚动人。与此同时，它的持久性能可以轻易应对一整天的繁忙。`
    const tarr = sendText.split('')
    // console.log(tarr);
    

    const len = 10;
    const timeFn = async () => {
      let index = 0;
      while (true) {
        const str = tarr.slice(index, index+len);
        if (index >= sendText.length) {
          target.dispatchMessage({ data: { content: str, status: 'over' } });
          return target.dispatchEvent(overEvent);
        }
        
        index += 10;
        target.dispatchMessage({ data: {content: str} });
        await new Promise((res) => setTimeout(res, 1000));
      }
    };

    timeFn();
  })
  // EventSource
  .get("/event-source", async (ctx, next) => {
    await next();
    const target = ctx.sendEvents();
    const file = await Deno.open("./upload/frag_bunny.mp4");
    const buffer = new Uint8Array(1024 * 512);
    const event = new ServerSentEvent("over", { data: "close connection" });
    // const timer = setInterval(async () => {

    //   const byteRead = await Deno.read(file.rid, buffer);
    //   if (byteRead === null) {
    //     target.dispatchEvent(event)
    //     target.close()
    //     clearInterval(timer)
    //     return
    //   }
    //   const content = buffer.subarray(0, byteRead!);
    //   const dbuf = text.decode(content)
    //   console.log(typeof dbuf);
    //   const serialize = JSON.stringify(Array.from(content));

    //   target.dispatchMessage({ data: serialize });
    // }, 500)

    const it = iterateReader(file, { bufSize: 1024 * 512 });
    const timeFn = async () => {
      const chunk = await it.next();
      if (!chunk.value) {
        target.dispatchEvent(event);
        file.close();
        return;
      }
      const serialize = JSON.stringify(Array.from(chunk.value));
      target.dispatchMessage({ data: serialize });
      await new Promise((res) => setTimeout(res, 1000));
      timeFn();
    };

    timeFn();
  })
  // WebSocket
  .get("/ws", (ctx) => {
    const socket = ctx.upgrade();
    socket.onmessage = (ev) => {
      console.log(ev.data);
      // socket.send(JSON.stringify({message: 'oak send message'}))
    };
  })
  .post("/upload", async (ctx, next) => {
    const formDataReader = ctx.request.body({ type: "form-data" });
    const formDataBody = await formDataReader.value.read({ maxSize: 10000000 });
    console.log(formDataBody);

    await next();
    const files = formDataBody.files;
    files?.forEach((file) => {
      if (file.contentType.includes("png")) {
        ctx.response.body = {
          code: "-1111111",
          message: "png not upload",
        };
      }
      Deno.writeFileSync("./upload/xxx.png", file.content!);
    });
    console.log(ctx.response.body);
    if (ctx.response.body) return;
    ctx.response.body = {
      code: "-10001",
      message: "111111111111",
    };
  });
// app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
  await next();
  // if (ctx.request.method === 'OPTIONS') ctx.response.status = 200
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS",
  );
  ctx.response.headers.set("Access-Control-Allow-Headers", "*");
  ctx.response.headers.set("Access-Control-Allow-Credentials", "true");
});

console.log("listening on http://localhost:8000/");
await app.listen({ port: 8000 });
