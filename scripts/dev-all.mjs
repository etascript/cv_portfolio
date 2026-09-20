import { spawn } from "node:child_process";
import { platform } from "node:os";

const useAltPorts = process.argv.includes("--alt");
const WEB_PORT = process.env.WEB_PORT ?? (useAltPorts ? "8004" : "8002");
const API_PORT = process.env.API_PORT ?? (useAltPorts ? "8005" : "8003");
const HOST = process.env.HOST ?? "127.0.0.1";
const npm = platform() === "win32" ? "npm.cmd" : "npm";

const children = [];

function run(label, args, env) {
  const child = spawn(npm, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    shell: platform() === "win32",
    stdio: ["inherit", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${label}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${label}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code && !shuttingDown) {
      console.error(`[${label}] exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
}

let shuttingDown = false;

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 200);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log(`Sebastian Cortes CV dev`);
console.log(`web: http://${HOST}:${WEB_PORT}`);
console.log(`api: http://${HOST}:${API_PORT}`);
console.log("");

run(
  "api",
  ["run", "dev", "--workspace", "@etascript/api"],
  {
    HOST,
    PORT: API_PORT,
    CORS_ORIGIN: `http://${HOST}:${WEB_PORT}`
  }
);

run(
  "web",
  ["run", "dev", "--workspace", "@etascript/web"],
  {
    WEB_PORT,
    VITE_DEV_API_TARGET: `http://${HOST}:${API_PORT}`
  }
);
