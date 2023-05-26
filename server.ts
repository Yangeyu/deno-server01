import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";

const app = new Application();
const router = new Router();

router
  .post("/hello", async (ctx, next) => {
    await next()
    ctx.response.body = "Ni Hao";
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

app.use(router.routes());
app.use(async (ctx, next) => {
  await next();
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "*");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  ctx.response.headers.set("Access-Control-Allow-Credentials", "true")
});

console.log("listening on http://localhost:8000/");
await app.listen({ port: 8000 });
