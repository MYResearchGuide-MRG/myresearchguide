import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import next from "next";
import { bufferLocalResponse } from "./buffer-local-response.mjs";

const hostname = "127.0.0.1";
const port = 3000;
const dir = fileURLToPath(new URL("../", import.meta.url));
const app = next({ dev: false, hostname, port, dir });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((req, res) => {
  // Reusing loopback connections can stall asset downloads in the local browser.
  // Keep this workaround confined to preview:local, outside the hosted server.
  res.setHeader("Connection", "close");
  // Avoid reusing incomplete downloads from earlier local builds, including
  // Next's otherwise immutable JavaScript and CSS assets.
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];
  const setHeader = res.setHeader;
  res.setHeader = function (name, value) {
    return setHeader.call(this, name, name.toLowerCase() === "cache-control" ? "no-store" : value);
  };
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    bufferLocalResponse(res);
  }
  handle(req, res);
});

server.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
  app.close();
});

server.listen(port, hostname, () => {
  console.log(`Local preview ready: http://myresearchguide.localhost:${port}`);
});

async function stop() {
  server.close();
  server.closeAllConnections();
  await app.close();
}

process.once("SIGINT", stop);
process.once("SIGTERM", stop);
