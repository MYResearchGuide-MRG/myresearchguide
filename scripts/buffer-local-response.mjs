// Send local preview resources as complete responses so loopback clients do
// not get stuck receiving streamed navigation data or JavaScript assets.
export function bufferLocalResponse(res) {
  const chunks = [];
  const originalEnd = res.end;
  const originalWriteHead = res.writeHead;
  let ended = false;

  function append(chunk, encoding) {
    if (chunk !== undefined && chunk !== null) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    }
  }

  res.flushHeaders = () => {};
  res.writeHead = function (status, statusMessage, headers) {
    this.statusCode = status;
    if (typeof statusMessage === "string") this.statusMessage = statusMessage;
    else headers = statusMessage;

    if (Array.isArray(headers)) {
      for (let i = 0; i < headers.length; i += 2) {
        this.appendHeader(headers[i], headers[i + 1]);
      }
    } else if (headers) {
      for (const [name, value] of Object.entries(headers)) this.setHeader(name, value);
    }
    return this;
  };
  res.write = function (chunk, encoding, callback) {
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = undefined;
    }
    append(chunk, encoding);
    if (callback) queueMicrotask(callback);
    return true;
  };
  res.end = function (chunk, encoding, callback) {
    if (ended) return this;
    ended = true;
    if (typeof chunk === "function") {
      callback = chunk;
      chunk = undefined;
    } else if (typeof encoding === "function") {
      callback = encoding;
      encoding = undefined;
    }
    append(chunk, encoding);
    const body = Buffer.concat(chunks);
    chunks.length = 0;
    this.removeHeader("Transfer-Encoding");
    if (this.statusCode !== 204 && this.statusCode !== 304) {
      this.setHeader("Content-Length", body.length);
    }
    this.writeHead = originalWriteHead;
    return originalEnd.call(this, body, callback);
  };
}
