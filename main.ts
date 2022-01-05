import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();


const router = new Router();

router.get("/", async ctx => {
  await send(ctx, "/", {
    root: `${Deno.cwd()}/public`,
    index: 'index.html'
  });
});

router.get("/control", async ctx => {
  await send(ctx, "control.html", {
    root: `${Deno.cwd()}/public`,
  });
});

router.get("/display", async ctx => {
  await send(ctx, "display.html", {
    root: `${Deno.cwd()}/public`,
  });
});

await app.use(router.routes()).listen({ port: 8000 });

function findScenes() {} 
