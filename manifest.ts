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

let manifest: Manifest | null = null;

function isValidManifest(manifest: Manifest | null): boolean {
  return !!manifest
      && !!manifest.version
      && !!manifest.scenes
      && (manifest.scenes.filter(isValidScene).length === manifest.scenes.length);
}

function isValidScene(scene: Scene): boolean {
  return !!scene.id;
}

function loadManifest(path: string): Manifest | null {
  manifest = JSON.parse(Deno.readTextFileSync(path));
  if (!isValidManifest(manifest)) {
    console.log('Invalid manifest!');
    Deno.exit(1);
  } else {
    console.log('Valid manifest!!');
  }
  return manifest;
}

function loadedManifest(): Manifest | null {
  return manifest;
}

function loadedScenes(): Array<Scene> {
  return manifest ? manifest.scenes : [];
}

export {
  generateJSON,
  isValidManifest,
  loadManifest,
  loadedManifest,
  loadedScenes,
}

export type { Manifest, Scene }

