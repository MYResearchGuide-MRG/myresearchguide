import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = fileURLToPath(new URL("./serve-local.mjs", import.meta.url));
const env = {
  ...process.env,
  MRG_LOCAL_PREVIEW: "1",
  MRG_LOCAL_PREVIEW_ID: `local-${Date.now()}`,
};

function run(entry, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [entry, ...args], {
      cwd: root,
      env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Next.js exited with code ${code}`)));
  });
}

try {
  await run(cli, ["build", "--webpack"]);
  await run(server);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
