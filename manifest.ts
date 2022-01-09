type Scene = {
  id: string,
}

function isValidScene(scene: Scene): boolean {
  return !!scene.id;
}

let scenes: Array<Scene> = [];

function loadScenes(path: string) {
  for (let s of Deno.readDirSync(path)) loadScene(`${path}/${s.name}`);
}

function getManifestPath(sceneDirPath: string) {
  return `${sceneDirPath}/srscene.json`;
}

function loadScene(path: string) {
  const sceneDirectoryInfo = Deno.statSync(path);
  if (!sceneDirectoryInfo.isDirectory) return;
  const manifestPath = getManifestPath(path);
  const manifestInfo = Deno.statSync(manifestPath);
  if (!manifestInfo.isFile) return;
  const sceneData = Deno.readTextFileSync(manifestPath);
  const scene = JSON.parse(sceneData);
  if (isValidScene(scene)) scenes.push(scene);
}

function loadedScenes(): Array<Scene> {
  return scenes;
}

export {
  loadScenes,
  loadedScenes,
}

export type { Scene }

