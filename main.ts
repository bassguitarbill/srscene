import router from './router.ts'
import { generateJSON, isValidManifest, loadManifest, loadedManifest } from './manifest.ts'
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

function loadScenes(path: string) {
  console.log(`Loading scenes from ${path}`);
  const sceneDirectoryInfo = getScenesDirectoryInfo(path);
  const manifestPath = getManifestPath(path);
  const manifestInfo = getManifestInfo(manifestPath);
  if (manifestInfo == null) {
    console.log(`Directory ${path} is not initialized; run 'srscene --init ${path}' first`);
    Deno.exit(1);
  }
  loadManifest(manifestPath);
  console.log(loadedManifest());
}
  
loadScenes(args[0]);

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
