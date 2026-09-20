import { execFile } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ports = process.argv.slice(2).length ? process.argv.slice(2) : ["8000", "8001", "8002", "8003", "8004", "8005"];

async function windowsListeners() {
  const { stdout } = await execFileAsync("netstat", ["-aon"]);
  const rows = stdout.split(/\r?\n/);

  return rows
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts[0] === "TCP" && parts[3] === "LISTENING")
    .map((parts) => ({
      address: parts[1],
      pid: parts[4],
      port: parts[1]?.match(/:(\d+)$/)?.[1]
    }))
    .filter((item) => ports.includes(item.port));
}

async function unixListeners() {
  const { stdout } = await execFileAsync("sh", ["-lc", `lsof -nP -iTCP -sTCP:LISTEN | awk 'NR>1 {print $1" "$2" "$9}'`]);
  return stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [command, pid, address] = line.trim().split(/\s+/);
      const port = address?.match(/:(\d+)$/)?.[1];
      return { command, pid, address, port };
    })
    .filter((item) => ports.includes(item.port));
}

async function processName(pid) {
  if (platform() === "win32") {
    try {
      const { stdout } = await execFileAsync("tasklist", ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"]);
      return stdout.split(",")[0]?.replaceAll("\"", "") || "unknown";
    } catch {
      return "unknown";
    }
  }

  try {
    const { stdout } = await execFileAsync("ps", ["-p", pid, "-o", "comm="]);
    return stdout.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

const listeners = platform() === "win32" ? await windowsListeners() : await unixListeners();

if (!listeners.length) {
  console.log(`No hay procesos escuchando en: ${ports.join(", ")}`);
  process.exit(0);
}

console.log("Puertos ocupados:");
for (const listener of listeners) {
  const name = listener.command ?? await processName(listener.pid);
  console.log(`- ${listener.port}: PID ${listener.pid} (${name}) en ${listener.address}`);
}
