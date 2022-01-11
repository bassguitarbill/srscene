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
  return Deno.stat(path).then((dirInfo: Deno.FileInfo) => {
    return new Promise<string>((res, rej) => {
      if (!dirInfo.isDirectory) rej(`${path} is not a directory`);
      else res(getManifestPath(path));
    });
  })
  .then(Deno.stat)
  .then((manifestInfo: Deno.FileInfo) => {
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
  .then(scene => scenes.push(scene))
  .catch(console.log)
}

function loadedScenes(): Array<Scene> {
  return scenes;
}

export {
  loadScenes,
  loadedScenes,
}

export type { Scene }

