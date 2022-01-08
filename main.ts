import router from './router.ts'
import { generateJSON, isValidManifest } from './manifest.ts'
import type { Manifest, Scene } from './manifest.ts'

const app = router();

const args = Deno.args.slice(0);
if (!args.length || args.indexOf('--help') > -1) usage();
while (args.length > 1) {
  const arg = args.shift()!;
  if (arg === '--init') {
    const path = args.pop()!;
    initScenesDirectory(path);
  } else if (arg.startsWith('--')) {
    console.log(`Unrecognized option ${arg}`);
    usage();
  } else {
    usage();
  }
}

function getScenesDirectoryInfo(path: string) {
  let sceneDirectoryInfo: Deno.FileInfo;
  try {
    sceneDirectoryInfo = Deno.statSync(path);
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
  if(!sceneDirectoryInfo.isDirectory) usage();
  return sceneDirectoryInfo;
}

function getManifestInfo(path: string) {
  let manifestInfo: Deno.FileInfo | null = null;
  try {
    manifestInfo = Deno.statSync(path);
  } catch {
  }
  return manifestInfo || null;
}

function getManifestPath(scenesDirectoryPath: string) {
  return `${scenesDirectoryPath}/manifest.json`;
}

function loadManifest(path: string): Manifest {
  const manifest = JSON.parse(Deno.readTextFileSync(path));
  if (!isValidManifest(manifest)) {
    console.log('Invalid manifest!');
    Deno.exit(1);
  } else {
    console.log('Valid manifest!!');
  }
  return manifest;
}
  
loadScenes(args[0]);

function loadScenes(path: string) {
  console.log(`Loading scenes from ${path}`);
  const sceneDirectoryInfo = getScenesDirectoryInfo(path);
  const manifestPath = getManifestPath(path);
  const manifestInfo = getManifestInfo(manifestPath);
  if (manifestInfo == null) {
    console.log(`Directory ${path} is not initialized; run 'srscene --init ${path}' first`);
    Deno.exit(1);
  }
  const manifest = loadManifest(manifestPath);
  console.log(manifest);
}

function initScenesDirectory(path: string): void {
  console.log(`Initializing the scenes directory in ${path}`);
  const sceneDirectoryInfo = getScenesDirectoryInfo(path);
  const manifestInfo = getManifestInfo(getManifestPath(path));
  if (manifestInfo !== null) {
    console.log(`Directory ${path} is already initialized; it already contains a manifest.json file`);
    Deno.exit(1);
  }
  Deno.writeTextFileSync(`${path}/manifest.json`, generateJSON());
  Deno.exit(0);
}

function usage() {
  console.log('Usage: srscene [arguments] <path/to/scenes/folder>');
  console.log();
  console.log('Arguments:');
  console.log('    --init      Initializes the scenes folder to hold scenes');
  console.log('    --help      Displays this help message');
  Deno.exit(0);
}
