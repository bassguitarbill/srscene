import { Application, Router, send, RouteParams } from "https://deno.land/x/oak@v6.5.0/mod.ts";

import { viewEngine, engineFactory, adapterFactory } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";

import { loadedScenes, getScene } from './manifest.ts';

import type { Scene } from './manifest.ts';

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

  router.get("/:sceneId", async ctx => {
    const scene = fetchScene(ctx.params);
    if (!scene) ctx.response.redirect('/');
    else ctx.render("public/scene.ejs", { scene });
  });

  router.post('/add-scene', async ctx => {
    const body = await ctx.request.body({ type: 'form-data' })
    const data = await body.value.read();
    const filename = data.files![0].filename!;
    const fileContents = await Deno.readTextFile(filename);
    console.log(data);
    console.log(fileContents);
    ctx.response.redirect('/');
  });

  router.get("/", async ctx => {
    ctx.render("public/index.ejs", { scenes: loadedScenes() });
  });

  app.use(router.routes());

  app.use(async (ctx, next) => {
    ctx.response.redirect('/');
  });

  await app.listen({ port: 8000 });

  return app;
}

function fetchScene(params: RouteParams): Scene | undefined {
  if (!params.sceneId) return undefined;
  const scene = getScene(params.sceneId); 
  if (!scene) return undefined;
  return scene;
}


export default init;
