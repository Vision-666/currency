const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const transfers = [];

async function getLiveRates(base) {
  const response = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
  if (!response.ok) throw new Error("Live exchange rates are temporarily unavailable.");
  const data = await response.json();
  return { [base]: 1, ...data.rates };
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); } catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function serveFile(req, res) {
  const requested = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.normalize(path.join(publicDir, requested));
  if (!filePath.startsWith(publicDir)) return sendJson(res, 403, { error: "Forbidden" });
  fs.readFile(filePath, (error, data) => {
    if (error) return sendJson(res, 404, { error: "Not found" });
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
    res.writeHead(200, { "Content-Type": `${types[path.extname(filePath)] || "text/plain"}; charset=utf-8` });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/rates") {
    const base = (url.searchParams.get("base") || "USD").toUpperCase();
    try {
      return sendJson(res, 200, { base, rates: await getLiveRates(base), updatedAt: new Date().toISOString() });
    } catch (error) {
      return sendJson(res, 502, { error: error.message });
    }
  }
  if (req.method === "POST" && url.pathname === "/api/transfers") {
    try {
      const data = await readBody(req);
      const amount = Number(data.amount);
      if (!data.recipient || !data.email || !data.from || !data.to || !Number.isFinite(amount) || amount <= 0) {
        return sendJson(res, 400, { error: "Please provide valid recipient, email, currencies, and amount." });
      }
      const liveRates = await getLiveRates(data.from);
      const rate = liveRates[data.to];
      if (!rate) return sendJson(res, 400, { error: "Currency pair is not supported." });
      const transfer = {
        id: `FP-${randomUUID().slice(0, 8).toUpperCase()}`,
        recipient: data.recipient,
        email: data.email,
        from: data.from,
        to: data.to,
        amount: Number(amount.toFixed(2)),
        received: Number((amount * rate).toFixed(2)),
        status: "Processing",
        createdAt: new Date().toISOString()
      };
      transfers.unshift(transfer);
      return sendJson(res, 201, transfer);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/transfers") return sendJson(res, 200, transfers);
  if (req.method === "GET") return serveFile(req, res);
  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => console.log(`k4currency is running at http://localhost:${port}`));
