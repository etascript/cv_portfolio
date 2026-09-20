import { execFile } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ports = process.argv.slice(2).length ? process.argv.slice(2) : ["8002", "8003", "8004", "8005"];

async function windowsListeners() {
  const { stdout } = await execFileAsync("netstat", ["-aon"]);
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts[0] === "TCP" && parts[3] === "LISTENING")
    .map((parts) => ({
      port: parts[1]?.match(/:(\d+)$/)?.[1],
      pid: parts[4]
    }))
    .filter((item) => ports.includes(item.port));
}

async function windowsProcessName(pid) {
  const { stdout } = await execFileAsync("tasklist", ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"]);
  return stdout.split(",")[0]?.replaceAll("\"", "") || "";
}

async function unixListeners() {
  const { stdout } = await execFileAsync("sh", ["-lc", `lsof -nP -iTCP -sTCP:LISTEN | awk 'NR>1 {print $1" "$2" "$9}'`]);
  return stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [command, pid, address] = line.trim().split(/\s+/);
      const port = address?.match(/:(\d+)$/)?.[1];
      return { command, pid, port };
    })
    .filter((item) => ports.includes(item.port));
}

const listeners = platform() === "win32" ? await windowsListeners() : await unixListeners();

if (!listeners.length) {
  console.log(`Nada que liberar en: ${ports.join(", ")}`);
  process.exit(0);
}

let killed = 0;

for (const listener of listeners) {
  if (platform() === "win32") {
    const name = await windowsProcessName(listener.pid);
    if (name.toLowerCase() !== "node.exe") {
      console.log(`Saltando ${listener.port}: PID ${listener.pid} (${name || "unknown"}) no es node.exe`);
      continue;
    }
    await execFileAsync("taskkill", ["/PID", listener.pid, "/F"]);
    console.log(`Liberado ${listener.port}: PID ${listener.pid} (${name})`);
    killed += 1;
    continue;
  }

  if (listener.command !== "node") {
    console.log(`Saltando ${listener.port}: PID ${listener.pid} (${listener.command}) no es node`);
    continue;
  }
  await execFileAsync("kill", [listener.pid]);
  console.log(`Liberado ${listener.port}: PID ${listener.pid} (${listener.command})`);
  killed += 1;
}

if (!killed) {
  console.log("No se cerraron procesos. Revisa con npm run ports.");
}
