import router from './router.ts'

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

loadScenes(args[0]);

function loadScenes(path: string) {
  console.log(`loading from ${path}`);
  let sceneDirectoryInfo: Deno.FileInfo;
  try {
    sceneDirectoryInfo = Deno.statSync(path);
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
  console.log(sceneDirectoryInfo);
}

function initScenesDirectory(path: string): void {
  console.log(`Init the scenes directory in ${path}`);
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
