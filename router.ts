import { Application, Router, send } from "https://deno.land/x/oak@v6.5.0/mod.ts";

import { viewEngine, engineFactory, adapterFactory } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";

async function init(): Promise<Application> {
  const app = new Application();

  const ejsEngine = engineFactory.getEjsEngine();
  const oakAdapter = adapterFactory.getOakAdapter();

  app.use(viewEngine(oakAdapter, ejsEngine));

  const router = new Router();

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

  router.get("/", async ctx => {
    ctx.render("public/index.ejs");
  });

  app.use(router.routes());

  app.use(async (ctx, next) => {
    ctx.response.redirect('/');
  });

  await app.listen({ port: 8000 });

  return app;
}

function findScenes() {} 

export default init;
