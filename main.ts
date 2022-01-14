import router from './router.ts'
import { loadScenes, loadedScenes } from './manifest.ts';
import type { Scene } from './manifest.ts'

const app = router();

const args = Deno.args.slice(0);
if (!args.length || args.indexOf('--help') > -1) usage();
while (args.length > 1) {
  const arg = args.shift()!;
  if (arg.startsWith('--')) {
    console.log(`Unrecognized option ${arg}`);
    usage();
  } else {
    usage();
  }
}

const scenesDirectory = args[0];
  
loadScenes(scenesDirectory).then(() => logLoadedScenes());

function logLoadedScenes() {
  loadedScenes().forEach(s => console.log(`Loaded scene ${s.id}`));
}

function usage() {
  console.log('Usage: srscene [arguments] <path/to/scenes/folder>');
  console.log();
  console.log('Arguments:');
  console.log('    --help      Displays this help message');
  Deno.exit(0);
}

export { scenesDirectory }
