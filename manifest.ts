const MANIFEST_VERSION = '1.0';

function generateJSON() {
  return `{
  "version": "1.0",
  "scenes": [
  ]
}`;
}

type Manifest = {
  version: string,
  scenes: Array<Scene>,
}

type Scene = {
  id: string,
}

function isValidManifest(manifest: Manifest): boolean {
  return !!manifest.version
      && !!manifest.scenes
      && (manifest.scenes.filter(isValidScene).length === manifest.scenes.length);
}

function isValidScene(scene: Scene): boolean {
  return !!scene.id;
}


export {
  generateJSON,
  isValidManifest,
}

export type { Manifest, Scene }

