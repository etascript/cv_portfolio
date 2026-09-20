import { spawn } from "node:child_process";
import { platform } from "node:os";

const WEB_PORT = process.env.WEB_PORT ?? "8002";
const HOST = process.env.HOST ?? "127.0.0.1";
const startDev = process.argv.includes("--dev");
const npm = platform() === "win32" ? "npm.cmd" : "npm";
const children = [];
let shuttingDown = false;
let printedUrl = false;

function run(label, command, args, env = {}) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    shell: platform() === "win32",
    stdio: ["inherit", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => handleOutput(label, chunk));
  child.stderr.on("data", (chunk) => handleOutput(label, chunk));
  child.on("exit", (code) => {
    if (code && !shuttingDown) {
      console.error(`[${label}] exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
}

function handleOutput(label, chunk) {
  const text = chunk.toString();
  process.stdout.write(`[${label}] ${text}`);
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !printedUrl) {
    printedUrl = true;
    console.log("");
    console.log("Cloudflare Tunnel URL:");
    console.log(match[0]);
    console.log("");
  }
}

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Sebastian Cortes CV public preview");
console.log(`local web: http://${HOST}:${WEB_PORT}`);
console.log("tunnel: starting cloudflared quick tunnel");
console.log("");

if (startDev) {
  run("dev", npm, ["run", "dev"], {
    HOST,
    WEB_PORT,
    VITE_PUBLIC_TUNNEL: "true"
  });
}

run("tunnel", "cloudflared", ["tunnel", "--url", `http://localhost:${WEB_PORT}`]);
