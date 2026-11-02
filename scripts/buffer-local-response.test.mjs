import assert from "node:assert/strict";
import { createServer, get } from "node:http";
import { once } from "node:events";
import test from "node:test";
import { bufferLocalResponse } from "./buffer-local-response.mjs";

test("buffered navigation sends complete bytes and preserves status and headers", async () => {
  const server = createServer((req, res) => {
    bufferLocalResponse(res);
    res.writeHead(201, { "Content-Type": "text/x-component", "X-Test": "preserved" });
    res.flushHeaders();
    res.write("研究", "utf8");
    setTimeout(() => res.end(Buffer.from(" guide")), 10);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await new Promise((resolve, reject) => {
      const req = get(`http://127.0.0.1:${server.address().port}`, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
        res.on("error", reject);
      });
      req.setTimeout(1000, () => req.destroy(new Error("response stalled")));
      req.on("error", reject);
    });
    assert.equal(response.status, 201);
    assert.equal(response.headers["content-type"], "text/x-component");
    assert.equal(response.headers["x-test"], "preserved");
    assert.equal(response.headers["transfer-encoding"], undefined);
    assert.equal(response.body.toString(), "研究 guide");
    assert.equal(Number(response.headers["content-length"]), Buffer.byteLength("研究 guide"));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
