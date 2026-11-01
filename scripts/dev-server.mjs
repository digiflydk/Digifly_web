import { spawn } from "node:child_process";
const args = process.argv.slice(2);
let host = "0.0.0.0";
let port = process.env.PORT || "9002";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--host" || args[i] === "--hostname") host = args[++i];
  else if (args[i] === "--port" || args[i] === "-p") port = args[++i];
  else if (args[i] === "--strictPort") continue;
  else throw new Error(`Unsupported preview argument: ${args[i]}`);
}
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535)
  throw new Error("Invalid port");
const mode = process.env.DIGIFLY_PREVIEW_PRODUCTION === "1" ? "start" : "dev";
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", mode, "--hostname", host, "--port", port],
  { stdio: "inherit", env: process.env },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
