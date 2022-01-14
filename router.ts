import { Application, Router, send, RouteParams } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";

import { loadedScenes, getScene, addScene } from './manifest.ts';

import type { Scene } from './manifest.ts';

async function init(): Promise<Application> {
  const app = new Application();

  const ejsEngine = engineFactory.getEjsEngine();
  const oakAdapter = adapterFactory.getOakAdapter();

  app.use(viewEngine(oakAdapter, ejsEngine));

  const router = new Router();

  router.get("/:sceneId", async ctx => {
    const scene = fetchScene(ctx.params);
    if (!scene) ctx.response.redirect('/');
    else ctx.render("public/scene.ejs", { scene });
  });

  router.get("/:sceneId/control", async ctx => {
    const scene = fetchScene(ctx.params);
    if (!scene) ctx.response.redirect('/');
    else ctx.render("public/control.ejs", { scene });
  });

  router.get("/:sceneId/display", async ctx => {
    const scene = fetchScene(ctx.params);
    if (!scene) ctx.response.redirect('/');
    else ctx.render("public/display.ejs", { scene });
  });

  router.post('/add-scene', async ctx => {
    const body = await ctx.request.body({ type: 'form-data' })
    const data = await body.value.read();
    const filename = data.files![0].filename!;
    const fileContents = await Deno.readTextFile(filename);
    const sceneJson = JSON.parse(fileContents);
    const scene = getScene(sceneJson.id);
    if (scene) {
      console.log(`A scene with the id of ${sceneJson.id} already exists!`);
    } else {
      addScene(sceneJson);
    }
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
