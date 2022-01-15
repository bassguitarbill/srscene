import { ensureFile } from "https://deno.land/std@0.121.0/fs/mod.ts";
import { scenesDirectory } from './main.ts';

type Scene = {
  id: string,
}

function isValidScene(scene: Scene): boolean {
  return !!scene.id;
}

let scenes: Array<Scene> = [];

async function loadScenes(path: string): Promise<void> {
  for await (const s of Deno.readDir(path)) {
    await loadScene(`${path}/${s.name}`);
  };
}

function getManifestPath(sceneDirPath: string): string {
  return `${sceneDirPath}/srscene.json`;
}

async function loadScene(path: string) {
  return Deno.stat(path)
  .then(dirInfo => {
    return new Promise<string>((res, rej) => {
      if (!dirInfo.isDirectory) rej(`${path} is not a directory`);
      else res(getManifestPath(path));
    });
  })
  .then(Deno.stat)
  .then(manifestInfo => {
    return new Promise<string>((res, rej) => {
      if (!manifestInfo.isFile) rej(`Invalid manifest file`);
      else res(getManifestPath(path));
    });
  })
  .then(Deno.readTextFile)
  .then(sceneData => {
    const scene = JSON.parse(sceneData);
    if (isValidScene(scene)) return scene;
    else throw `Invalid scene at ${path}`
  })
  .then(scene => { console.log(`Loaded scene ${scene.id}`); return scene; })
  .then(scene => scenes.push(scene))
  .catch(console.log)
}

function loadedScenes(): Array<Scene> {
  return scenes;
}

function getScene(sceneId: string): Scene | undefined {
  return scenes.find(s => s.id === sceneId);
}

async function addScene(scene: Scene) {
  const { id } = scene;
  const manifestFilePath = `${scenesDirectory}/${id}/srscene.json`;
  await ensureFile(manifestFilePath);
  await Deno.writeTextFile(manifestFilePath, JSON.stringify(scene));
  scenes.push(scene);
  console.log(`Added scene ${scene.id}`);
}

export {
  loadScenes,
  loadedScenes,
  getScene,
  addScene
}

export type { Scene }

